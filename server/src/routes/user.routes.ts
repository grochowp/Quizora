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
router.put("/editProfilePicture/:imgSource", verifyToken, editProfilePicture);
// router.put('/:userId', verifyToken, editProfile); TO-DO profile data as a params (User, UserPrivate, UserProfile)
// router.put('/titles/:userId', verifyToken, changeTitles) TO-DO change titles from settings (User)
// router.put('/preferences/:userId', verifyToken, changePreferences) TO-DO change preferences as a filters (UserProfile)
// router.put('/theme/:userId', verifyToken, changeTheme) TO-DO change theme onClick (UserProfile)
// router.put("finishQuiz/:userId", verifyToken, addFinishedQuizData); TO-DO add points, finishedQuizzes+1

// Other people profiles
// router.get('/ranking',verifyToken, findUsers) TO-DO fetch users from ranking, pagination with 10 result per page, could be sorted by createdQuizzes, finishedQuizzes, points (for now)
// router.get('/:userId', verifyToken, getUser) TO-DO fetch other user informations (User)

module.exports = router;
