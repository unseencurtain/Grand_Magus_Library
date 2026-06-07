import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import * as v from "../utils/crypto";
import * as user from "../db/schema/users";
import { decode, sign, verify } from "hono/jwt";

const JWT_EXPIRATION_SECONDS = 5 * 60; // 5 Minutes
const JWT_SECRET = "IceCreamRulesForever";

const registerSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(4),
});

const loginSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(1),
});

const authenticationRoutes = new Hono();

authenticationRoutes.post(
  "/register",
  zValidator("json", registerSchema),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const userExists = await user.checkAtRegisterEmail(email);
    if (userExists) {
      return c.json({ error: "Email already in use" }, 409);
    }

    const passwordHash = await v.hashPassword(password);
    const data = await user.createUser(
      email,
      passwordHash,
      user.userRoleEnum.User,
    );

    return c.json(data, 201);
  },
);

authenticationRoutes.post(
  "/login",
  zValidator("json", loginSchema),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const emailExists = await user.checkAtRegisterEmail(email);
    if (!emailExists) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    const getHash = await user.getPasswordHash(email);
    const validPassword = await v.verifyPassword(password, getHash);
    if (!validPassword) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    /** JWT Authorization */
    const id = await user.getIdByEmail(email);
    const now = Math.floor(Date.now() / 1000);
    const token = await sign(
      { exp: now + JWT_EXPIRATION_SECONDS, sub: id, email: email },
      JWT_SECRET,
      "HS256",
    );

    return c.json({ token });
  },
);

export default authenticationRoutes;
