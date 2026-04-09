import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "12mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "silva-ahsap-backend" });
});

app.use("/api", routes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});
