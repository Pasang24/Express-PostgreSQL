import express from "express";
import UserController from "../controllers/user.controller";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/logout", UserController.logoutUser);

export default router;
