import express from "express";
import { createPayroll } from "../controllers/payrollController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  createPayroll
);

export default router;