import { Database } from "bun:sqlite";
import path from "node:path";

const dbClientUrl = import.meta.dirname;
const dbfile = path.join(dbClientUrl, "./files/magusLib.db");
export const db = new Database(dbfile);

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");
db.run("PRAGMA synchronous = NORMAL;");
