import { db } from "../dbClient";

export async function createUserTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role: TEXT NOT NULL,
      createdAt TEXT DEFAULT (DATETIME('now', 'localtime'))
    );
  `);
}
