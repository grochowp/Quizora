const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, minlength: 5, maxlength: 30, required: true },
  time: { type: Number, min: 60000, max: 600000, required: true },
  questions: [
    {
      question: { type: String, minLength: 5, maxLength: 50, required: true },
      answers: { type: [String], required: true },
      correctAnswerIndex: { type: Number, required: true },
    },
  ],
  createdBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    login: {
      type: String,
      required: true,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  //  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }, // See later if this should be added
});

module.exports = mongoose.model("Quiz", quizSchema);
