const express = require("express");
const router = express.Router();
const {
  createQuiz,
  deleteQuiz,
  fetchQuizzes,
} = require("../controllers/quiz.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

// Single Quiz
router.post("/", verifyToken, createQuiz);
router.delete("/:quizId", verifyToken, deleteQuiz);
// router.put("/:quizId", verifyToken, editQuiz); TO-DO quizId as a param, edit data as a body
// router.get('/details', verifyToken, getQuizDetails) TO-DO fetch quiz details after opening it, quizId as a query

// Multiple Quizzes
router.get("/", verifyToken, fetchQuizzes);
// router.get("/liked", verifyToken, getLikedQuizzes) TO-DO fetch quizzes with selected userId in Ratings and rating: 1, userId as a query

module.exports = router;
