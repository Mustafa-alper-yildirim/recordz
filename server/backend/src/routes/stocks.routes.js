import { Router } from "express";
import { db } from "../db/client.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/", (_req, res) => {
  const rows = db.prepare(`SELECT * FROM stock_items ORDER BY id DESC`).all();
  res.json(rows);
});

router.post(
  "/",
  validateBody(["name", "quantity", "unit_price"]),
  (req, res) => {
    const payload = req.body;
    const info = db.prepare(`
      INSERT INTO stock_items (name, type, quantity, unit, unit_price, supplier)
      VALUES (@name, @type, @quantity, @unit, @unit_price, @supplier)
    `).run(payload);

    res.status(201).json({ id: info.lastInsertRowid, message: "Stok kalemi olusturuldu." });
  }
);

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM stock_items WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Stok kalemi silindi." });
});

export default router;
