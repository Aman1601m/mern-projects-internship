import Department from "../models/Department.js";

// CREATE
export const createDepartment = async (req, res, next) => {
  try {
    console.log("Creating Department:", req.body);
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getDepartments = async (req, res, next) => {
  try {
    console.log("Fetching all departments");
    const depts = await Department.find();
    res.json(depts);
  } catch (err) {
    next(err);
  }
};

// UPDATE

export const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(dept);
  } catch (err) {
    next(err);
  }
};

