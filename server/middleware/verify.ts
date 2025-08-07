import { Request, Response } from "express";
import { verifyToken } from "../utils/jwt-utils";

export const Verify = async (request: Request, response: Response) => {
  const { token } = request.body;

  // const tokenPassword = "mentor-meet";
  const tokenPassword = process.env.JWT_SECRET;

  try {
    const decoded = verifyToken(token);
    response.send(decoded);
    return;
  } catch (err) {
    response.status(401).send({ message: "Хүчингүй токен байна!" });
    return;
  }
};
