import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import pool from "./config/db";
import UserRoutes from "./routes/user.routes";

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

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/setup", async (req, res) => {
  const result = await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  res.send(result);
});

export default app;
