# Silva Ahsap Kapak Imalat Teklif Siparis Programi

Bu proje, Silva Ahsap icin teklif, siparis, cari, urun, stok, muhasebe ve personel takibini yapan web tabanli yonetim panelidir.

## Ozellikler

- Backend API ile calisacak sekilde hazirlanmistir.
- Cari, teklif, siparis, urun, stok, muhasebe ve personel kayitlari eklenebilir.
- Teklifler onaylandiginda siparise donusturulebilir.
- Giris ekrani ve oturum acma/kapatma akisi vardir.
- Rol bazli demo kullanicilar vardir: `admin`, `muhasebe`, `personel`.
- Teklifler yazdirilabilir ve tarayici uzerinden PDF olarak kaydedilebilir.
- Cari bakiye hareketleri ile tahsilat/odeme kayitlari tutulabilir.
- Cari ekstre ve bakiye raporu eklenmistir.
- Finans bolumunde tahsilat ve odeme toplam ozet kartlari bulunur.
- Dashboard kartlari ve grafik veriye gore otomatik guncellenir.
- Veriler ayni tarayicida kalici olarak saklanir.
- `server/` klasoru altinda gercek kullanici sistemi icin hazir sunuculu proje iskeleti bulunur.

## Calistirma

`index.html` dosyasini tarayicida acmaniz yeterlidir.

## Dosyalar

- `index.html`: Panel arayuzu ve sayfa bolumleri
- `styles.css`: Dashboard, form, tablo ve responsive stiller
- `api-client.js`: Mevcut panelin backend API istemcisi
- `app.js`: Panelin backend baglantili davranislari
- `tools/`: Kurulum, guncelleme ve baslatma yardimci dosyalari

## Backend Ile Calistirma

1. `server/backend/.env.example` dosyasini `.env` olarak kopyalayin.
2. Backend klasorunde `npm install`
3. `npm run db:init`
4. `npm run dev`
5. Ardindan `index.html` dosyasini acin.

Not: Backend calismadan panelde veri islemleri gerceklesmez.
