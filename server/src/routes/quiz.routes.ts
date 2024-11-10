const express = require("express");
const router = express.Router();
const {
  createQuiz,
  deleteQuiz,
  fetchQuizzes,
  getQuizDetails,
  changeQuizStatus,
} = require("../controllers/quiz.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

// Single Quiz
router.post("/", verifyToken, createQuiz);
router.delete("/:quizId", verifyToken, deleteQuiz);
// router.put("/:quizId", verifyToken, editQuiz); TO-DO quizId as a param, edit data as a body
router.get("/:quizId", getQuizDetails);
router.patch("/:quizId", verifyToken, changeQuizStatus);

// Multiple Quizzes
router.get("/", verifyToken, fetchQuizzes);

module.exports = router;
