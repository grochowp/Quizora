const express = require("express");
const router = express.Router();
const { createQuiz, deleteQuiz } = require("../controllers/quiz.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/createQuiz", verifyToken, createQuiz);
router.delete("/deleteQuiz", verifyToken, deleteQuiz);

module.exports = router;
