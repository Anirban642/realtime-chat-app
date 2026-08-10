const MessageStore = require("../models/messageStore");

function registerChatHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id} | clients: ${io.engine.clientsCount}`);

    socket.on("chat:send", (payload, ack) => {
      try {
        const message = MessageStore.create(payload || {});
        io.emit("chat:message", message);

        if (typeof ack === "function") {
          ack({ ok: true, message });
        }
      } catch (err) {
        console.error(`[socket] chat:send error from ${socket.id}: ${err.message}`);

        if (typeof ack === "function") {
          ack({ ok: false, error: err.message });
        } else {
          socket.emit("chat:error", { error: err.message || "Failed to send message" });
        }
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`[socket] disconnected: ${socket.id} | reason: ${reason} | clients: ${io.engine.clientsCount}`);
    });

    socket.on("error", (err) => {
      console.error(`[socket] error on ${socket.id}:`, err.message || err);
    });
  });
}

module.exports = registerChatHandlers;
