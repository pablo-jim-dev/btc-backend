import type { Request, Response } from "express";
import User from "@/schemas/user.schema.js";
import Prize from "@/schemas/prize.schema.js";
import WinnersSnapshot from "@/schemas/winnersSnapshot.schema.js";

export const getScores = async (req: Request, res: Response) => {
  const { mode } = req.params;

  try {
    const modeNumber = Number(mode);
    const q = { mode: modeNumber };

    // 1) Conteo rápido
    const usersCount = await User.countDocuments(q);
    if (usersCount < 33) {
      return res.sendStatus(204); // 👈 sin body
    }

    // 2) Si ya existe un snapshot, regresa el PRIMERO (el de la primera corrida)
    const firstSnapshot = await WinnersSnapshot
      .findOne({ mode: modeNumber })
      .sort({ generatedAt: 1, _id: 1 });

    if (firstSnapshot) {
      return res.status(200).json({
        winnersSnapshot: firstSnapshot,
      });
    }

    // 3) No existe snapshot => crear el primero
    const topUsers = await User.find(q)
      .sort({ score: -1, updatedAt: 1, _id: 1 })
      .limit(33);

    const prizes = await Prize.find({ isActive: true })
      .sort({ rank: 1 })
      .limit(33);

    // (Opcional pero recomendable) validar que existan 33 premios
    if (prizes.length < 33) {
      return res.status(500).json({
        message: `No hay suficientes premios activos. Se requieren 33 y hay ${prizes.length}.`,
      });
    }

    const winners = topUsers.map((u, idx) => {
      const rank = idx + 1;
      const prize = prizes[idx];

      return {
        rank,
        score: u.score,
        userId: u._id,
        email: u.email,
        name: u.name,
        lastname: u.lastname,
        prizeId: prize?._id,
        prizeSnapshot: prize
          ? {
              rank: prize.rank,
              cadena: prize.cadena,
              clasificacion: prize.clasificacion,
              hotel: prize.hotel,
              estatus: prize.estatus,
              descripcion: prize.descripcion,
              noches: prize.noches,
              vigencia: prize.vigencia,
            }
          : undefined,
      };
    });

    const snapshot = await WinnersSnapshot.create({
      mode: modeNumber,
      generatedAt: new Date(),
      totalUsersConsidered: usersCount, // 👈 ya lo tenemos
      winners,
    });

    return res.status(200).json({
      winnersSnapshot: snapshot,
    });
  } catch (err: any) {
    console.log("Error:", err);
    return res.status(500).json({ message: "Error fetching scores", error: err });
  }
};

export const deleteAllUsersByMode = async (req: Request, res: Response) => {
  const modeNumber = Number(req.params.mode);

  try {
    const result = await User.deleteMany({ mode: modeNumber });

    return res.status(200).json({
      message: "Users deleted",
      mode: modeNumber,
      deletedCount: result.deletedCount ?? 0,
    });
  } catch (err: any) {
    console.log("Error:", err);
    return res.status(500).json({ message: "Error deleting users", error: err });
  }
};

export const deleteLastWinnersSnapshotByMode = async (req: Request, res: Response) => {
  const modeNumber = Number(req.params.mode);

  try {
    const last = await WinnersSnapshot
      .findOne({ mode: modeNumber })
      .sort({ generatedAt: -1, _id: -1 });

    if (!last) {
      return res.status(404).json({ message: "No snapshots found", mode: modeNumber });
    }

    await WinnersSnapshot.deleteOne({ _id: last._id });

    return res.status(200).json({
      message: "Last snapshot deleted",
      mode: modeNumber,
      deletedSnapshotId: last._id,
      generatedAt: last.generatedAt,
    });
  } catch (err: any) {
    console.log("Error:", err);
    return res.status(500).json({ message: "Error deleting snapshot", error: err });
  }
};

