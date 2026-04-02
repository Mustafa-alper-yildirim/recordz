import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/client.js";
import { signToken } from "../utils/jwt.js";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "E-posta ve sifre zorunludur." });
  }

  const user = db.prepare(`
    SELECT id, name, email, password_hash, role, is_active
    FROM users
    WHERE email = ?
  `).get(email);

  if (!user || !user.is_active) {
    return res.status(401).json({ message: "Kullanici bulunamadi." });
  }

  const matches = bcrypt.compareSync(password, user.password_hash);
  if (!matches) {
    return res.status(401).json({ message: "Sifre hatali." });
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export default router;
