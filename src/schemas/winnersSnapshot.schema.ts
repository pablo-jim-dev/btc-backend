import { Schema, model } from "mongoose";

const winnerEntrySchema = new Schema(
  {
    rank: { type: Number, required: true },
    score: { type: Number, required: true },

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: String,
    name: String,
    lastname: String,

    prizeId: { type: Schema.Types.ObjectId, ref: "Prize" },

    prizeSnapshot: {
      rank: Number,
      cadena: String,
      clasificacion: String,
      hotel: String,
      estatus: String,
      descripcion: String,
      noches: Number,
      vigencia: String,
    },
  },
  { _id: false }
);

const winnersSnapshotSchema = new Schema(
  {
    mode: { type: Number, required: true },
    generatedAt: { type: Date, required: true },

    totalUsersConsidered: { type: Number, default: 0 },
    winners: { type: [winnerEntrySchema], default: [] },
  },
  { timestamps: true }
);

winnersSnapshotSchema.index({ mode: 1, generatedAt: -1 });

export default model("WinnersSnapshot", winnersSnapshotSchema);
