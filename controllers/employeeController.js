import Employee from "../models/Employee.js";

// ================= CREATE =================
export const createEmployee = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email required",
      });
    }

    const emp = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      data: emp,
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET ALL =================
export const getEmployees = async (req, res, next) => {
  try {

    const { search } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const emps = await Employee.find().populate("department");

    res.json({
      success: true,
      data: emps,
    });
  } catch (err) {
    next(err);
  }
};

// ================= UPDATE =================
export const updateEmployee = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email required",
      });
    }

    // duplicate email check
    const existing = await Employee.findOne({
      email: req.body.email,
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      data: emp,
    });
  } catch (err) {
    next(err);
  }
};

// ================= DELETE =================
export const deleteEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};