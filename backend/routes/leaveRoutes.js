import express from "express";

import {
  applyLeave,
  getLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
} from "../controllers/leaveController.js";

const router = express.Router();

// Employee
router.post("/", applyLeave);

// HR
router.get("/", getLeaves);
router.get("/:id", getLeaveById);
router.put("/:id/status", updateLeaveStatus);
router.delete("/:id", deleteLeave);

export default router;