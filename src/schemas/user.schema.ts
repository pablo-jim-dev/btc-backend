import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    lastname: String,
    email: { type: String, required: true },
    score: { type: Number, required: true },
    mode: { type: Number, required: true },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, mode: 1, event: 1 }, { unique: true });

export default model("User", userSchema);