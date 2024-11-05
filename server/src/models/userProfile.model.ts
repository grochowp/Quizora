import mongoose, { Document } from "mongoose";

export interface IUserProfile extends Document {
  _id: mongoose.ObjectId;
  userId: mongoose.ObjectId;
  theme: string;
  checkpoints: boolean;
  lessAnimations: boolean;
  privateAccount: boolean; // might be deleted later - same record is in "User", because it`s important to have access to this not only on logged account
  achievements: [
    {
      achievementId: mongoose.ObjectId;
      name: string;
      level: number;
    }
  ];
}

const userProfileSchema = new mongoose.Schema<IUserProfile>({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  theme: {
    type: String,
    required: true,
    default: "podstawowy",
    enum: {
      values: ["podstawowy", "jasny", "niebieski"],
      message: "Motyw musi mieć wartość 'Podstawowy', 'Jasny' lub 'Niebieski'.",
    },
  },
  checkpoints: { type: Boolean, default: false },
  lessAnimations: { type: Boolean, default: false },
  privateAccount: { type: Boolean, default: false },
  achievements: [
    {
      achievementId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Achievement",
      },
      name: { type: String, required: true },
      level: { type: Number, default: 1 },
    },
  ],
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
