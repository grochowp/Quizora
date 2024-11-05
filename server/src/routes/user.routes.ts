const express = require("express");
const router = express.Router();

import {
  editProfilePicture,
  login,
  register,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/authMiddleware";

router.post("/register", register);
router.post("/login", login);
router.put("/editProfilePicture/:imgSource", verifyToken, editProfilePicture);

export default router;
