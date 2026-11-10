import express from "express";
import jwt from "jsonwebtoken";
import Task from "./Task.js";

const router = express.Router();

// Check user login
function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(req.headers.authorization.split(" "));
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
}

// GET: Get all active tasks of logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
      deletedAt: null,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// POST: Create a new task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      userId: req.userId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// DELETE: Soft delete a task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
        deletedAt: null,
      },
      {
        $set: { deletedAt: new Date() },
      },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
