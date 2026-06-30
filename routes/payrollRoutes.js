import express from "express";
import {
  createPayroll,
  getPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} from "../controllers/payrollController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "hr"), createPayroll);

router.get("/", protect, authorizeRoles("admin", "hr"), getPayrolls);

router.get("/:id", protect, authorizeRoles("admin", "hr"), getPayrollById);

router.put("/:id", protect, authorizeRoles("admin", "hr"), updatePayroll);

router.delete("/:id", protect, authorizeRoles("admin"), deletePayroll);

export default router;