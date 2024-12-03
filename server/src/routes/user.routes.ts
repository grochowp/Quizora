const express = require("express");
const router = express.Router();
const {
  register,
  login,
  deleteUser,
  editProfilePicture,
  editPreferences,
  editProfile,
  getUser,
  getMultipleUsers,
  addFinishedQuizData,
  changeDisplayedTitles,
} = require("../controllers/user.controller");
const { verifyToken, userTokenData } = require("../middlewares/authMiddleware");

// User profile
router.post("/userTokenData", userTokenData);
router.post("/register", register);
router.post("/login", login);
router.delete("/", verifyToken, deleteUser);
router.patch("/preferences", verifyToken, editPreferences);
router.patch("/editProfilePicture/", verifyToken, editProfilePicture);
router.patch("/", verifyToken, editProfile);
router.patch("/titles", verifyToken, changeDisplayedTitles);
router.patch("/finishQuiz/:quizId", verifyToken, addFinishedQuizData);

// Other people profiles
router.get("/ranking", getMultipleUsers);
router.get("/:userId", getUser);

module.exports = router;
