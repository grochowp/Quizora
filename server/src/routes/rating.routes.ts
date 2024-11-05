const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

module.exports = router;
