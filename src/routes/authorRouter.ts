import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import * as authorTab from "../db/schema/authors";

const createAuthorSchema = z.object({
  name: z.string(),
  age: z.coerce.number(),
});

const updateAuthorSchema = z.object({
  name: z.string().optional(),
  age: z.coerce.number().optional(),
});

const authorRoutes = new Hono();

/** Get all authors */
authorRoutes.get("/", async (c) => {
  return c.json(await authorTab.listAllAuthor());
});
/** Get author by ID */
authorRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const author = await authorTab.getAutherByID(parseInt(id));
  if (!author) {
    return c.json({ errorMessage: "author not found" }, 404);
  }
  return c.json(author);
});
/** Create a new author */
authorRoutes.post("/", zValidator("json", createAuthorSchema), async (c) => {
  const data = c.req.valid("json");
  const { name, age } = data;
  await authorTab.createAuthor(name, age);
  return c.json({ message: "author created" }, 201);
});
/** Update an author */
authorRoutes.put("/:id", zValidator("json", updateAuthorSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");

  const message = await authorTab.updateAuthor(id, data);

  return c.json({ message }, 201);
});
/** Delete an author */
authorRoutes.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const message = await authorTab.deleteAuthor(id);

  return c.json({ message }, 203);
});

export default authorRoutes;
