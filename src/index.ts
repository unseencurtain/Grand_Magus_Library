import { Hono } from "hono";
import authorRoutes from "./routes/authorRouter";
import authRouter from "./routes/authRouter";

const app = new Hono();

// app.route("/register", authRouter);
app.route("/authors", authorRoutes);

export default app;
