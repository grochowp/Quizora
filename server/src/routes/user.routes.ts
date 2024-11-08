const express = require("express");
const router = express.Router();
const {
  register,
  login,
  editProfilePicture,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

// User profile
router.post("/register", register);
router.post("/login", login);
// router.patch("/editProfilePicture/:imgSource", verifyToken, editProfilePicture); TO-DO change profile picture (User)
// router.patch('/:userId', verifyToken, editProfile); TO-DO profile data as a query/body (User, UserPrivate, UserProfile)
// router.patch("")
// router.patch("/addTitle/:userId", verifyToken, addTitle) TO-DO add title after reaching certain achievements level (UserProfile)
// router.patch('/titles/:userId', verifyToken, changeTitles) TO-DO change titles from settings (User)
// router.patch('/preferences/:userId', verifyToken, changePreferences) TO-DO change preferences as a filters (UserProfile)
// router.patch('/theme/:userId', verifyToken, changeTheme) TO-DO change theme onClick (UserProfile) (maybe with )
// router.patch("finishQuiz/:userId", verifyToken, addFinishedQuizData); TO-DO add points, finishedQuizzes+1

// Other people profiles
// router.get('/ranking', findUsers) TO-DO fetch users from ranking, pagination with 10 result per page, could be sorted by createdQuizzes, finishedQuizzes, points (for now)
// router.get('/:userId', getUser) TO-DO fetch other user informations (User)

module.exports = router;
