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
app.get("/api/projects", (req, res) => {
  res.json([
    {
      id: 1,
      name: "DevFlow",
      description: "Developer Workspace"
    }
  ]);
});

app.post("/api/projects", (req, res) => {
  const { name, description } = req.body;

  res.json({
    message: "Project created successfully 🚀",
    project: {
      name,
      description
    }
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`DevFlow server running on http://localhost:${PORT}`);
});