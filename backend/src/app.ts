import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes";
import sweetRoutes from "./sweets/sweets.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes); 

app.get("/", (_req, res) => {
  res.send("Sweet Shop API running");
});

export default app;
