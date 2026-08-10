const express = require("express");
const router = express.Router();
const MessageStore = require("../models/messageStore");

// GET /messages — fetch full chat history
router.get("/", (req, res, next) => {
  try {
    const messages = MessageStore.getAll();
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// POST /messages — create a new message (REST path; real-time path goes via socket)
router.post("/", (req, res, next) => {
  try {
    const { username, text } = req.body;
    const message = MessageStore.create({ username, text });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
