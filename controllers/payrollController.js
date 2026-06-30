import Payroll from "../models/Payroll.js";

export const createPayroll = async (req, res, next) => {
  try {
    const {
      employee,
      basicSalary,
      bonus,
      deduction,
      month,
      year,
    } = req.body;

    const netSalary =
      Number(basicSalary) +
      Number(bonus || 0) -
      Number(deduction || 0);

    const payroll = await Payroll.create({
      employee,
      basicSalary,
      bonus,
      deduction,
      netSalary,
      month,
      year,
    });

    res.status(201).json({
      success: true,
      data: payroll,
    });

  } catch (err) {
    next(err);
  }
};
// ================= GET ALL PAYROLL =================
export const getPayrolls = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().populate("employee");

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls,
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET SINGLE PAYROLL =================
export const getPayrollById = async (req, res, next) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate("employee");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (err) {
    next(err);
  }
};