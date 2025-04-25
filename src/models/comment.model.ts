import pool from "../config/db";
import { Comment, NewComment } from "../types/comment";

export default class CommentModel implements Comment {
  constructor(
    public readonly id: number,
    public content: string,
    public readonly creator_id: number,
    public readonly parent_comment_id: number | null,
    public readonly ticket_id: number,
    public readonly created_at: Date
  ) {}

  static async createComment(comment: NewComment): Promise<CommentModel> {
    const result = await pool.query<Comment>(
      `INSERT INTO comments (content, creator_id, parent_comment_id, ticket_id) VALUES($1,$2,$3,$4) RETURNING *`,
      [
        comment.content,
        comment.creator_id,
        comment.parent_comment_id,
        comment.ticket_id,
      ]
    );

    const {
      id,
      content,
      created_at,
      creator_id,
      parent_comment_id,
      ticket_id,
    } = result.rows[0];

    const newComment = new CommentModel(
      id,
      content,
      creator_id,
      parent_comment_id,
      ticket_id,
      created_at
    );

    return newComment;
  }

  static async findCommentsByTicketId(
    ticketId: number
  ): Promise<CommentModel[]> {
    const result = await pool.query<Comment>(
      `SELECT * FROM comments WHERE ticket_id = $1`,
      [ticketId]
    );

    const comments = result.rows;

    const newComments = comments.map(
      (comment) =>
        new CommentModel(
          comment.id,
          comment.content,
          comment.creator_id,
          comment.parent_comment_id,
          comment.ticket_id,
          comment.created_at
        )
    );

    return newComments;
  }
}
