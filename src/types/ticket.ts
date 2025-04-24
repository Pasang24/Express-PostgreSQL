export interface NewTicket {
  title: string;
  description: string;
  status: "pending" | "completed" | "closed";
  readonly reporter_id: number;
  readonly assignee_id: number;
}

export interface Ticket extends NewTicket {
  readonly id: number;
  readonly created_at: Date;
  updated_at?: Date;
}
