import Employee from "../models/Employee.js";

// ================= CREATE =================
export const createEmployee = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    // Duplicate Email Check
    const existing = await Employee.findOne({
      email: req.body.email,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists with this email",
      });
    }

    const emp = await Employee.create({
      ...req.body,
      profileImage: req.file ? req.file.filename : "",
    });

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

    const {
      search,
      department,
      page = 1,
      limit = 5,
    } = req.query;

    let query = {};

    // Search by Name
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by Department
    if (department) {
      query.department = department;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const emps = await Employee.find(query)
      .populate("department")
      .skip(skip)
      .limit(limitNumber);

    const total = await Employee.countDocuments(query);

    res.json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
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
        message: "Name and Email are required",
      });
    }

    // Duplicate Email Check
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

    const updateData = {
      ...req.body,
    };

    // Update Image if Uploaded
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

    res.json({
      success: true,
      data: emp,
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

    const emp = await Employee.findByIdAndDelete(
      req.params.id
    );

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

    res.json({
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

    res.json({
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