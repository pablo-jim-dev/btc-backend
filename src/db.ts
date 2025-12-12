import mongoose from "mongoose"
import { MONGODB_URI } from "./config.js"

export const connectDB = async() => {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        await mongoose.connect(MONGODB_URI!, {
            autoIndex: true
        });
        console.log(">>> Database connected successfully");
    } catch (error) {
        console.error("Database connection failed", error);
    }
}