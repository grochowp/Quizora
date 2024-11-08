import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.ObjectId;
  userId: mongoose.ObjectId;
  quizId: mongoose.ObjectId;
  comment: string;
  rating: number;
  date: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Types.ObjectId, ref: "Quiz", required: true },
  comment: { type: String, required: true, minlength: 5, maxlength: 50 },
  rating: {
    type: Number,
    enum: {
      values: [1, 0, -1],
      message:
        "Rating must be positine (like), neutral (no rate) or negative (dislike).",
    },
    required: true,
  },
  date: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Comment", commentSchema);
