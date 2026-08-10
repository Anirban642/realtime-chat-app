// In-memory message store
// Structured so swapping to SQLite later only changes this file, not the API
const { v4: uuidv4 } = require("uuid");

const messages = [];

const MessageStore = {
  getAll: () => messages,

  create: ({ username, text }) => {
    if (!username || typeof username !== "string" || username.trim() === "") {
      throw Object.assign(new Error("username is required"), { status: 400 });
    }
    if (!text || typeof text !== "string" || text.trim() === "") {
      throw Object.assign(new Error("text is required"), { status: 400 });
    }
    const message = {
      id: uuidv4(),
      username: username.trim(),
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    messages.push(message);
    return message;
  }
};

module.exports = MessageStore;
