const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  addComment,
  deleteComment,
  getComments,
} = require("../controllers/comment.controller");

router.post("/", verifyToken, addComment);
router.delete("/:commentId", verifyToken, deleteComment);
router.get("/", getComments);

module.exports = router;
