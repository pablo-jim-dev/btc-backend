import { Router } from "express";
import { getScores } from "@/controllers/scores.controllers.js";
const router = Router();

router.get('/scores/:mode', getScores);

export default router;