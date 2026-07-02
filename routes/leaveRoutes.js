import express from "express";
import {
  applyLeave,
  getLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
} from "../controllers/leaveController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Employee Apply Leave
router.post(
  "/",
  protect,
  authorizeRoles("employee"),
  applyLeave
);

// HR/Admin View All Leaves
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getLeaves
);

// Get Single Leave
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "hr", "employee"),
  getLeaveById
);

// Approve / Reject Leave
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  updateLeaveStatus
);

// Delete Leave
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteLeave
);

export default router;