import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { env } from "../config/env.js";

const resolved = path.resolve(process.cwd(), env.dbFile);
fs.mkdirSync(path.dirname(resolved), { recursive: true });

export const db = new Database(resolved);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
