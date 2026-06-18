import Department from "../models/Department.js";

// CREATE
export const createDepartment = async (req, res, next) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getDepartments = async (req, res, next) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (err) {
    next(err);
  }
};