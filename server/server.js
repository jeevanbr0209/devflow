const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const client = new MongoClient(process.env.MONGODB_URI);

let projectsCollection;

// Connect to MongoDB
async function connectDatabase() {
  try {
    await client.connect();

    const database = client.db("firstdb");
    projectsCollection = database.collection("projects");

    console.log("MongoDB connected successfully ✅");

    // Create default project if collection is empty
    const projectCount = await projectsCollection.countDocuments();

    if (projectCount === 0) {
      await projectsCollection.insertOne({
        id: 1,
        name: "DevFlow",
        description: "Developer Workspace",
        status: "In Progress",
      });

      console.log("Default project created 🚀");
    }

    app.listen(PORT, () => {
      console.log(
        `DevFlow server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error);
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "DevFlow API is running 🚀",
  });
});

// GET all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await projectsCollection
      .find({})
      .sort({ id: 1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
});

// CREATE a project
app.post("/api/projects", async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Find the highest existing ID
    const lastProject = await projectsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const newId =
      lastProject.length > 0 ? lastProject[0].id + 1 : 1;

    const newProject = {
      id: newId,
      name,
      description,
      status: status || "Planned",
    };

    await projectsCollection.insertOne(newProject);

    res.json({
      message: "Project created successfully 🚀",
      project: newProject,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create project",
    });
  }
});

// UPDATE a project
app.put("/api/projects/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { name, description, status } = req.body;

    const result = await projectsCollection.updateOne(
      { id: id },
      {
        $set: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(status !== undefined && { status }),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const updatedProject = await projectsCollection.findOne({
      id: id,
    });

    res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update project",
    });
  }
});

// DELETE a project
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await projectsCollection.deleteOne({
      id: id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully 🗑️",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete project",
    });
  }
});

// Start application
connectDatabase();