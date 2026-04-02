import { Router } from "express";
import { db } from "../db/client.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare(`SELECT * FROM products ORDER BY id DESC`).all();
  res.json(rows);
});

router.post(
  "/",
  validateBody(["name", "purchase_price", "sale_price"]),
  (req, res) => {
    const payload = req.body;
    const info = db.prepare(`
      INSERT INTO products
      (name, category, purchase_price, sale_price, m2_price, raw_m2_price, painted_m2_price, cost_notes)
      VALUES (@name, @category, @purchase_price, @sale_price, @m2_price, @raw_m2_price, @painted_m2_price, @cost_notes)
    `).run(payload);

    res.status(201).json({ id: info.lastInsertRowid, message: "Urun olusturuldu." });
  }
);

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM products WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Urun silindi." });
});

export default router;
