const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("./authMiddleware");
const {
    registerUser,
    loginUser,
    getProfile
} = require("./controllers");
router.post("/register", registerUser);
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
module.exports = router;