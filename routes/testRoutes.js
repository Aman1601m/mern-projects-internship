import express from "express";

const router = express.Router();

// GET /api/test
router.get("/", (req, res) => {
  res.json({ message: "Test API working 🚀" });
});

export default router;