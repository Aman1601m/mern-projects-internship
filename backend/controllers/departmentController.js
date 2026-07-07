import Department from "../models/Department.js";

/**
 * Create Department
 */
export const createDepartment = async (req, res) => {
  try {
    const { name, code, description, status } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Department name and code are required.",
      });
    }

    const existingDepartment = await Department.findOne({
      $or: [{ name }, { code }],
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department already exists.",
      });
    }

    const department = await Department.create({
      name,
      code,
      description,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Departments
 */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};