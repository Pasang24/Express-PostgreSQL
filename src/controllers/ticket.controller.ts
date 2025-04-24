import { Request, Response } from "express";
import { NewTicket } from "../types/ticket";
import TicketModel from "../models/ticket.model";

const generateTicket = async (
  req: Request<{}, {}, NewTicket>,
  res: Response
) => {
  const { title, status, description, reporter_id, assignee_id } = req.body;

  const ticket = await TicketModel.createTicket({
    title,
    description,
    status,
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

const TicketController = { generateTicket, findSingleTicket };

export default TicketController;
