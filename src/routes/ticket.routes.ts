import express from "express";
import TicketController from "../controllers/ticket.controller";

const router = express.Router();

router.post("/generate-ticket", TicketController.generateTicket);

export default router;
