import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

export const ENV = process.env.NODE_ENV ?? "development";

const tryLoad = (file: string) => {
  const abs = path.resolve(process.cwd(), file);
  if (!fs.existsSync(abs)) return false;

  const result = dotenv.config({ path: abs, override: false });
  if (result.error) {
    console.error(`>>> Failed to load ${file}`, result.error);
    return false;
  }
  console.log(`>>> Loaded ${file}`);
  return true;
};

// En dev: usa .env.development.local si existe, si no .env
if (ENV !== "production") {
  if (!tryLoad(".env.development.local")) tryLoad(".env");
} else {
  // En prod: asume variables del runtime (Render, etc.)
  // PERO en local: si no existe MONGODB_URI, permite fallback a .env
  if (!process.env.MONGODB_URI) {
    tryLoad(".env");
  } else {
    console.log(">>> Using runtime environment (production)");
  }
}

export const PORT = Number(process.env.PORT ?? 3000);
export const MONGODB_URI = process.env.MONGODB_URI ?? "";
export const JWT_SECRET = process.env.JWT_SECRET ?? "";
