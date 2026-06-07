import { db } from "../dbClient";

export enum userRoleEnum {
  User = "user",
  Admin = "admin",
}

export async function createUserTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      createdAt TEXT DEFAULT (DATETIME('now', 'localtime'))
    );
  `);
}

export async function listUserTable() {
  const listUserTable = db.query(`SELECT * FROM users;`);
  return listUserTable.all();
}

export async function listUserTablePretty() {
  const users = await listUserTable();

  return users.map((user: any) => ({
    ...user,
    password:
      user.password.length > 40
        ? `${user.password.slice(0, 40)}...`
        : user.password,
  }));
}

export async function createUser(
  email: string,
  passwordHash: string,
  role: userRoleEnum,
) {
  const registerUser = db.query(
    `INSERT INTO users (email, password, role) VALUES(?1, ?2, ?3);`,
  );
  return registerUser.run(email, passwordHash, role);
}

export async function checkAtRegisterEmail(email: string) {
  const checkAtRegisterEmail = db.query(
    `SELECT EXISTS(SELECT 1 FROM users WHERE email = ?1) AS userExists;`,
  );
  const data = checkAtRegisterEmail.get(email) as { userExists: string };
  return data?.userExists;
}

export async function getPasswordHash(email: string) {
  const getPasswordHash = db.query(
    `SELECT password FROM users WHERE email = ?1;`,
  );
  const data = getPasswordHash.get(email) as { password: string };
  return data?.password;
}

export async function getIdByEmail(email: string) {
  const getIdByEmail = db.query(`SELECT id FROM USERS WHERE email = ?1;`);
  const data = getIdByEmail.get(email) as { id: number };
  return data?.id;
}
