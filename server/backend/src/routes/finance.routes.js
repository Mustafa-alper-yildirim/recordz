import { Router } from "express";
import { db } from "../db/client.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare(`SELECT * FROM finance_entries ORDER BY id DESC`).all();
  const totals = db.prepare(`
    SELECT
      COALESCE(SUM(amount), 0) AS total_cost,
      COALESCE(SUM(CASE WHEN type IN ('Dukkan', 'Showroom') THEN amount ELSE 0 END), 0) AS general_expenses
    FROM finance_entries
  `).get();

  res.json({ items: rows, totals });
});

router.post(
  "/",
  validateBody(["type", "title", "amount"]),
  (req, res) => {
    const payload = req.body;
    const info = db.prepare(`
      INSERT INTO finance_entries (type, title, amount)
      VALUES (@type, @title, @amount)
    `).run(payload);

    res.status(201).json({ id: info.lastInsertRowid, message: "Maliyet kalemi olusturuldu." });
  }
);

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM finance_entries WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Maliyet kalemi silindi." });
});

export default router;
