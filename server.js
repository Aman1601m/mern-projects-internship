import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

import { errorHandler } from "./middleware/errorMiddleware.js";
import departmentRoutes from "./routes/departmentRoutes.js";

// config
dotenv.config();

const app = express();

// body parser
app.use(express.json());

/* ================== SECURITY ================== */
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
});

app.use(limiter);

/* ================== ROUTES ================== */

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// error test route
app.get("/error", (req, res) => {
  throw new Error("Test Error");
});

// Department routes - Create and Get Departments
app.use("/api/departments", departmentRoutes);

/* ================== ERROR HANDLER ================== */
// Error handler middleware
app.use(errorHandler);

/* ================== DB CONNECTION ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });