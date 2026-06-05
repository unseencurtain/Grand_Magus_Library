import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const createAuthorSchema = z.object({
  name: z.string(),
  age: z.coerce.number(),
});

const updateAuthorSchema = z.object({
  name: z.string().optional(),
  age: z.coerce.number().optional(),
});

const authors = [
  {
    id: "1",
    name: "Yun Yun",
    age: 23,
  },
  {
    id: "2",
    name: "Aisha Stace",
    age: 12,
  },
  {
    id: "3",
    name: "Emily Redwood",
    age: 16,
  },
];

const authorRoutes = new Hono();

authorRoutes.get("/", (c) => {
  return c.json(authors);
});

authorRoutes.get("/:id", (c) => {
  const id = c.req.param("id");
  const author = authors.find((a) => a.id === id);
  if (!author) {
    return c.json({ errorMessage: "author not found" }, 404);
  }
  return c.json(author);
});

authorRoutes.post("/", zValidator("json", createAuthorSchema), (c) => {
  const data = c.req.valid("json");
  const newAuthor = {
    id: crypto.randomUUID(),
    ...data,
  };
  authors.push(newAuthor);

  return c.json(newAuthor, 201);
});

authorRoutes.put("/:id", zValidator("json", updateAuthorSchema), (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const author = authors.find((a) => a.id === id);
  if (!author) {
    return c.json({ errorMessage: "author not found" }, 200);
  }
  if (data.name != undefined) {
    author.name = data.name;
  }
  if (data.age != undefined) {
    author.age = data.age;
  }

  return c.json({ id: author.id, name: author.name, age: author.age }, 201);
});

authorRoutes.delete("/:id", (c) => {
  const id = c.req.param("id");
  const index = authors.findIndex((a) => a.id === id);

  if (index === -1) {
    return c.json({ errorMessage: "author not found" }, 404);
  }

  authors.splice(index, 1);
  return c.body(null, 204);
});

export default authorRoutes;
