import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

/**
 * @desc Apply Leave
 * @route POST /api/leaves
 * @access Employee
 */
export const applyLeave = async (req, res) => {
  try {
    const {
      employee,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    } = req.body;

    // Validation
    if (
      !employee ||
      !leaveType ||
      !startDate ||
      !endDate ||
      !totalDays ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check employee exists
    const employeeExists = await Employee.findById(employee);

    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const leave = await Leave.create({
      employee,
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
    console.error(error);

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