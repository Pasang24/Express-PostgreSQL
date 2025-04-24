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
  const result = await pool.query(`
  CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'closed')),
  reporter_id INTEGER NOT NULL,
  assignee_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_reporter FOREIGN KEY (reporter_id) REFERENCES users(id),
  CONSTRAINT fk_assignee FOREIGN KEY (assignee_id) REFERENCES users(id)
);
`);

  res.send(result);
});

export default app;
