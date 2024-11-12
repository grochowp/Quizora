import mongoose, { Document } from "mongoose";

export interface IUserPrivate extends Document {
  _id: mongoose.ObjectId;
  userId: mongoose.ObjectId;
  login: string;
  email: string;
  password: string;
}

const userPrivateSchema = new mongoose.Schema<IUserPrivate>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  login: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
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
});

module.exports = mongoose.model<IUserPrivate>("UserPrivate", userPrivateSchema);
