import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

const authRouter = new Hono();
authRouter.post("/", zValidator("json", loginSchema), (c) => {
  const { email, password } = c.req.valid("json");
  const login = verifyAuth(email, password);
  return c.json({ message: "success" }, 201);
});

export default authRouter;
