const express = require("express");
const router = express.Router();
const { getAchievements } = require("../controllers/achievement.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getAchievements);
// router.post('/', verifyToken, addAchievements); To make it easier to add achievements via Postman :) delete later

module.exports = router;
