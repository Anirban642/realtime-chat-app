const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

const messagesRouter = require("./routes/messages");
const registerChatHandlers = require("./sockets/chatSocket");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

registerChatHandlers(io);

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    realtime: "socket.io-enabled"
  });
});

app.use("/messages", messagesRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("[error]", err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[backend] Server running on port ${PORT}`);
});

module.exports = { app, server, io };
