import express from "express";

import {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
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

// HR/Admin View Leaves
router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getLeaves
);

// HR/Admin Approve or Reject
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  updateLeaveStatus
);

export default router;