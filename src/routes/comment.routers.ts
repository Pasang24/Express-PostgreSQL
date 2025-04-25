import express from "express";
import CommentController from "../controllers/comment.controller";

const router = express.Router();

router.post("/generate-comment", CommentController.generateComment);

export default router;
