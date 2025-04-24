import pool from "../config/db";
import { NewTicket, Ticket } from "../types/ticket";

export default class TicketModel implements Ticket {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string,
    public status: "pending" | "completed" | "closed",
    public readonly reporter_id: number,
    public readonly assignee_id: number,
    public readonly created_at: Date,
    public updated_at?: Date
  ) {}

  static async createTicket(ticket: NewTicket): Promise<TicketModel> {
    const result = await pool.query<Ticket>(
      `INSERT INTO tickets (title,description,status,reporter_id,assignee_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.reporter_id,
        ticket.assignee_id,
      ]
    );

    const {
      id,
      title,
      description,
      status,
      created_at,
      assignee_id,
      reporter_id,
    } = result.rows[0];

    const newTicket = new TicketModel(
      id,
      title,
      description,
      status,
      reporter_id,
      assignee_id,
      created_at
    );

    return newTicket;
  }

  static async findTicket(ticketId: number): Promise<TicketModel | null> {
    const result = await pool.query<Ticket>(
      `SELECT * FROM tickets WHERE id = $1`,
      [ticketId]
    );

    const ticket = result.rows[0];

    if (ticket) {
      const {
        id,
        title,
        description,
        status,
        created_at,
        assignee_id,
        reporter_id,
        updated_at,
      } = ticket;

      const newTicket = new TicketModel(
        id,
        title,
        description,
        status,
        reporter_id,
        assignee_id,
        created_at,
        updated_at
      );

      return newTicket;
    }

    return null;
  }

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
