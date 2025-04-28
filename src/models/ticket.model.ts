import pool from "../config/db";
import { NewTicket, Ticket } from "../types/ticket";

interface TabQueries {
  newest: string;
  active: string;
  extended: string;
}

export default class TicketModel implements Ticket {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string,
    public status: "pending" | "completed" | "closed",
    public readonly reporter_id: number,
    public readonly assignee_id: number,
    public readonly created_at: Date,
    public updated_at: Date | null
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
      updated_at,
    } = result.rows[0];

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

  static async findAllTickets(tab: string): Promise<TicketModel[]> {
    const tabQueries: TabQueries = {
      newest: "",
      active: "WHERE status = 'pending'",
      extended: "WHERE status = 'completed'",
    };

    const result = await pool.query<Ticket>(
      `SELECT * FROM tickets ${
        tabQueries[tab as keyof TabQueries]
      } ORDER BY created_at DESC`
    );

    const tickets = result.rows;

    const newTickets = tickets.map(
      (ticket) =>
        new TicketModel(
          ticket.id,
          ticket.title,
          ticket.description,
          ticket.status,
          ticket.reporter_id,
          ticket.assignee_id,
          ticket.created_at,
          ticket.updated_at
        )
    );

    return newTickets;
  }

  static findReportedTickets = async (reporter_id: number) => {
    const result = await pool.query<Ticket>(
      `SELECT * FROM tickets WHERE reporter_id = $1`,
      [reporter_id]
    );

    const tickets = result.rows;

    const newTickets = tickets.map(
      (ticket) =>
        new TicketModel(
          ticket.id,
          ticket.title,
          ticket.description,
          ticket.status,
          ticket.reporter_id,
          ticket.assignee_id,
          ticket.created_at,
          ticket.updated_at
        )
    );

    return newTickets;
  };

  static findAssignedTickets = async (assignee_id: number) => {
    const result = await pool.query<Ticket>(
      `SELECT * FROM tickets WHERE assignee_id = $1`,
      [assignee_id]
    );

    const tickets = result.rows;

    const newTickets = tickets.map(
      (ticket) =>
        new TicketModel(
          ticket.id,
          ticket.title,
          ticket.description,
          ticket.status,
          ticket.reporter_id,
          ticket.assignee_id,
          ticket.created_at,
          ticket.updated_at
        )
    );

    return newTickets;
  };
}
