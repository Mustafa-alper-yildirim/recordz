import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    env.jwtSecret,
    { expiresIn: "12h" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
