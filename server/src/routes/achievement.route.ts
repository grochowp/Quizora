const express = require("express");
const router = express.Router();
const { getAchievements } = require("../controllers/achievement.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/getAchievements", verifyToken, getAchievements);

module.exports = router;
