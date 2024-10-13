import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { differenceInYears } from "date-fns";
import type { Request, Response } from "express";
import type { User } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { envs } from "../envs";
import type { Error } from "../types/error";

type AuthRegisterPost = User;
type AuthRegisterResponseWithoutPassword = Omit<User, "password">;
type AuthLoginResponse = { token: string };
type AuthLoginPost = { email: string; password: string };

const hashPassowrd = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return { salt, hash };
};

const verifyPassword = (password: string, salt: string, hash: string) => {
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === hashedPassword;
};

const isUserOverEighteen = (dateOfBirth: Date) => {
  return differenceInYears(new Date(), dateOfBirth) >= 18;
};

export const authController = {
  register: async (
    request: Request<{}, {}, AuthRegisterPost>,
    response: Response<AuthRegisterResponseWithoutPassword | Error>
  ) => {
    const { email, password, name, dateOfBirth } = request.body;

    const { salt, hash } = hashPassowrd(password);

    if (!isUserOverEighteen(new Date(dateOfBirth))) {
      response.status(400).json({ message: "User must be over 18 years old" });
      return;
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        response.status(400).json({ message: "User already exists" });
        return;
      }

      const data = {
        email,
        password: `${salt}:${hash}`,
        name,
        dateOfBirth: new Date(dateOfBirth),
      };

      const user = await prisma.user.create({
        data,
      });

      response.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      console.log({ error });
      response.status(400).json({ message: "Failed to create a new user" });
    }
  },
  login: async (
    request: Request<{}, {}, AuthLoginPost>,
    response: Response<AuthLoginResponse | Error>
  ) => {
    const { email, password } = request.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        response.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const [salt, hash] = user.password.split(":");
      const isPasswordValid = verifyPassword(password, salt, hash);

      if (!isPasswordValid) {
        response.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, name: user.name },
        envs.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      response.status(200).json({ token });
    } catch (error) {
      console.log({ error });
      response.status(400).json({ message: "Failed to login" });
    }
  },
};
