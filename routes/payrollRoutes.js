import express from "express";

import {
  createPayroll,
  getPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
  downloadPayslip,
} from "../controllers/payrollController.js";

const router = express.Router();

/**
 * Payroll Routes
 */

// Create Payroll
router.post("/", createPayroll);

// Get All Payroll Records
router.get("/", getPayrolls);

// Download Payslip
router.get("/:id/payslip", downloadPayslip);

// Get Payroll By ID
router.get("/:id", getPayrollById);

// Update Payroll
router.put("/:id", updatePayroll);

// Delete Payroll
router.delete("/:id", deletePayroll);



export default router;