import express from "express";
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
} from "../controllers/departmentController.js";

const router = express.Router();

router.get("/stats", getDepartmentStats);
router.post("/", createDepartment);
router.get("/", getDepartments);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;