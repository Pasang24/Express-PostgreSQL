import express from "express";
import UserController from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/register", UserController.registerUser);
router.get("/register/callback", UserController.registerUserCallback);
router.get("/logout", UserController.logoutUser);
router.get("/profile", AuthMiddleware, UserController.getProfile);

export default router;
