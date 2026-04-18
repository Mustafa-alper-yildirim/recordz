import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

const resolved = path.resolve(process.cwd(), env.dbFile);
fs.mkdirSync(path.dirname(resolved), { recursive: true });

export const db = new Database(resolved);

try {
  db.pragma("journal_mode = WAL");
} catch (error) {
  console.warn(
    `SQLite WAL mode could not be enabled for ${resolved}. Falling back to DELETE journal mode.`,
    error
  );
  try {
    db.pragma("journal_mode = DELETE");
  } catch (fallbackError) {
    console.warn(
      `SQLite DELETE journal mode could not be enabled for ${resolved}. Continuing with SQLite defaults.`,
      fallbackError
    );
  }
}

db.pragma("foreign_keys = ON");

const schemaPath = path.resolve(process.cwd(), "src/db/schema.sql");
const seedPath = path.resolve(process.cwd(), "src/db/seed.sql");

const usersTableExists = db
  .prepare(
    "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'users' LIMIT 1"
  )
  .get();

if (!usersTableExists) {
  db.exec(fs.readFileSync(schemaPath, "utf8"));
  db.exec(fs.readFileSync(seedPath, "utf8"));

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, is_active)
    VALUES (@name, @email, @password_hash, @role, 1)
  `);

  const passwordHash = bcrypt.hashSync("123456", 10);
  [
    { name: "Mustafa A. Yildirim", email: "admin@silvaahsap.com", role: "admin" },
    { name: "Selin Kaya", email: "muhasebe@silvaahsap.com", role: "muhasebe" },
    { name: "Ayse Demir", email: "personel@silvaahsap.com", role: "personel" },
  ].forEach((user) => insertUser.run({ ...user, password_hash: passwordHash }));
}
