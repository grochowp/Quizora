import mongoose, { Document } from "mongoose";

export interface IAchievement extends Document {
  _id: mongoose.ObjectId;
  name: string;
  //points: number;
  description: string;
  title?: string;
  levels: [
    {
      level: number;
      requirement: number;
    }
  ];
}

const achievementSchema = new mongoose.Schema<IAchievement>({
  name: { type: String, minlength: 5, maxlength: 30, required: true },
  //points: { type: Number, min: 10, max: 50, required: true },
  description: { type: String, required: true },
  title: { type: String, required: false },
  levels: [
    {
      level: { type: Number, required: true },
      requirement: { type: Number, required: true },
    },
  ],
});

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
