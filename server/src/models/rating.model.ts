import mongoose, { Document } from "mongoose";

export interface IRating extends Document {
  _id: mongoose.ObjectId;
  userId: mongoose.ObjectId;
  quizId: mongoose.ObjectId;
  rating: number;
}

const ratingSchema = new mongoose.Schema<IRating>({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Types.ObjectId, ref: "Quiz", required: true },
  rating: { type: Number, default: 0 },
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
