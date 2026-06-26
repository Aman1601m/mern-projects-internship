import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import { protect } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create Employee
router.post(
    "/",
    protect,
    authorizeRoles("admin","hr"),
    upload.single("profileImage"),
    createEmployee
);
// View Employees
router.get(
  "/",
  protect,
  checkPermission("view_employee"),
  getEmployees
);

// Update Employee
router.put(
  "/:id",
  protect,
  checkPermission("update_employee"),
  updateEmployee
);

// Delete Employee
router.delete(
  "/:id",
  protect,
  checkPermission("delete_employee"),
  deleteEmployee
);


export default router;