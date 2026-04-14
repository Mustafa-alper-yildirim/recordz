CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','muhasebe','personel')),
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cari_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  phone TEXT,
  tax_office TEXT,
  tax_number TEXT,
  discount_rate REAL NOT NULL DEFAULT 0,
  balance_limit REAL NOT NULL DEFAULT 0,
  risk_limit REAL NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK(type IN ('Musteri','Tedarikci','Musteri/Tedarikci')),
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  purchase_price REAL NOT NULL DEFAULT 0,
  sale_price REAL NOT NULL DEFAULT 0,
  m2_price REAL NOT NULL DEFAULT 0,
  raw_m2_price REAL NOT NULL DEFAULT 0,
  painted_m2_price REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'M2',
  image_url TEXT,
  cost_notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  offer_no TEXT NOT NULL UNIQUE,
  cari_id INTEGER NOT NULL,
  cover_type TEXT NOT NULL,
  color TEXT NOT NULL,
  width REAL NOT NULL,
  height REAL NOT NULL,
  quantity INTEGER NOT NULL,
  shipment TEXT,
  order_date TEXT NOT NULL,
  term_days INTEGER NOT NULL DEFAULT 0,
  delivery_date TEXT NOT NULL,
  unit_price REAL NOT NULL,
  gross_total REAL NOT NULL,
  discount_rate REAL NOT NULL DEFAULT 0,
  net_total REAL NOT NULL,
  contract_text TEXT,
  status TEXT NOT NULL CHECK(status IN ('Beklemede','Onaylandi','Iptal')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cari_id) REFERENCES cari_accounts(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  offer_id INTEGER NOT NULL UNIQUE,
  tracking_no TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('Yeni','Onayli','Uretim','Tamamlandi','Iptal')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS stock_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT,
  quantity REAL NOT NULL DEFAULT 0,
  unit TEXT,
  unit_price REAL NOT NULL DEFAULT 0,
  supplier TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS finance_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('Hammadde','Iscilik','Dukkan','Showroom')),
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS personnel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Aktif','Izinli','Pasif')),
  phone TEXT,
  file_status TEXT,
  salary REAL NOT NULL DEFAULT 0,
  overtime_hours REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS account_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cari_id INTEGER NOT NULL,
  movement_type TEXT NOT NULL CHECK(movement_type IN ('Tahsilat','Odeme','Borc')),
  amount REAL NOT NULL,
  movement_date TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cari_id) REFERENCES cari_accounts(id) ON DELETE CASCADE
);
