const express = require("express");
const router = express.Router();
const {
  createQuiz,
  deleteQuiz,
  getQuizzesByUserId,
} = require("../controllers/quiz.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, createQuiz);
router.delete("/", verifyToken, deleteQuiz);
router.get("/getQuizzesByUserId", verifyToken, getQuizzesByUserId);

module.exports = router;
