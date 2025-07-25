import jwt from "jsonwebtoken";
import { Request, Response } from "express";


export const Verify = async (request: Request, response: Response) => {

  const { token } = request.body;

  const tokenPassword = "mentor-meet";

  const isValid = jwt.verify(token, tokenPassword);
  try {
    if (isValid) {
      const destructToken: any = jwt.decode(token);
      response.send(destructToken);
      return;
    } else {
      response.status(401).send({ message: "Хүчингүй токен байна!" });
      return;
    }
  } catch (err) {
    response.status(401).send({ message: "Хүчингүй токен байна!" });
    return;
  }
};