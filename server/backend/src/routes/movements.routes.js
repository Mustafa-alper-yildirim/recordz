import { Router } from "express";
import { db } from "../db/client.js";

const router = Router();

function toDbMovementType(type) {
  if (type === "Alacak Dekontu") return "Tahsilat";
  if (type === "Borc Dekontu") return "Borc";
  return type;
}

function toUiMovementType(type) {
  if (type === "Tahsilat") return "Alacak Dekontu";
  if (type === "Borc" || type === "Odeme") return "Borc Dekontu";
  return type;
}

router.get("/", (_req, res) => {
  const rows = db.prepare(`
    SELECT am.*, c.company_name, c.full_name
    FROM account_movements am
    JOIN cari_accounts c ON c.id = am.cari_id
    ORDER BY am.movement_date DESC, am.id DESC
  `).all().map((row) => ({
    ...row,
    movement_type: toUiMovementType(row.movement_type),
  }));
  res.json(rows);
});

router.post("/", (req, res) => {
  const payload = {
    ...req.body,
    movement_type: toDbMovementType(req.body?.movement_type),
  };
  const info = db.prepare(`
    INSERT INTO account_movements (cari_id, movement_type, amount, movement_date, note)
    VALUES (@cari_id, @movement_type, @amount, @movement_date, @note)
  `).run(payload);

  res.status(201).json({ id: info.lastInsertRowid, message: "Cari hareketi eklendi." });
});

router.patch("/:id", (req, res) => {
  const payload = {
    ...req.body,
    id: Number(req.params.id),
    movement_type: toDbMovementType(req.body?.movement_type),
  };
  db.prepare(`
    UPDATE account_movements
    SET cari_id = @cari_id,
        movement_type = @movement_type,
        amount = @amount,
        movement_date = @movement_date,
        note = @note
    WHERE id = @id
  `).run(payload);

  res.json({ message: "Cari hareketi guncellendi." });
});

router.delete("/:id", (req, res) => {
  db.prepare(`DELETE FROM account_movements WHERE id = ?`).run(Number(req.params.id));
  res.json({ message: "Cari hareketi silindi." });
});

export default router;
