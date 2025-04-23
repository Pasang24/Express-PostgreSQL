import pool from "../config/db";
import { NewTicket, Ticket } from "../types/ticket";

class TicketModel implements Ticket {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string,
    public status: "pending" | "completed" | "closed",
    public readonly reporter_id: string,
    public readonly assignee_id: string,
    public readonly created_at: Date,
    public updated_at?: Date
  ) {}

  createTicket(ticket: NewTicket) {}

  findTicket(ticketId: number) {}

  findAllTickets({
    searchTerm,
    reporter_id,
    assignee_id,
  }: {
    searchTerm?: string;
    reporter_id?: number;
    assignee_id?: number;
  }) {}
}
