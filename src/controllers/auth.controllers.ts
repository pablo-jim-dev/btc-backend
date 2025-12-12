import type { Request, Response } from "express";
import User from "../schemas/user.schema.js";

export const register = async (req: Request, res: Response) => {
    const { name, lastname, email, score, mode } = req.body;

    if (score === undefined || mode === undefined) {
        return res.status(400).json({ message: "score and mode are required" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            existingUser.score = score;
            await existingUser.save();
            return res.status(200).json({ message: "Score updated successfully", user: existingUser });
        }

        const newUser = new User({
            name,
            lastname,
            email,
            score,
            mode
        });

        const user = await newUser.save();
        return res.status(201).json({ message: "User registered successfully", user });
    } catch (err: any) {
        console.log('error: ', err);
        
        return res.status(500).json({ message: "Error registering user", error: err });
    }
};
