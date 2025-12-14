#!/usr/bin/env node
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";

// TODO: ajusta esta ruta a tu proyecto
import Prize from "../schemas/prize.schema.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reset = process.argv.includes("--reset");

const getArgValue = (flag) => {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
};

// --------------------
// mode/env selection
// --------------------
const modeFlag = getArgValue("--mode");
const mode =
  modeFlag != null ? Number(modeFlag) :
  process.argv.includes("--prod") ? 1 :
  0;

const envFile =
  getArgValue("--env-file") ??
  (mode === 1 ? ".env" : ".env.development.local");

const envPath = path.resolve(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
  console.error(`❌ No existe el archivo de env: ${envPath}`);
  process.exit(1);
}

const envResult = dotenv.config({ path: envPath, override: true });
if (envResult.error) {
  console.error(`❌ Error cargando env (${envFile}):`, envResult.error);
  process.exit(1);
}

console.log(`🔧 Env cargado: ${envFile}`);

// --------------------
// Env vars
// --------------------
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI no está definido en el entorno/.env");
  process.exit(1);
}

// --------------------
// prizes json
// --------------------
const jsonPath =
  process.env.PRIZES_JSON_PATH ?? path.join(__dirname, "prizes.json");

async function main() {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("El JSON de premios debe ser un array");
  }

  await mongoose.connect(MONGODB_URI);

  if (reset) {
    await Prize.deleteMany({});
    console.log("🧹 Prize.deleteMany({}) OK");
  }

  const docs = data.map((p) => ({
    rank: Number(p.rank),
    cadena: p.cadena ?? null,
    clasificacion: p.clasificacion ?? null,
    hotel: p.hotel ?? null,
    estatus: p.estatus ?? null,
    descripcion: p.descripcion ?? null,
    noches: p.noches != null ? Number(p.noches) : null,
    vigencia: p.vigencia ?? null,
    isActive: true,
  }));

  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { rank: doc.rank },
      update: { $set: doc },
      upsert: true,
    },
  }));

  const result = await Prize.bulkWrite(ops);

  console.log("✅ Seed de premios OK:", {
    inserted: result.upsertedCount,
    modified: result.modifiedCount,
    matched: result.matchedCount,
    mode,
  });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Error en seed-prizes:", err);
  process.exit(1);
});
