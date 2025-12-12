import type { Request, Response } from "express"
import User from "@/schemas/user.schema.js";

export const getScores = async (req: Request, res: Response) => {
    const { mode } = req.params;

    try {
        const query = mode ? { mode: Number(mode) } : {};
        const users = await User.find(query);

        return res.status(200).json({ users });
    } catch (err: any) {
        return res.status(500).json({ message: "Error fetching scores", error: err });
    }
}
