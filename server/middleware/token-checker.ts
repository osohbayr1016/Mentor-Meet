
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const MentorTokenChecker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Токен шаардлагатай!" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Токенын формат буруу!" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined");
    return res.status(500).json({ message: "Тохиргооны алдаа!" });
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      mentorId: string;
      isMentor: boolean;
    };

    console.log("Decoded token:", decoded);

    res.locals.mentorId = decoded.mentorId;
    res.locals.isMentor = decoded.isMentor;

    return next();
  } catch (err: any) {
    console.error("Token error:", err.message);
    return res.status(401).json({ message: "JWT баталгаажсангүй!" });
  }
};
