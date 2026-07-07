import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Payroll from "../models/Payroll.js";

/**
 * @desc Dashboard Statistics
 * @route GET /api/dashboard/stats
 * @access HR/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      totalPayrolls,
      paidPayrolls,
      pendingPayrolls,
    ] = await Promise.all([
      Employee.countDocuments(),

      Employee.countDocuments({
        status: "Active",
      }),

      Employee.countDocuments({
        status: "Inactive",
      }),

      Department.countDocuments(),

      Leave.countDocuments({
        status: "Pending",
      }),

      Leave.countDocuments({
        status: "Approved",
      }),

      Leave.countDocuments({
        status: "Rejected",
      }),

      Payroll.countDocuments(),

      Payroll.countDocuments({
        paymentStatus: "Paid",
      }),

      Payroll.countDocuments({
        paymentStatus: "Pending",
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,

        totalDepartments,

        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,

        totalPayrolls,
        paidPayrolls,
        pendingPayrolls,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};