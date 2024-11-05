const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

// router.post("/", verifyToken, addRating); TO-DO
// router.delete("/:ratingId", verifyToken, addRating); TO-DO
// router.put("/:ratingId", verifyToken, deleteRating); TO-DO

module.exports = router;
