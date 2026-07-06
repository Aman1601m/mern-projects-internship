import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

// ================= CREATE =================
export const createEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    if (!req.body.name || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    const existingEmp = await Employee.findOne({ email: req.body.email });
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingEmp || existingUser) {
      return res.status(400).json({
        success: false,
        message: "Employee or User already exists with this email",
      });
    }

    const firstName = req.body.name.split(" ")[0].toLowerCase();
    const defaultPassword = `${firstName}123`;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "employee"
    });

    const emp = await Employee.create({
      ...req.body,
      profileImage: req.file ? req.file.filename : "",
    });

    res.status(201).json({
      success: true,
      data: emp,
      message: `Employee created. Default password: ${defaultPassword}`
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET ALL =================
export const getEmployees = async (req, res, next) => {
  try {
    const {
      search,
      department,
      page = 1,
      limit = 5,
    } = req.query;

    let query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (department) {
      query.department = department;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const employees = await Employee.find(query)
      .populate("department")
      .skip(skip)
      .limit(limitNumber);

    const total = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      data: employees,
    });

  } catch (err) {
    next(err);
  }
};

// ================= GET SINGLE =================
export const getEmployeeById = async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id).populate("department");

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: emp,
    });

  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Admins might not have an Employee record, so we return basic info
    const emp = await Employee.findOne({ email: user.email }).populate("department");
    if (!emp) {
       return res.status(200).json({
         success: true,
         data: {
           name: user.name,
           email: user.email,
           designation: user.role === "admin" ? "Administrator" : "HR Manager",
           _id: user._id
         }
       });
    }

    res.status(200).json({
      success: true,
      data: emp,
    });
  } catch (err) {
    next(err);
  }
};

// ================= UPDATE =================
export const updateEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    if (!req.body.name || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    const existing = await Employee.findOne({
      email: req.body.email,
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
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

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};

// ================= DASHBOARD =================
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const totalDepartments = await Department.countDocuments();

    const totalSalary = await Employee.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$salary" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments,
        totalSalary: totalSalary[0]?.total || 0,
      },
    });

  } catch (err) {
    next(err);
  }
};

// ================= SALARY SUMMARY =================
export const getSalarySummary = async (req, res, next) => {
  try {
    const summary = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
          averageSalary: { $avg: "$salary" },
          highestSalary: { $max: "$salary" },
          lowestSalary: { $min: "$salary" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: summary[0] || {
        totalSalary: 0,
        averageSalary: 0,
        highestSalary: 0,
        lowestSalary: 0,
      },
    });

  } catch (err) {
    next(err);
  }
};

// ================= RESET PASSWORD =================
export const resetEmployeePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const emp = await Employee.findById(id);
    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const user = await User.findOne({ email: emp.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found for this employee",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Password reset successfully for ${emp.name}`,
    });
  } catch (err) {
    next(err);
  }
};