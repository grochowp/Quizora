import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.ObjectId;
  nickname: string;
  points: number;
  profilePicture: string;
  createdAt: Date;
  createdQuizzes: Array<mongoose.Types.ObjectId>;
  achievements: Array<mongoose.Types.ObjectId>;
  titles: Array<string>;
  likes: Array<mongoose.Types.ObjectId>;
  dislikes: Array<mongoose.Types.ObjectId>;
}

const userSchema = new mongoose.Schema<IUser>({
  nickname: { type: String, required: true, minlength: 5, maxlength: 20 },
  points: { type: Number, required: true },
  profilePicture: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdQuizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
  achievements: [
    {
      type: mongoose.Schema.Types.String,
      ref: "Achievement",
    },
    { type: String, required: true },
  ],
  titles: [
    {
      type: String,
      required: true,
    },
  ],
  likes: [
    {
      type: String,
      required: true,
    },
  ],
  dislikes: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model<IUser>("User", userSchema);
