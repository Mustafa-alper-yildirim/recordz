import { Router } from "express";
import { db } from "../db/client.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare(`
    SELECT c.*,
      COALESCE((
        SELECT SUM(
          CASE
            WHEN am.movement_type = 'Tahsilat' THEN -am.amount
            ELSE am.amount
          END
        )
        FROM account_movements am
        WHERE am.cari_id = c.id
      ), 0) AS movement_balance
    FROM cari_accounts c
    ORDER BY c.id DESC
  `).all();

  res.json(rows);
});

router.post("/", (req, res) => {
  const payload = req.body;
  const info = db.prepare(`
    INSERT INTO cari_accounts
    (full_name, company_name, phone, tax_office, tax_number, discount_rate, balance_limit, risk_limit, type)
    VALUES (@full_name, @company_name, @phone, @tax_office, @tax_number, @discount_rate, @balance_limit, @risk_limit, @type)
  `).run(payload);

  res.status(201).json({ id: info.lastInsertRowid, message: "Cari olusturuldu." });
});

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM cari_accounts WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Cari silindi." });
});

router.get("/:id/statement", (req, res) => {
  const id = Number(req.params.id);
  const cari = db.prepare(`SELECT * FROM cari_accounts WHERE id = ?`).get(id);
  if (!cari) return res.status(404).json({ message: "Cari bulunamadi." });

  const movements = db.prepare(`
    SELECT * FROM account_movements
    WHERE cari_id = ?
    ORDER BY movement_date DESC, id DESC
  `).all(id);

  const offers = db.prepare(`
    SELECT o.*, ord.tracking_no, ord.status AS order_status
    FROM offers o
    LEFT JOIN orders ord ON ord.offer_id = o.id
    WHERE o.cari_id = ?
    ORDER BY o.created_at DESC
  `).all(id);

  res.json({ cari, movements, offers });
});

export default router;
