import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import traitsRouter from "./routes/traits.js"; // <- import your router

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use("/traits", traitsRouter); // <- mount your router

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

