import { Request, Response, NextFunction } from "express";
import Department from "../models/Department.js";

// ================= CREATE =================
export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const existing = await Department.findOne({
      name: req.body.name.trim(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department already exists",
      });
    }

    const dept = await Department.create(req.body);

    res.status(201).json({
      success: true,
      data: dept,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate department not allowed",
      });
    }
    next(err);
  }
};

// ================= GET ALL =================
export const getDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const existing = await Department.findOne({
      name: req.body.name.trim(),
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department name already in use",
      });
    }

    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!dept) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.json({
      success: true,
      data: dept,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate department not allowed",
      });
    }
    next(err);
  }
};

// ================= DELETE =================
export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);

    if (!dept) {
      return res.status(404).json({
        success: false,
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

// ================= GET STATS ($lookup) =================
export const getDepartmentStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await Department.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "department",
          as: "employeesList",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          employeeCount: { $size: "$employeesList" },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};