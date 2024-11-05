import {
  createQuiz,
  deleteQuiz,
  getQuizzesByUserId,
} from "../controllers/quiz.controller";
import { verifyToken } from "../middlewares/authMiddleware";

const express = require("express");
const router = express.Router();

router.post("/createQuiz", verifyToken, createQuiz);
router.delete("/deleteQuiz", verifyToken, deleteQuiz);
router.get("/getQuizzesByUserId", verifyToken, getQuizzesByUserId);

export default router;
