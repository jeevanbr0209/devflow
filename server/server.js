const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "DevFlow API is running 🚀"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`DevFlow server running on http://localhost:${PORT}`);
});