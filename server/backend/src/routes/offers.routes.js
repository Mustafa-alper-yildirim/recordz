import { Router } from "express";
import { db } from "../db/client.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare(`
    SELECT o.*, c.company_name, c.full_name
    FROM offers o
    JOIN cari_accounts c ON c.id = o.cari_id
    ORDER BY o.id DESC
  `).all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const payload = req.body;
  const info = db.prepare(`
    INSERT INTO offers
    (offer_no, cari_id, cover_type, color, width, height, quantity, shipment, order_date, term_days, delivery_date, unit_price, gross_total, discount_rate, net_total, contract_text, status)
    VALUES
    (@offer_no, @cari_id, @cover_type, @color, @width, @height, @quantity, @shipment, @order_date, @term_days, @delivery_date, @unit_price, @gross_total, @discount_rate, @net_total, @contract_text, @status)
  `).run(payload);

  res.status(201).json({ id: info.lastInsertRowid, message: "Teklif olusturuldu." });
});

router.post("/:id/approve", (req, res) => {
  const id = Number(req.params.id);
  const offer = db.prepare(`SELECT * FROM offers WHERE id = ?`).get(id);
  if (!offer) return res.status(404).json({ message: "Teklif bulunamadi." });

  const transaction = db.transaction(() => {
    db.prepare(`UPDATE offers SET status = 'Onaylandi' WHERE id = ?`).run(id);
    db.prepare(`
      INSERT INTO orders (offer_id, tracking_no, status)
      VALUES (?, ?, 'Yeni')
    `).run(id, `SP-${id}`);
  });

  transaction();
  res.json({ message: "Teklif onaylandi ve siparis olusturuldu." });
});

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM offers WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Teklif silindi." });
});

export default router;
