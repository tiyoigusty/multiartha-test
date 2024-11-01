import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.locals.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      data: null,
    });
  }
};
