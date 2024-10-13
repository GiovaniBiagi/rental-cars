import type { Car } from "@prisma/client";
import type { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import type { Error } from "../types/error";

export const carController = {
  /**
   * @param request
   * @param response
   * @returns void
   * @description Get all cars
   */
  getAll: async (request: Request, response: Response<Car[] | Error>) => {
    try {
      const cars = await prisma.car.findMany();
      response.json(cars);
    } catch (error) {
      response.status(400).json({ message: "Failed to get cars" });
    }
  },
  getOne: async (request: Request, response: Response<Car | Error>) => {
    try {
      const { id } = request.params;

      if (!id) {
        response.status(400).json({ message: "Car ID is required" });
        return;
      }

      const car = await prisma.car.findUnique({
        where: {
          id,
        },
      });

      if (!car) {
        response.status(404).json({ message: "Car not found" });
        return;
      }

      response.json(car);
    } catch (error) {
      response.status(400).json({ message: "Failed to get car" });
    }
  },
};
