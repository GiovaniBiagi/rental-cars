import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envs } from "../envs";

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    response.send(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, envs.JWT_SECRET, (err) => {
    if (err) {
      response.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  });
};
