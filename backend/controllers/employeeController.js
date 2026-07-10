import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @desc Create Employee
 * @route POST /api/employees
 * @access HR Manager / Admin
 */
export const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      manager,
      joiningDate,
      salary,
      status,
    } = req.body;

    // Required field validation
    if (
      !employeeId ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !department ||
      !designation ||
      !joiningDate ||
      !salary
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check duplicate employee
    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId }, { email }],
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists.",
      });
    }

    // Verify Department exists
    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    // Create Employee
    const employee = await Employee.create({
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      manager: manager || null,
      joiningDate,
      salary,
      status,
    });

    // Populate department before returning
    const populatedEmployee = await Employee.findById(employee._id)
      .populate("department")
      .populate("manager", "firstName lastName email");

    res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: populatedEmployee,
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
 * @desc Get All Employees
 * @route GET /api/employees
 * @access HR Manager
 */
export const getEmployees = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const keyword = req.query.search
      ? {
          $or: [
            {
              firstName: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              employeeId: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: req.query.search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const totalEmployees = await Employee.countDocuments(keyword);

    const employees = await Employee.find(keyword)
      .populate("department")
      .populate("manager", "firstName lastName")
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalEmployees / limit),
      totalEmployees,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Employee By ID
 * @route GET /api/employees/:id
 */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department")
      .populate("manager", "firstName lastName email");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Employee
 * @route PUT /api/employees/:id
 */
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    Object.assign(employee, req.body);

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .populate("department")
      .populate("manager", "firstName lastName");

    res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete Employee
 * @route DELETE /api/employees/:id
 */
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Employee Aggregation
 * @route GET /api/employees/aggregation
 */
export const getEmployeeAggregation = async (req, res) => {
  try {
    const employees = await Employee.aggregate([
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "manager",
          foreignField: "_id",
          as: "manager",
        },
      },
      {
        $unwind: {
          path: "$manager",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          employeeId: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          designation: 1,
          salary: 1,
          status: 1,

          department: {
            _id: "$department._id",
            name: "$department.name",
            code: "$department.code",
          },

          manager: {
            _id: "$manager._id",
            firstName: "$manager.firstName",
            lastName: "$manager.lastName",
            email: "$manager.email",
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
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
 * @desc Reset Employee Password
 * @route PUT /api/employees/:id/reset-password
 * @access HR Manager / Admin
 */
export const resetEmployeePassword = async (req, res) => {
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
      message: `Password reset successfully for ${emp.firstName} ${emp.lastName}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Logged-in User/Employee Profile
 * @route GET /api/employees/profile
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

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
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};