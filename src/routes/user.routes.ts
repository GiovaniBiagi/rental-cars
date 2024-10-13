import { Router } from "express";

import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/me", userController.me);

export default router;
