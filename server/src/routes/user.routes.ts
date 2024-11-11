const express = require("express");
const router = express.Router();
const {
  register,
  login,
  // editProfilePicture,

  editPreferences,
  getUser,
  getMultipleUsers,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

// User profile
router.post("/register", register);
router.post("/login", login);
// router.patch("/editProfilePicture/:imgSource", verifyToken, editProfilePicture); TO-DO change profile picture (User)
// router.patch('/:userId', verifyToken, editProfile); TO-DO profile data as a query/body (User, UserPrivate, UserProfile)

// router.patch('/titles/:userId', verifyToken, changeTitles) TO-DO change titles from settings (User)
router.patch("/preferences", verifyToken, editPreferences);
// router.patch("finishQuiz/:userId", verifyToken, addFinishedQuizData); TO-DO add points, finishedQuizzes+1

// Other people profiles
router.get("/ranking", getMultipleUsers);
router.get("/:userId", getUser);

module.exports = router;
