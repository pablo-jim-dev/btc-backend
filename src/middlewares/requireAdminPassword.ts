import type { Request, Response, NextFunction } from "express";

export const requireAdminPassword = (req: Request, res: Response, next: NextFunction) => {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ message: "ADMIN_PASSWORD no está configurado en el env" });
  }

  // Header recomendado: x-admin-password
  const provided = String(req.headers["x-admin-password"] ?? "");

  if (!provided) {
    return res.status(401).json({ message: "Missing x-admin-password header" });
  }

  if (provided !== adminPassword) {
    return res.status(403).json({ message: "Invalid admin password" });
  }

  return next();
};
