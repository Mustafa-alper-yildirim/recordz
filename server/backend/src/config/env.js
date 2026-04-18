import dotenv from "dotenv";
import os from "os";
import path from "path";

dotenv.config();

const defaultDbFile = (() => {
  if (process.env.DB_FILE) return process.env.DB_FILE;

  if (process.platform === "win32") {
    return path.join(os.tmpdir(), "silva-ahsap-backend", "silva-ahsap.sqlite");
  }

  return "./data/silva-ahsap.sqlite";
})();

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "change-me",
  dbFile: defaultDbFile,
};
