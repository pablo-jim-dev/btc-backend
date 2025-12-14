import { Schema, model } from "mongoose";

const prizeSchema = new Schema(
    {
        rank: { type: Number, required: true, unique: true },
        cadena: String,
        clasificacion: String,
        hotel: String,
        estatus: String,
        descripcion: String,
        noches: Number,
        vigencia: String,
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default model("Prize", prizeSchema);
