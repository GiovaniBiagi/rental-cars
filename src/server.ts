import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

import carRoutes from "./routes/car.routes";
import rentalRoutes from "./routes/rental.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

import { envs } from "./envs";
import { authMiddleware } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

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

app.use(`/api/${envs.API_VERSION}`, router);

const port = envs.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port 3000");
});
