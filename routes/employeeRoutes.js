import express from "express";
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
import { body } from "express-validator";

const router = express.Router();

// ================= CREATE =================
router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("profileImage"),
  createEmployee
);

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

// ================= GET ALL =================
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr", "employee"),
  getEmployees
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "hr", "employee"),
  getEmployeeById
);

// ================= DASHBOARD =================
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

// ================= UPDATE =================
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("profileImage"),
  updateEmployee
);

// ================= DELETE =================
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteEmployee
);

export default router;