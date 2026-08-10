const { io } = require("socket.io-client");
const http = require("http");

const BASE_URL = "http://localhost:3001";

function createClient(label) {
  const socket = io(BASE_URL, {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 2,
    timeout: 5000
  });

  socket.on("connect", () => {
    console.log(`[${label}] connected -> ${socket.id}`);
  });

  socket.on("chat:message", (message) => {
    console.log(`[${label}] received broadcast -> ${JSON.stringify(message)}`);
  });

  socket.on("chat:error", (payload) => {
    console.log(`[${label}] socket error payload -> ${JSON.stringify(payload)}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[${label}] disconnected -> ${reason}`);
  });

  socket.on("connect_error", (err) => {
    console.log(`[${label}] connect_error -> ${err.message}`);
  });

  return socket;
}

function fetchHistory() {
  http.get(`${BASE_URL}/messages`, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      console.log(`[REST history] ${data}`);
    });
  }).on("error", (err) => {
    console.error(`[REST history error] ${err.message}`);
  });
}

const aliceClient = createClient("AliceClient");
const bobClient = createClient("BobClient");

let readyCount = 0;
let finished = false;

function ready() {
  readyCount += 1;

  if (readyCount === 2) {
    setTimeout(() => {
      aliceClient.emit(
        "chat:send",
        { username: "Alice", text: "Hello from Socket Alice" },
        (ack) => console.log(`[Alice ack] ${JSON.stringify(ack)}`)
      );
    }, 500);

    setTimeout(() => {
      bobClient.emit(
        "chat:send",
        { username: "Bob", text: "Hello from Socket Bob" },
        (ack) => console.log(`[Bob ack] ${JSON.stringify(ack)}`)
      );
    }, 1200);

    setTimeout(() => {
      fetchHistory();
    }, 2200);

    setTimeout(() => {
      if (!finished) {
        finished = true;
        aliceClient.disconnect();
        bobClient.disconnect();
        process.exit(0);
      }
    }, 4000);
  }
}

aliceClient.on("connect", ready);
bobClient.on("connect", ready);

setTimeout(() => {
  if (!finished) {
    console.error("Smoke test timed out.");
    process.exit(1);
  }
}, 10000);
