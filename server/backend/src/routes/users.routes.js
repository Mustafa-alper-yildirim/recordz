import { Router } from "express";
import { db } from "../db/client.js";

const router = Router();

router.get("/me", (req, res) => {
  const user = db.prepare(`
    SELECT id, name, email, role, is_active, created_at
    FROM users
    WHERE id = ?
  `).get(req.user.sub);

  if (!user) {
    return res.status(404).json({ message: "Kullanici bulunamadi." });
  }

  res.json(user);
});

export default router;
