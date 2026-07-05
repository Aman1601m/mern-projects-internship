import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";

/**
 * @desc Create Payroll
 * @route POST /api/payroll
 * @access HR/Admin
 */
export const createPayroll = async (req, res) => {
  try {
    const {
      employee,
      month,
      year,
      basicSalary,
      hra,
      allowances,
      deductions,
      paymentStatus,
      paymentDate,
    } = req.body;

    if (
      !employee ||
      !month ||
      !year ||
      basicSalary === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check employee exists
    const employeeExists = await Employee.findById(employee);

    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // Prevent duplicate payroll for same employee/month/year
    const existingPayroll = await Payroll.findOne({
      employee,
      month,
      year,
    });

    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message: "Payroll already exists for this employee.",
      });
    }

    const calculatedNetSalary =
      Number(basicSalary) +
      Number(hra || 0) +
      Number(allowances || 0) -
      Number(deductions || 0);

    const payroll = await Payroll.create({
      employee,
      month,
      year,
      basicSalary,
      hra,
      allowances,
      deductions,
      netSalary: calculatedNetSalary,
      paymentStatus,
      paymentDate,
    });

    res.status(201).json({
      success: true,
      message: "Payroll created successfully.",
      data: payroll,
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
 * @desc Get All Payroll Records
 * @route GET /api/payroll
 */
export const getPayrolls = async (req, res) => {

  try {

    const payrolls = await Payroll.find()
      .populate("employee")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/**
 * @desc Get Payroll By ID
 * @route GET /api/payroll/:id
 */
export const getPayrollById = async (req, res) => {

  try {

    const payroll = await Payroll.findById(req.params.id)
      .populate("employee");

    if (!payroll) {

      return res.status(404).json({
        success: false,
        message: "Payroll record not found.",
      });

    }

    res.status(200).json({
      success: true,
      data: payroll,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/**
 * @desc Update Payroll
 * @route PUT /api/payroll/:id
 */
export const updatePayroll = async (req, res) => {

  try {

    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {

      return res.status(404).json({
        success: false,
        message: "Payroll record not found.",
      });

    }

    Object.assign(payroll, req.body);

    payroll.netSalary =
      Number(payroll.basicSalary) +
      Number(payroll.hra) +
      Number(payroll.allowances) -
      Number(payroll.deductions);

    await payroll.save();

    res.status(200).json({
      success: true,
      message: "Payroll updated successfully.",
      data: payroll,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/**
 * @desc Delete Payroll
 * @route DELETE /api/payroll/:id
 */
export const deletePayroll = async (req, res) => {

  try {

    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {

      return res.status(404).json({
        success: false,
        message: "Payroll record not found.",
      });

    }

    await payroll.deleteOne();

    res.status(200).json({
      success: true,
      message: "Payroll deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};