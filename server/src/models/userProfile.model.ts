import mongoose, { Document } from "mongoose";
import { IUser } from "./user.model";

export interface IUserProfile extends Document {
  _id: mongoose.ObjectId;
  theme: string;
  checkpoints: boolean;
  lessAnimations: boolean;
  privateAccount: boolean;
  titles: Array<string>;
  achievements: [
    {
      achievementId: mongoose.ObjectId;
      name: string;
      level: number;
      value: number;
    }
  ];
}

const userProfileSchema = new mongoose.Schema<IUserProfile>({
  theme: {
    type: String,
    required: true,
    default: "default",
    enum: {
      values: ["default", "light", "blue", "green", "noir", "cosmic"],
      message: "Theme must have a value of 'Default', 'Light', or 'Blue'.",
    },
  },
  checkpoints: { type: Boolean, default: false },
  lessAnimations: { type: Boolean, default: false },
  privateAccount: { type: Boolean, default: false },
  titles: { type: [String], required: true, default: [] },
  achievements: [
    {
      achievementId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Achievement",
      },
      name: { type: String, required: true },
      level: { type: Number, default: 1 },
      value: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("UserProfile", userProfileSchema);
