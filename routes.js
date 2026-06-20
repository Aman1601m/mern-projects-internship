const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("./authMiddleware");
const {
    registerUser,
    loginUser,
    getProfile,
    applyLeave,
    getMyLeaves,
    approveLeave,
    rejectLeave,
    getAllLeaves,
    getLeaveStats,
    getAllEmployees,
    getEmployeeById
} = require("./controllers");
router.post("/register", (req, res, next) => {
    console.log("REGISTER ROUTE HIT");
    next();
}, registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get(
    "/admin-dashboard",
    protect,
    authorizeRoles("Admin", "HR Manager"),
    (req, res) => {
        res.json({
            message: "Welcome to Admin Dashboard"
        });
    }
);
router.post(
    "/leave/apply",
    protect,
    applyLeave
);
router.get(
    "/leave/my",
    protect,

    getMyLeaves
);
router.put(
    "/leave/:id/approve",
    protect,
    authorizeRoles("Admin", "HR Manager"),
    approveLeave
);
router.put(
    "/leave/:id/reject",
    protect,
    authorizeRoles("Admin", "HR Manager"),
    rejectLeave
);
router.get(
    "/leave/all",
    protect,
    authorizeRoles("Admin", "HR Manager"),
    getAllLeaves
);
router.get(
    "/leave/stats",
    protect,
    authorizeRoles("Admin", "HR Manager"),
    getLeaveStats
);
router.get(
    "/employees",
    protect,
    authorizeRoles("Admin", "HR Manager"),
    getAllEmployees
);
router.get(
    "/employees/:id",
    protect,
    authorizeRoles("Admin", "HR Manager"),
    getEmployeeById
);

module.exports = router;