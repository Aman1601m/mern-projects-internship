import { permissions } from "../config/roles.js";

export const checkPermission = (permission) => {
  return (req, res, next) => {

    const role = req.user.role;

    if (!permissions[role]?.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    next();
  };
};