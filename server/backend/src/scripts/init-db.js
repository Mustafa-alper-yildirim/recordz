import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { db } from "../db/client.js";

const schemaPath = path.resolve(process.cwd(), "src/db/schema.sql");
const seedPath = path.resolve(process.cwd(), "src/db/seed.sql");

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

console.log("Database initialized.");
