import { db } from "../dbClient";

type AuthorData = {
  name?: string;
  age?: number;
};

export async function createAuthorTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      createdAt TEXT DEFAULT (DATETIME('now', 'localtime'))
    );
  `);
}

export async function createAuthor(name: string, age: number) {
  const createAuthor = db.query(
    `INSERT INTO authors (name, age) VALUES (?1, ?2);`,
  );
  createAuthor.all(name, age);
}

export async function listAllAuthor() {
  const listAllAuthor = db.query(`SELECT * FROM authors`);
  return listAllAuthor.all();
}

export async function getAutherByID(id: number) {
  const getAuthorByID = db.query(`SELECT * FROM authors where id = ?1;`);
  return getAuthorByID.get(id);
}

export async function updateAuthor(id: number, data: AuthorData) {
  let fields: string[] = [];
  let values: (string | number)[] = [];

  if (data.name != undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (data.age != undefined) {
    fields.push("age = ?");
    values.push(data.age);
  }

  if (fields.length === 0) {
    return "No name or age spcified. So nothing to update";
  }

  values.push(id);

  const updateAuthor = db.query(
    `UPDATE authors SET ${fields.join(", ")} WHERE id = ?`,
  );

  updateAuthor.run(...values);
  return "updated";
}

export async function deleteAuthor(id: number) {
  const deleteAuthor = db.query(`DELETE FROM authors WHERE id = ?`);
  const data = deleteAuthor.run(id);
  if (data.changes > 0) {
    return `Row Deleted`;
  } else {
    return `Row is missing possibly deleted previously`;
  }
}
