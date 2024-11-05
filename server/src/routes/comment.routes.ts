const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { getComments } = require("../controllers/comment.controller");

// router.post("/", verifyToken, addComment);  TO-DO
// router.delete("/:commentId", verifyToken, deleteComment); TO-DO
router.get("/", verifyToken, getComments);

module.exports = router;
