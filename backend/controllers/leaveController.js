import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

/**
 * @desc Apply Leave
 * @route POST /api/leaves
 * @access Employee
 */
export const applyLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    } = req.body;

    // Validation
    if (!leaveType || !startDate || !endDate || !totalDays || !reason) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Auto-detect employee from JWT token
    let employeeId = req.body.employee;

    if (!employeeId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        const user = await User.findById(decoded.id);
        if (user) {
          const emp = await Employee.findOne({ email: user.email });
          if (emp) employeeId = emp._id;
        }
      }
    }

    if (!employeeId) {
      return res.status(404).json({
        success: false,
        message: "Employee record not found for this user.",
      });
    }

    // Verify employee exists
    const employeeExists = await Employee.findById(employeeId);
    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const leave = await Leave.create({
      employee: employeeId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully.",
      data: leave,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Leaves
 * @route GET /api/leaves
 * @access HR
 */
export const getLeaves = async (req, res) => {
  try {

    const leaves = await Leave.find()
      .populate("employee")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * @desc Get Leave By ID
 * @route GET /api/leaves/:id
 */
export const getLeaveById = async (req, res) => {

  try {

    const leave = await Leave.findById(req.params.id)
      .populate("employee")
      .populate("approvedBy", "name email");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: leave,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/**
 * @desc Approve / Reject Leave
 * @route PUT /api/leaves/:id/status
 * @access HR
 */
export const updateLeaveStatus = async (req, res) => {

  try {

    const { status, remarks, approvedBy } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
    }

    leave.status = status;
    leave.remarks = remarks || "";
    leave.approvedBy = approvedBy || null;

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully.`,
      data: leave,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/**
 * @desc Delete Leave
 * @route DELETE /api/leaves/:id
 */
export const deleteLeave = async (req, res) => {

  try {

    const leave = await Leave.findById(req.params.id);

    if (!leave) {

      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });

    }

    await leave.deleteOne();

    res.status(200).json({
      success: true,
      message: "Leave deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};