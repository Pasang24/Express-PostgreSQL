import express from "express";
import UserController from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/logout", UserController.logoutUser);
router.get("/profile", AuthMiddleware, UserController.getProfile);

export default router;
