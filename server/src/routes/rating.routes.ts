const express = require("express");
const router = express.Router();
const { addRating, deleteRating } = require("../controllers/rating.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, addRating);
router.delete("/:ratingId", verifyToken, deleteRating);
// router.put("/:ratingId", verifyToken, editRating); TO-DO
// router.get("/:ratingId", verifyToken, checkIfRated); TO-DO

module.exports = router;
