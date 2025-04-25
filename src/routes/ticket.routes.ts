import express from "express";
import TicketController from "../controllers/ticket.controller";

const router = express.Router();

router.post("/generate-ticket", TicketController.generateTicket);
router.get("/find-ticket/:ticketId", TicketController.findSingleTicket);
router.get("/get-all-tickets", TicketController.getAllTickets);
router.get("/get-all-reported-tickets", TicketController.getAllReportedTickets);
router.get("/get-all-assigned-tickets", TicketController.getAllAssignedTickets);

export default router;
