import { Router } from "express";
import { rentalController } from "../controllers/rental.controller";

const router = Router();

router.post("/", rentalController.create);
router.get("/user/:id", rentalController.getRentalByUserId);
router.get("/:id", rentalController.getOne);
router.delete("/:id", rentalController.delete);

export default router;
