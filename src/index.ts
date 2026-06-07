import { Hono } from "hono";
import authorRoutes from "./routes/authorRouter";
import authenticationRouter from "./routes/authenticationRouter";

const app = new Hono();

app.route("/auth", authenticationRouter);
app.route("/authors", authorRoutes);

export default app;
