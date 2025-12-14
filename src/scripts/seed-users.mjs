#!/usr/bin/env node
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

// TODO: ajusta esta ruta a tu proyecto
import User from "../schemas/user.schema.ts";

// --------------------
// Args
// --------------------
const mode = Number(process.argv[2] ?? 0); // 0=dev, 1=prod
const count = Math.max(1, Number(process.argv[3] ?? 40));
const reset = process.argv.includes("--reset");

// --------------------
// Load .env (según mode)
// --------------------
const envFile =
  process.argv.includes("--env-file")
    ? process.argv[process.argv.indexOf("--env-file") + 1]
    : mode === 1
      ? ".env"
      : ".env.development.local";

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

const firstNames = [
  "Pablo","Luis","Ana","Karla","Sofía","Diego","Mariana","Jorge","Fernanda","Carlos",
  "Andrea","Miguel","Valeria","Daniel","Camila","Emilio","Diana","Hugo","Paola","Iván"
];

const lastNames = [
  "García","Hernández","López","Martínez","González","Pérez","Sánchez","Ramírez","Flores","Torres",
  "Rivera","Gómez","Vargas","Cruz","Morales","Reyes","Ortiz","Chávez","Castillo","Rojas"
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function makeEmail(i) {
  return `test.user.${mode}.${String(i).padStart(3, "0")}@example.com`;
}

async function main() {
  await mongoose.connect(MONGODB_URI);

  if (reset) {
    await User.deleteMany({ email: /^test\.user\.\d+\.\d+@example\.com$/, mode });
    console.log("🧹 deleteMany(test users) OK");
  }

  const docs = Array.from({ length: count }).map((_, i) => {
    const name = pick(firstNames);
    const lastname = pick(lastNames);
    const email = makeEmail(i + 1);

    return {
      name,
      lastname,
      email,
      score: randomInt(100, 5000),
      mode,
    };
  });

  const ops = docs.map((u) => ({
    updateOne: {
      filter: { email: u.email, mode: u.mode },
      update: { $set: u },
      upsert: true,
    },
  }));

  const result = await User.bulkWrite(ops);

  console.log("✅ Seed de usuarios OK:", {
    inserted: result.upsertedCount,
    modified: result.modifiedCount,
    matched: result.matchedCount,
    mode,
    count,
  });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Error en seed-users:", err);
  process.exit(1);
});
