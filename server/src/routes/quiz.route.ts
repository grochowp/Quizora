const express = require("express");
const router = express.Router();
const { createQuiz } = require("../controllers/quiz.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/createQuiz", verifyToken, createQuiz);

module.exports = router;
