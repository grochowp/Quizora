const express = require("express");
const router = express.Router();
const {
  getAchievements,
  addAchievements,
} = require("../controllers/achievement.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getAchievements);
// router.post("/", addAchievements); // SELF-NOTE only to make it easier to add achievements - DELETE BEFORE DEPLOY

module.exports = router;
