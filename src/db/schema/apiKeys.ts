import { get } from "node:https";
import { db } from "../dbClient";

export async function createAPIKeyTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS apikey (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      keyHash TEXT NOT NULL,
      keyPrefix TEXT NOT NULL,
      createdAt TEXT DEFAULT (DATETIME('now', 'localtime')),
      FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `);
}

export async function getAllKeysById(userId: number) {
  const getAllKeysById = db.query(
    `SELECT id, name, keyPrefix, createdAt FROM apikey WHERE userId = ?1`,
  );
  return getAllKeysById.all(userId);
}

export async function createApiKeyRow(
  name: string,
  userId: number,
  keyHash: string,
  keyPrefix: string,
) {
  const createApiKeyRow = db.query(
    `INSERT INTO apikey (userId, name, keyHash, keyPrefix) VALUES(?1, ?2, ?3, ?4);`,
  );
  return createApiKeyRow.run(userId, name, keyHash, keyPrefix);
}

export async function getAllKeys() {
  const getAllKeys = db.query(`SELECT * FROM apikey;`);
  return getAllKeys.all();
}

export async function deleteApiKeyById(id: number, userId: number) {
  const deleteApiKeyById = db.query(
    `DELETE FROM apikey WHERE id = ?1 AND userId = ?2`,
  );
  return deleteApiKeyById.run(id, userId);
}
