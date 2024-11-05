const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { getComments } = require("../controllers/comment.controller");

router.get("/:quizId", verifyToken, getComments);

module.exports = router;
