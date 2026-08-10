require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => res.json({ status: "ok", phase: 0 }));

app.listen(PORT, () => {
  console.log(`[backend] placeholder server running on port ${PORT}`);
});
