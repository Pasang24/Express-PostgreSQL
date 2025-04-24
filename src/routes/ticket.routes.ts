import express from "express";
import TicketController from "../controllers/ticket.controller";

const router = express.Router();

router.post("/generate-ticket", TicketController.generateTicket);
router.get("/find-ticket/:ticketId", TicketController.findSingleTicket);
router.get("/get-all-tickets", TicketController.getAllTickets);

export default router;
