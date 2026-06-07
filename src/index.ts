import { Hono } from "hono";
import authorRoutes from "./routes/authorRouter";
import authenticationRoutes from "./routes/authenticationRouter";
import apiKeyRoutes from "./routes/apiKeyRouter";

const app = new Hono();

app.route("/auth", authenticationRoutes);
app.route("/authors", authorRoutes);
app.route("/apikeys", apiKeyRoutes);

export default app;
