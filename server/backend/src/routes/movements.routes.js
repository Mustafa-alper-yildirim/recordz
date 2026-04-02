import { Router } from "express";
import { db } from "../db/client.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare(`
    SELECT am.*, c.company_name, c.full_name
    FROM account_movements am
    JOIN cari_accounts c ON c.id = am.cari_id
    ORDER BY am.movement_date DESC, am.id DESC
  `).all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const payload = req.body;
  const info = db.prepare(`
    INSERT INTO account_movements (cari_id, movement_type, amount, movement_date, note)
    VALUES (@cari_id, @movement_type, @amount, @movement_date, @note)
  `).run(payload);

  res.status(201).json({ id: info.lastInsertRowid, message: "Cari hareketi eklendi." });
});

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM account_movements WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Cari hareketi silindi." });
});

export default router;
