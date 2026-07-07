import express from "express";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeAggregation,
  resetEmployeePassword,
  getProfile,
} from "../controllers/employeeController.js";

const router = express.Router();

// Employee CRUD
router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/aggregation", getEmployeeAggregation);
router.get("/profile", getProfile);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.put("/:id/reset-password", resetEmployeePassword);

export default router;