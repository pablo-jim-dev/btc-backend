import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
  },
  mode: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

export default model("UserModel", UserSchema);