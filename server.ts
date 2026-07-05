import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import morgan from "morgan";
import logger from "./utils/logger.js";

import { errorHandler } from "./middleware/errorMiddleware.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

/* ================== LOGGING ================== */
app.use(morgan("dev"));

/* ================== SECURITY ================== */
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
});

app.use(limiter);

/* ================== ROUTES ================== */

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

/* ================== ERROR HANDLER ================== */
app.use(errorHandler);

/* ================== DB CONNECTION ================== */
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    logger.info("MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Database connection error: ", err);
  });