import { Router } from "express";
import { db } from "../db/client.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare(`SELECT * FROM personnel ORDER BY id DESC`).all();
  res.json(rows);
});

router.post(
  "/",
  validateBody(["name", "role_title", "status"]),
  (req, res) => {
    const payload = req.body;
    const info = db.prepare(`
      INSERT INTO personnel (name, role_title, status, phone, file_status, salary, overtime_hours)
      VALUES (@name, @role_title, @status, @phone, @file_status, @salary, @overtime_hours)
    `).run(payload);

    res.status(201).json({ id: info.lastInsertRowid, message: "Personel kaydi olusturuldu." });
  }
);

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM personnel WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Personel silindi." });
});

export default router;
