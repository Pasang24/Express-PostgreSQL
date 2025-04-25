import { Request, Response } from "express";
import CommentModel from "../models/comment.model";
import { NewComment } from "../types/comment";

const generateComment = async (
  req: Request<{}, {}, Omit<NewComment, "creator_id">>,
  res: Response
) => {
  const { content, parent_comment_id, ticket_id } = req.body;

  const creator_id = Number(req.user?.id);

  const comment = await CommentModel.createComment({
    content,
    creator_id,
    parent_comment_id,
    ticket_id,
  });

  res.status(201).json({ comment });
};

const getCommentsByTicketId = async (
  req: Request<{ ticketId: string }, {}, {}>,
  res: Response
) => {
  const ticketId = Number(req.params.ticketId);

  const comments = await CommentModel.findCommentsByTicketId(ticketId);

  res.status(200).json({ comments });
};

const CommentController = { generateComment, getCommentsByTicketId };

export default CommentController;
