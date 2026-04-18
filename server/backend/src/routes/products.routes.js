import { Router } from "express";
import fs from "fs";
import path from "path";
import { db } from "../db/client.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const productColumns = db.prepare(`PRAGMA table_info(products)`).all();
if (!productColumns.some((column) => column.name === "image_url")) {
  db.prepare(`ALTER TABLE products ADD COLUMN image_url TEXT`).run();
}
if (!productColumns.some((column) => column.name === "unit")) {
  db.prepare(`ALTER TABLE products ADD COLUMN unit TEXT NOT NULL DEFAULT 'M2'`).run();
}

const uploadsDir = path.resolve(process.cwd(), "uploads", "products");
fs.mkdirSync(uploadsDir, { recursive: true });

function saveImageDataUrl(dataUrl, originalName = "urun-gorseli.png") {
  const match = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Gecersiz gorsel verisi.");
  }
  const mimeType = match[1];
  const base64Data = match[2];
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "png";
  const safeBaseName = String(originalName || "urun-gorseli")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 40) || "urun-gorseli";
  const fileName = `${Date.now()}-${safeBaseName}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
  return `/uploads/products/${fileName}`;
}

function deleteProductImage(imageUrl = "") {
  if (!imageUrl || !String(imageUrl).startsWith("/uploads/products/")) return;
  const filePath = path.resolve(process.cwd(), imageUrl.replace(/^\/+/, ""));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

router.get("/", (_req, res) => {
  const rows = db.prepare(`SELECT * FROM products ORDER BY id DESC`).all();
  res.json(rows);
});

router.post(
  "/upload-image",
  validateBody(["data_url"]),
  (req, res, next) => {
    try {
      const imageUrl = saveImageDataUrl(req.body.data_url, req.body.file_name);
      res.status(201).json({ image_url: imageUrl });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validateBody(["name", "purchase_price", "sale_price"]),
  (req, res) => {
    const payload = req.body;
    const info = db.prepare(`
      INSERT INTO products
      (name, category, purchase_price, sale_price, m2_price, raw_m2_price, painted_m2_price, unit, image_url, cost_notes)
      VALUES (@name, @category, @purchase_price, @sale_price, @m2_price, @raw_m2_price, @painted_m2_price, @unit, @image_url, @cost_notes)
    `).run(payload);

    res.status(201).json({ id: info.lastInsertRowid, message: "Urun olusturuldu." });
  }
);

router.post(
  "/bulk-update-category",
  validateBody(["category", "mode", "value"]),
  (req, res) => {
    const { category, mode, value } = req.body;
    const numericValue = Number(value || 0);
    const products = db.prepare(`SELECT * FROM products WHERE category = ?`).all(category);

    const updateStmt = db.prepare(`
      UPDATE products
      SET
        purchase_price = @purchase_price,
        sale_price = @sale_price,
        m2_price = @m2_price,
        raw_m2_price = @raw_m2_price,
        painted_m2_price = @painted_m2_price
      WHERE id = @id
    `);

    for (const product of products) {
      const applyValue = (current) => {
        const amount = Number(current || 0);
        if (mode === "percent") {
          return amount + amount * (numericValue / 100);
        }
        return amount + numericValue;
      };

      updateStmt.run({
        id: product.id,
        purchase_price: applyValue(product.purchase_price),
        sale_price: applyValue(product.sale_price),
        m2_price: applyValue(product.m2_price),
        raw_m2_price: applyValue(product.raw_m2_price),
        painted_m2_price: applyValue(product.painted_m2_price),
      });
    }

    res.json({ message: "Kategori bazli fiyatlar guncellendi.", count: products.length });
  }
);

router.patch(
  "/:id",
  validateBody(["name", "purchase_price", "sale_price"]),
  (req, res) => {
    const payload = req.body;
    const current = db.prepare(`SELECT image_url FROM products WHERE id = ?`).get(Number(req.params.id));
    db.prepare(`
      UPDATE products
      SET
        name = @name,
        category = @category,
        purchase_price = @purchase_price,
        sale_price = @sale_price,
        m2_price = @m2_price,
        raw_m2_price = @raw_m2_price,
        painted_m2_price = @painted_m2_price,
        unit = @unit,
        image_url = @image_url,
        cost_notes = @cost_notes
      WHERE id = @id
    `).run({
      ...payload,
      id: Number(req.params.id),
    });

    if (current?.image_url && current.image_url !== payload.image_url) {
      deleteProductImage(current.image_url);
    }

    res.json({ message: "Urun guncellendi." });
  }
);

router.delete("/:id", (req, res) => {
  const current = db.prepare(`SELECT image_url FROM products WHERE id = ?`).get(Number(req.params.id));
  db.prepare(`DELETE FROM products WHERE id = ?`).run(Number(req.params.id));
  if (current?.image_url) {
    deleteProductImage(current.image_url);
  }
  res.json({ message: "Urun silindi." });
});

export default router;
