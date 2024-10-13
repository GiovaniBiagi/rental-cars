import type { Request, Response } from "express";
import { differenceInDays } from "date-fns";
import type { Rental } from "@prisma/client";
import { prisma } from "../lib/prisma";

type PostRentalsRequest = Rental;

export const rentalController = {
  create: async (
    request: Request<{}, {}, PostRentalsRequest>,
    response: Response
  ) => {
    const { userId, carId, startDate, endDate } = request.body;

    if (!userId || !carId || !startDate || !endDate) {
      response.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      response.status(404).json({ message: "User not found" });
      return;
    }

    const car = await prisma.car.findUnique({
      where: {
        id: carId,
      },
    });

    if (!car) {
      response.status(404).json({ message: "Car not found" });
      return;
    }

    try {
      const rental = await prisma.rental.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          car: {
            connect: {
              id: carId,
            },
          },
          totalCost:
            car.dailyRate *
            differenceInDays(new Date(endDate), new Date(startDate)),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });

      response.status(201).json({
        id: rental.id,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        car: {
          id: car.id,
          model: car.model,
          year: car.year,
        },
        total: rental.totalCost,
        startDate: rental.startDate,
        endDate: rental.endDate,
      });
    } catch (error) {
      console.log({ error });
      response.status(400).json({ message: "Failed to create rental" });
    }
  },

  delete: async (request: Request, response: Response) => {
    const { id } = request.params;

    if (!id) {
      response.status(400).json({ message: "Rental ID is required" });
      return;
    }

    const rental = await prisma.rental.findUnique({
      where: {
        id,
      },
    });

    if (!rental) {
      response.status(404).json({ message: "Rental not found" });
      return;
    }

    await prisma.rental.delete({
      where: {
        id,
      },
    });

    response.status(204).send();
  },

  getOne: async (request: Request, response: Response) => {
    const { id } = request.params;

    if (!id) {
      response.status(400).json({ message: "Rental ID is required" });
      return;
    }

    const rental = await prisma.rental.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        car: true,
      },
    });

    if (!rental) {
      response.status(404).json({ message: "Rental not found" });
      return;
    }

    response.status(200).json({
      id: rental.id,
      user: {
        id: rental.user.id,
        email: rental.user.email,
        name: rental.user.name,
      },
      car: {
        id: rental.car.id,
        model: rental.car.model,
        year: rental.car.year,
      },
      total: rental.totalCost,
      startDate: rental.startDate,
      endDate: rental.endDate,
    });
  },

  getRentalByUserId: async (request: Request, response: Response) => {
    const { userId } = request.params;

    if (!userId) {
      response.status(400).json({ message: "User ID is required" });
      return;
    }

    const rentals = await prisma.rental.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        car: true,
      },
    });

    const responsePayload = rentals.map((rental) => ({
      id: rental.id,
      user: {
        id: rental.user.id,
        email: rental.user.email,
        name: rental.user.name,
      },
      car: {
        id: rental.car.id,
        model: rental.car.model,
        year: rental.car.year,
      },
      total: rental.totalCost,
      startDate: rental.startDate,
      endDate: rental.endDate,
    }));

    response.status(200).json(responsePayload);
  },
};
