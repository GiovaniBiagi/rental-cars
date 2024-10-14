import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import carRoutes from "./car.routes";
import rentalRoutes from "./rental.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import swaggerDocument from "../../swagger.json";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", authMiddleware, userRoutes);
router.use("/cars", authMiddleware, carRoutes);
router.use("/rentals", authMiddleware, rentalRoutes);
router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
  })
);

export default router;
