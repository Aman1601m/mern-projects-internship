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
    const { search, department, page = 1, limit = 5 } = req.query;

    let query = {};

    // SEARCH (by name)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // FILTER (by department)
    if (department) {
      query.department = department;
    }

    // PAGINATION
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // DB call
    const emps = await Employee.find(query)
      .populate("department")
      .skip(skip)
      .limit(limitNumber);

    // total count
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