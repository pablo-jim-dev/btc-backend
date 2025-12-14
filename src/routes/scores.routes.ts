import { Router } from "express";
import { 
  getScores,
  deleteAllUsersByMode,
  deleteLastWinnersSnapshotByMode
} from "@/controllers/scores.controllers.js";
const router = Router();
import { requireAdminPassword } from "@/middlewares/requireAdminPassword.js";

router.get('/:mode', getScores);

// Limpieza (yo lo haría DELETE)
router.delete('/:mode/users', requireAdminPassword, deleteAllUsersByMode);
router.delete('/:mode/winners/last', requireAdminPassword, deleteLastWinnersSnapshotByMode);

export default router;