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