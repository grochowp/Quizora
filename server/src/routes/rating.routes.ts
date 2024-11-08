const express = require("express");
const router = express.Router();
const {
  addRating,
  deleteRating,
  checkIfRated,
} = require("../controllers/rating.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, addRating);
router.delete("/:ratingId", verifyToken, deleteRating);
router.get("/:quizId", verifyToken, checkIfRated); //TO-DO check while opening quizDetails - can`t do in the same endpoint as fetching quizDetails because not logged users can fetch details, while only logged ones can see do anything with ratings

module.exports = router;
