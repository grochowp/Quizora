const express = require("express");
const router = express.Router();
const {
  register,
  login,
  editProfilePicture,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put("/editProfilePicture/:imgSource", verifyToken, editProfilePicture);

module.exports = router;
