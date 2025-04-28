import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import pool from "./config/db";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import UserRoutes from "./routes/user.routes";
import TicketRoutes from "./routes/ticket.routes";
import CommentRoutes from "./routes/comment.routers";
const app = express();

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/user", UserRoutes);
app.use("/ticket", AuthMiddleware, TicketRoutes);
app.use("/comment", AuthMiddleware, CommentRoutes);

app.post("/setup", async (req, res) => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`;

  const ticketTableQuery = `CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'completed', 'closed')),
    reporter_id INTEGER NOT NULL,
    assignee_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_reporter FOREIGN KEY (reporter_id) REFERENCES users(id),
    CONSTRAINT fk_assignee FOREIGN KEY (assignee_id) REFERENCES users(id)
  )`;

  const commentTableQuery = `CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    creator_id INTEGER NOT NULL,
    ticket_id INTEGER NOT NULL,
    parent_comment_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_creator FOREIGN KEY (creator_id) REFERENCES users(id),
    CONSTRAINT fk_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    CONSTRAINT fk_parent_comment FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
  )`;

  await pool.query(userTableQuery);
  await pool.query(ticketTableQuery);
  await pool.query(commentTableQuery);

  res.status(201).json({ message: "Tables created successfully" });
});

export default app;
