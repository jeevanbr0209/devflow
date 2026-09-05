const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const protect = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = 5000;
const client = new MongoClient(process.env.MONGODB_URI);

let projectsCollection;

// =========================================
// MONGOOSE CONNECTION
// =========================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Mongoose connected successfully ✅");
  })
  .catch((error) => {
    console.error("Mongoose connection failed ❌");
    console.error(error);
  });

// =========================================
// MONGODB CONNECTION
// =========================================

async function connectDatabase() {
  try {
    await client.connect();

    const database = client.db("firstdb");

    projectsCollection = database.collection("projects");

    console.log("MongoDB connected successfully ✅");

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

// =========================================
// HEALTH CHECK
// =========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "DevFlow API is running 🚀",
  });
});

// =========================================
// GET USER'S PROJECTS
// =========================================

app.get("/api/projects", protect, async (req, res) => {
  try {
    const projects = await projectsCollection
      .find({
        userId: req.userId,
      })
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

// =========================================
// CREATE PROJECT
// =========================================

app.post("/api/projects", protect, async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        message: "Project name and description are required",
      });
    }

    // Find highest ID
    const lastProject = await projectsCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const newId =
      lastProject.length > 0
        ? lastProject[0].id + 1
        : 1;

    const newProject = {
      id: newId,
      userId: req.userId,
      name,
      description,
      status: status || "Planned",
    };

    await projectsCollection.insertOne(newProject);

    res.status(201).json({
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

// =========================================
// UPDATE PROJECT
// =========================================

app.put("/api/projects/:id", protect, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { name, description, status } = req.body;

    const result = await projectsCollection.updateOne(
      {
        id: id,
        userId: req.userId,
      },
      {
        $set: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && {
            description,
          }),
          ...(status !== undefined && { status }),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const updatedProject =
      await projectsCollection.findOne({
        id: id,
        userId: req.userId,
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

// =========================================
// DELETE PROJECT
// =========================================

app.delete(
  "/api/projects/:id",
  protect,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const result =
        await projectsCollection.deleteOne({
          id: id,
          userId: req.userId,
        });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      res.json({
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete project",
      });
    }
  }
);

// =========================================
// START SERVER
// =========================================

connectDatabase();