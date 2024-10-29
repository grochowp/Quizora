import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.ObjectId;
  userId: mongoose.ObjectId;
  quizId: mongoose.ObjectId;
  comment: string;
  rated: number;
  date: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Types.ObjectId, ref: "Quiz", required: true },
  comment: { type: String, required: true, minlength: 5, maxlength: 50 },
  rated: { type: Number, enum: { values: [1, -1] }, required: true },
  date: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Comment", commentSchema);
