import Department from "../models/Department.js";

// ================= CREATE =================
export const createDepartment = async (req, res, next) => {
  try {
    console.log("Creating Department:", req.body);

    if (!req.body.name) {
      return res.status(400).json({
        message: "Department name is required",
      });
    }

    const existing = await Department.findOne({
      name: req.body.name.trim(),
    });
    
    const existing = await Department.findOne({ name: req.body.name });
    if (existing) {
      return res.status(400).json({
        message: "Department already exists",
      });
    }

    const dept = await Department.create(req.body);

    res.status(201).json({
      success: true,
      data: dept,
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET ALL =================
export const getDepartments = async (req, res, next) => {
  try {
    console.log("Fetching all departments");

    const depts = await Department.find();

    res.json({
      success: true,
      count: depts.length,
      data: depts,
    });
  } catch (err) {
    next(err);
  }
};

// ================= UPDATE =================
export const updateDepartment = async (req, res, next) => {
  try {
    console.log("Updating Department:", req.params.id);

    if (!req.body.name) {
      return res.status(400).json({
        message: "Department name is required",
      });
    }

    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!dept) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.json({
      success: true,
      data: dept,
    });
  } catch (err) {
    next(err);
  }
};

// ================= DELETE =================
export const deleteDepartment = async (req, res, next) => {
  try {
    console.log("Deleting Department:", req.params.id);

    const dept = await Department.findByIdAndDelete(req.params.id);

    if (!dept) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};