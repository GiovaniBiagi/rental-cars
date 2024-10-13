import { Router } from "express";
import { carController } from "../controllers/car.controller";

const router = Router();

router.get("/", carController.getAll);
router.get("/:id", carController.getOne);

export default router;
