import Leave from "../models/Leave.js";

// Apply Leave
export const applyLeave = async (req, res, next) => {
  try {
    const leave = await Leave.create(req.body);

    res.status(201).json({
      success: true,
      data: leave,
    });
  } catch (err) {
    next(err);
  }
};

// Get All Leaves
export const getLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find().populate("employee");

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (err) {
    next(err);
  }
};

// Update Leave Status
export const updateLeaveStatus = async (req, res, next) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: leave,
    });

  } catch (err) {
    next(err);
  }
};