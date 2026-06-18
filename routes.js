const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("./authMiddleware");
const {
    registerUser,
    loginUser,
    getProfile,
    applyLeave
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

module.exports = router;