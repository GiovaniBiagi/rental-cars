import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { envs } from "../envs";

export const userController = {
  me: async (request: Request, response: Response) => {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decodedToken = jwt.verify(token, envs.JWT_SECRET);

    if (!decodedToken || typeof decodedToken === "string") {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          dateOfBirth: true,
        },
      });

      if (!user) {
        response.status(404).json({ message: "User not found" });
        return;
      }

      response.json(user);
    } catch (error) {
      console.log({ error });
      response.status(400).json({ message: "Failed to get user" });
    }
  },
};
