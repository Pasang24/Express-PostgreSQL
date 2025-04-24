import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import pool from "./config/db";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import UserRoutes from "./routes/user.routes";
import TicketRoutes from "./routes/ticket.routes";

const app = express();

const corsOptions: CorsOptions = {
  origin: "http://localhost:5172",
};

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

//routes
app.use("/user", UserRoutes);
app.use("/ticket", AuthMiddleware, TicketRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

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

  await pool.query(userTableQuery);
  await pool.query(ticketTableQuery);

  res.status(201).json({ message: "Tables created successfully" });
});

export default app;
