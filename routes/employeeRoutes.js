import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "hr"), createEmployee);

router.get("/", protect, getEmployees);

router.put("/:id", protect, authorizeRoles("admin", "hr"), updateEmployee);

router.delete("/:id", protect, authorizeRoles("admin"), deleteEmployee);

export default router;