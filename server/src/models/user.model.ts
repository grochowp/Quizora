import mongoose, { Document } from "mongoose";
import { IUserProfile } from "./userProfile.model";

export interface IUser extends Document {
  _id: mongoose.ObjectId;
  nickname: string;
  points: number;
  profilePicture: string;
  createdAt: Date;
  activeTitles: Array<string>;
  createdQuizzes: number;
  finishedQuizzes: number;
  likedQuizzes: number;
  privateAccount: boolean;
  userProfile: IUserProfile;
}

const userSchema = new mongoose.Schema<IUser>({
  nickname: { type: String, required: true, minlength: 5, maxlength: 20 },
  points: { type: Number, required: true, default: 0 },
  profilePicture: {
    type: String,
    required: true,
    default: "https://i.imgur.com/u5PAw8H.png",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  activeTitles: { type: [String], required: true, default: [], maxlength: 3 },
  createdQuizzes: { type: Number, default: 0 }, // required ?
  finishedQuizzes: { type: Number, default: 0 }, // required ?
  likedQuizzes: { type: Number, default: 0 }, // required ?
  privateAccount: { type: Boolean, default: false },
  userProfile: { type: mongoose.Types.ObjectId, ref: "UserProfile" },
});

module.exports = mongoose.model<IUser>("User", userSchema);
