const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20, // Poprawione max na maxlength
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  points: { type: Number, required: true },
  profilePicture: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdQuizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
