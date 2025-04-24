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

const TicketController = { generateTicket };

export default TicketController;
