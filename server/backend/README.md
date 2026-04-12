# Silva Ahsap Backend

Bu backend, Node.js + Express + SQLite tabanli API iskeletidir.

## Kurulum

Node.js icin onerilen surum: `22 LTS`

1. `.env.example` dosyasini `.env` olarak kopyalayin.
2. `npm install`
3. `npm run db:init`
4. `npm run dev`

Not: `ERR_MODULE_NOT_FOUND` goruyorsaniz ve `express` gibi paketler bulunamiyorsa, once `npm install` komutunun basariyla tamamlandigini kontrol edin. `better-sqlite3` paketi Node `24.x` ile bu projede sorun cikarabilir; bu durumda Node `22 LTS` kullanin.

## Demo Kullanicilar

- `admin@silvaahsap.com` / `123456`
- `muhasebe@silvaahsap.com` / `123456`
- `personel@silvaahsap.com` / `123456`

## API Modulleri

- Auth
- Users
- Cari
- Teklifler
- Siparisler
- Urunler
- Stoklar
- Muhasebe
- Personel
- Cari hareketleri

## Frontend Baglanti

Frontend icin hazir istemci:

- `../frontend/src/lib/api.js`

## Veritabani

- SQL semasi: `src/db/schema.sql`
- Seed: `src/db/seed.sql`
- Init script: `src/scripts/init-db.js`
