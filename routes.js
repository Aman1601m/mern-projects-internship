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
    rejectLeave
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

module.exports = router;