import express from "express";
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

// CREATE
router.post("/", createDepartment);

// GET ALL
router.get("/", getDepartments);

// UPDATE
router.put("/:id", updateDepartment);

// DELETE
router.delete("/:id", deleteDepartment);

export default router;