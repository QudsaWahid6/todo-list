import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import authRoutes from "./backend/auth.js";
import taskRoutes from "./backend/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected successfully");

export default app;
