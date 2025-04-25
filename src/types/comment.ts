export interface NewComment {
  content: string;
  readonly creator_id: number;
  readonly parent_comment_id: number | null;
  readonly ticket_id: number;
}

export interface Comment extends NewComment {
  readonly id: number;
  readonly created_at: Date;
}
