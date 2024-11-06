const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  addComment,
  deleteComment,
  getComments,
} = require("../controllers/comment.controller");

router.post("/", verifyToken, addComment);
router.delete("/:commentId", verifyToken, deleteComment); // TO-DO --- verify on postman
router.get("/", verifyToken, getComments);

module.exports = router;
