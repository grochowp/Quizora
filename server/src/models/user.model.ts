import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  login: string;
  email: string;
  password: string;
  points: number;
  profilePicture: string;
  createdAt: Date;
  createdQuizzes: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  login: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  points: { type: Number, required: true },
  profilePicture: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdQuizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
});

module.exports = mongoose.model<IUser>("User", userSchema);
