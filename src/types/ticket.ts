export interface BaseTicket {
  title: string;
  description: string;
  status: "pending" | "completed" | "closed";
}

export interface NewTicket extends BaseTicket {
  readonly reporter_id: string;
  readonly assignee_id: string;
}

export interface Ticket extends NewTicket {
  readonly id: number;
  readonly created_at: Date;
  updated_at?: Date;
}
