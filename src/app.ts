import express from "express";
import cors, { CorsOptions } from "cors";

const app = express();

const corsOptions: CorsOptions = {
  origin: "http://localhost:5172",
};

//middlewares
app.use(express.json());

app.use(cors(corsOptions));

//routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
