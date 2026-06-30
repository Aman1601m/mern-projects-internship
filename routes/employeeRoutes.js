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
} from "../controllers/employeeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ================= CREATE EMPLOYEE =================
router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("profileImage"),
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("salary")
      .optional()
      .isNumeric()
      .withMessage("Salary must be a number"),
  ],
  createEmployee
);

// ================= GET ALL EMPLOYEES =================
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr", "employee"),
  getEmployees
);

// ================= GET SINGLE EMPLOYEE =================
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "hr", "employee"),
  getEmployeeById
);

// ================= UPDATE EMPLOYEE =================
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("profileImage"),
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("salary")
      .optional()
      .isNumeric()
      .withMessage("Salary must be a number"),
  ],
  updateEmployee
);

// ================= DELETE EMPLOYEE =================
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteEmployee
);

// ================= DASHBOARD STATS =================
router.get(
  "/dashboard/stats",
  protect,
  authorizeRoles("admin", "hr"),
  getDashboardStats
);

// ================= SALARY SUMMARY =================
router.get(
  "/dashboard/salary-summary",
  protect,
  authorizeRoles("admin", "hr"),
  getSalarySummary
);

export default router;