const express = require("express");
const router = express.Router();
const {
  createQuiz,
  deleteQuiz,
  editQuiz,
  fetchQuizzes,
  getQuizDetails,
  changeQuizStatus,
} = require("../controllers/quiz.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

// Single Quiz
router.post("/", verifyToken, createQuiz);
router.delete("/:quizId", verifyToken, deleteQuiz);
router.put("/:quizId", verifyToken, editQuiz);
router.get("/:quizId", getQuizDetails);
router.patch("/:quizId", verifyToken, changeQuizStatus);

// Multiple Quizzes
router.get("/", fetchQuizzes);

module.exports = router;
