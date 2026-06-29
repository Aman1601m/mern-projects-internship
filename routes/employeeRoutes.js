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

const router = express.Router();

// ================= CREATE =================
router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("profileImage"),
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