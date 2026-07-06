import express from "express";
import { body } from "express-validator";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
  getSalarySummary,
  getProfile,
  resetEmployeePassword,
} from "../controllers/employeeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("profileImage"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("salary").optional().isNumeric().withMessage("Salary must be a number"),
  ],
  createEmployee
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr", "employee"),
  getEmployees
);

router.get("/profile", protect, getProfile);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "hr", "employee"),
  getEmployeeById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("profileImage"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("salary").optional().isNumeric().withMessage("Salary must be a number"),
  ],
  updateEmployee
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteEmployee);

router.get(
  "/dashboard/stats",
  protect,
  authorizeRoles("admin", "hr"),
  getDashboardStats
);

router.get(
  "/dashboard/salary-summary",
  protect,
  authorizeRoles("admin", "hr"),
  getSalarySummary
);

router.put(
  "/:id/reset-password",
  protect,
  authorizeRoles("admin", "hr"),
  resetEmployeePassword
);

export default router;