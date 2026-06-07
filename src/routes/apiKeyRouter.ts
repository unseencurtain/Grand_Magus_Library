import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import * as v from "../utils/crypto";
import * as user from "../db/schema/users";
import * as apik from "../db/schema/apiKeys";
import { decode, jwt, sign, verify } from "hono/jwt";

const JWT_SECRET = "IceCreamRulesForever";
const createKeySchema = z.object({
  name: z.string(),
});
type jwtEnv = {
  Variables: {
    jwtPayload: { sub: string; email: string; exp: number };
  };
};

const apiKeyRoutes = new Hono<jwtEnv>();

apiKeyRoutes.use(jwt({ secret: JWT_SECRET, alg: "HS256" }));

apiKeyRoutes.get("/", async (c) => {
  const { sub: userId } = c.var.jwtPayload;
  const keys = await apik.getAllKeysById(parseInt(userId));
  return c.json({ list: keys });
});

apiKeyRoutes.post("/", zValidator("json", createKeySchema), async (c) => {
  const { sub: userId } = c.var.jwtPayload;
  const { name } = c.req.valid("json");
  const { raw, hash, prefix } = await v.generateApiKey();
  const data = await apik.createApiKeyRow(name, parseInt(userId), hash, prefix);
  return c.json({ key: raw, id: data.lastInsertRowid }, 201);
});

apiKeyRoutes.delete("/:id", async (c) => {
  const { sub: userId } = c.var.jwtPayload;
  const id = parseInt(c.req.param("id"));
  const data = await apik.deleteApiKeyById(id, parseInt(userId));
  if (data.changes === 0) {
    return c.json({ error: "Not your id to delete" });
  }
  return c.json({ data }, 201);
});

export default apiKeyRoutes;
