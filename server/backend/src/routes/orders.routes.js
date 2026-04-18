import { Router } from "express";
import { db } from "../db/client.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare(`
    SELECT ord.*, o.offer_no, o.net_total, o.order_date, o.delivery_date, o.term_days, c.company_name, c.full_name
    FROM orders ord
    JOIN offers o ON o.id = ord.offer_id
    JOIN cari_accounts c ON c.id = o.cari_id
    ORDER BY ord.id DESC
  `).all();
  res.json(rows);
});

router.patch("/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run(status, id);
  res.json({ message: "Siparis durumu guncellendi." });
});

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM orders WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Siparis silindi." });
});

export default router;
