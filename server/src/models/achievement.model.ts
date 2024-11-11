import mongoose, { Document } from "mongoose";

export interface IAchievement extends Document {
  _id: mongoose.ObjectId;
  name: string;
  //points: number;
  description: string;
  levels: [
    {
      level: number;
      title?: string;
      requirement: number;
    }
  ];
}

const achievementSchema = new mongoose.Schema<IAchievement>({
  name: { type: String, minlength: 5, maxlength: 30, required: true },
  //points: { type: Number, min: 10, max: 50, required: true },
  description: { type: String, required: true },
  levels: [
    {
      level: { type: Number, required: true },
      title: { type: String, required: false },
      requirement: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Achievement", achievementSchema);
