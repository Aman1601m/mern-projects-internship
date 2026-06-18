import Employee from "../models/Employee.js";

// CREATE
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

// GET ALL
export const getEmployees = async (req, res, next) => {
  try {
    const emps = await Employee.find().populate("department");

    res.json({
      success: true,
      data: emps,
    });
  } catch (err) {
    next(err);
  }
};