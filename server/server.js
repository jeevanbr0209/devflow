
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "DevFlow API is running 🚀"
  });
});

// Projects data
let projects = [
  {
    id: 1,
    name: "DevFlow",
    description: "Developer Workspace"
  }
];

// GET all projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// CREATE a project
app.post("/api/projects", (req, res) => {
  const { name, description } = req.body;

  const newProject = {
    id: projects.length + 1,
    name,
    description
  };

  projects.push(newProject);

  res.json({
    message: "Project created successfully 🚀",
    project: newProject
  });
});

// DELETE a project
app.delete("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);

  const projectExists = projects.some((project) => project.id === id);

  if (!projectExists) {
    return res.status(404).json({
      message: "Project not found"
    });
  }

  projects = projects.filter((project) => project.id !== id);

  res.json({
    message: "Project deleted successfully 🗑️"
  });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`DevFlow server running on http://localhost:${PORT}`);
});

