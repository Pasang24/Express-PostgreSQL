import { Request, Response } from "express";
import { NewTicket } from "../types/ticket";
import TicketModel from "../models/ticket.model";

const generateTicket = async (
  req: Request<{}, {}, Omit<NewTicket, "status" | "reporter_id">>,
  res: Response
) => {
  const { title, description, assignee_id } = req.body;

  const reporter_id = Number(req.user?.id);

  const ticket = await TicketModel.createTicket({
    title,
    description,
    status: "pending",
    assignee_id,
    reporter_id,
  });

  res.status(201).json({ ticket });
};

const findSingleTicket = async (
  req: Request<{ ticketId: string }, {}, {}>,
  res: Response
) => {
  const ticketId = Number(req.params.ticketId);

  const ticket = await TicketModel.findTicket(ticketId);

  if (!ticket) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }

  res.status(200).json({ ticket });
};

const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await TicketModel.findAllTickets();

  res.status(200).json({ tickets });
};

const getAllReportedTickets = async (req: Request, res: Response) => {
  const reporter_id = Number(req.user?.id);
  const tickets = await TicketModel.findReportedTickets(reporter_id);

  res.status(200).json({ tickets });
};

const getAllAssignedTickets = async (req: Request, res: Response) => {
  const assignee_id = Number(req.user?.id);
  const tickets = await TicketModel.findAssignedTickets(assignee_id);

  res.status(200).json({ tickets });
};

const TicketController = {
  generateTicket,
  findSingleTicket,
  getAllTickets,
  getAllReportedTickets,
  getAllAssignedTickets,
};

export default TicketController;
