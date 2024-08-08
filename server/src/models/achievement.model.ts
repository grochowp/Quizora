import mongoose, { Document } from "mongoose";

export interface IAchievement extends Document {
  _id: mongoose.ObjectId;
  name: string;
  points: number;
  text: string;
  title?: string;
}

const achievementSchema = new mongoose.Schema<IAchievement>({
  name: { type: String, minlength: 5, maxlength: 30, required: true },
  points: { type: Number, min: 10, max: 50, required: true },
  text: { type: String, required: true },
  title: { type: String, required: false },
});

module.exports = mongoose.model("Achievement", achievementSchema);
