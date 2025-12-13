import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthUser {
  userId: number;
  role: "ADMIN" | "USER";
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

// 🔐 Verify JWT
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthUser;

    req.user = decoded; // { userId, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// 👑 Admin only
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
};

// 👤 User only
export const userOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "USER") {
    return res.status(403).json({ message: "User access required." });
  }
  next();
};
