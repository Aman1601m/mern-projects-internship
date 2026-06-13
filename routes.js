const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser
}
=
require("./controllers");
router.post(
    "/register",
    registerUser
);
router.post(
    "/login",
    loginUser
);
module.exports = router;
const { protect } = require("./authMiddleware");
const {
    registerUser,
    loginUser,
    getProfile
} = require("./controllers");
router.get("/profile", protect, getProfile);