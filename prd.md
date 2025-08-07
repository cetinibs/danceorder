# 📄 ÜRÜN GEREKSİNİMLERİ DOKÜMANI (PRD)

## 🔖 Proje Adı

**Eğitim Takip ve Planlama Sistemi**

---

## 🔧 Kullanılacak Teknolojiler

| Teknoloji       | Amaç                          |
| --------------- | ----------------------------- |
| **Next.js**     | Uygulama önyüz geliştirmesi   |
| **TailwindCSS** | UI/UX tasarım ve stillendirme |
| **MongoDB**     | NoSQL veritabanı              |

---

## 👥 Kullanıcı Tipleri

1. **Yönetici**

   - Şube, öğretmen, öğrenci ekleme
   - Takvim planı yapma, oda ve cihaz yönetimi
   - Hizmet ve paket tanımlama, raporlama
   - Ödeme takibi, ders planı izleme

2. **Öğretmen**

   - Kendi öğrencileriyle ilgili planlama ve not ekleme
   - Takvimde ders ekleme, yedek öğretmen olarak atanma

3. **Öğrenci**

   - Ders takvimi görülebilir, paket üreti ve kalan saatleri takip eder
   - Telafi hakkı kullanabilir, ertelenen dersi takvimde görebilir

---

## 📂 Ana Modüller

### 1. Giriş ve Yetkilendirme

- NextAuth ile JWT tabanlı oturum yönetimi
- Rol bazlı erişim kontrolü

### 2. Şube Yönetimi

- Ad, adres, telefon, e-posta, yönetici bilgisi
- Her şubenin haftalık takvim planı olur

### 3. Öğretmen Yönetimi

- Bilgiler: ad, soyad, telefon, e-posta
- Renk kodu atanır (takvim görseli için)
- Şubeye atanır

### 4. Öğrenci Yönetimi

- Otomatik, unique öğrenci ID
- Kisisel, yakın ve sağlık bilgileri
- Paket seçimi, ödeme, kalan saat, kalan bakiye
- Ders planı, telafi hakkı ve takvim entegrasyonu

### 5. Takvim Planlama

- Haftalık görünüm: 09:00 - 22:00, Pazar dahil değil
- 1 saatlik ders blokları
- Her ders rengi ilgili öğretmenin rengi
- Boşluklara ders ve telafi eklenebilir

### 6. Hizmet ve Paket Yönetimi

- Hizmetler: Pilates, Klinik Pilates, Fizyoterapi, Zumba, Yoga, Hamak Yoga
- Paket tipleri:
  - Bireysel: 8, 12, 16 saat
  - Düet: 8, 12, 16 saat
  - Grup: 8, 12, 16 saat
  - Zumba/Yoga/Hamak Yoga: saatlik tek ders
- Her paket fiyatı ve içeriği güncellenebilir

### 7. Ödeme Takibi

- Ödeme alındığında kalan bakiye ve saat güncellenir
- Öğretmene yansır
- Geçmiş ve yaklaşan ödemeler bildirimle sunulur

### 8. Sağlık Verileri

- Yağ ölçüm cihazından veriler kaydedilir
- Tarih bazlı takip edilir

### 9. Raporlama

- Aktif / pasif öğrenci sayısı
- Aylık toplam aidat
- Geçmiş ödemeler ışığında uyarı listesi

### 10. Oda ve Cihaz Yönetimi

- Toplam 5 oda:
  - 3 cihazlı oda (max 3 kişi)
  - 2 cihazlı oda (max 2 kişi)
  - Cihazsız oda (max 5 kişi)

### 11. Vekil Öğretmen Atama

- Gelmeyen öğretmenin yerine diğer öğretmen atanabilir

### 12. Bildirim Sistemi

- Yaklaşan öğrenci ödemeleri
- Öğretmene ait ödeme bildirimleri
- Ödemesi geciken öğrenci uyarıları

---

## 📅 Haftalık Takvim Kuralları

- Günler: Pazartesi - Cumartesi (Pazar yok)
- Saatler: 09:00 - 22:00 (1 saatlik bloklar)
- Duet ve grup derslerinde bir kişinin katılması yeterlidir
- Öğrenci talebiyle ders ertelenebilir ve takvime taşınabilir

---

## 📃 MongoDB Koleksiyonları (Taslak)

```ts
users: [admin, teacher, student]
branches: [name, address, admin_id]
teachers: [name, colorCode, branch_id]
students: [name, guardian, health, package, status]
services: [Pilates, Fizyoterapi...]
packages: [type, hours, price, service_id]
rooms: [deviceCount, capacity]
devices: [type, room_id]
schedules: [branch_id, teacher_id, student_id, date]
payments: [student_id, amount, date, status]
notifications: [targetUser, type, message, read]
health_data: [student_id, fat_percent, date]
```

---

## 🛠️ Teknik Notlar ve Mimarî Tavsiyeler

- Rate-limitli API uç noktaları
- Veritabanı indexleme
- Asenkron programlama (Takvim & Ödeme yüklemeleri)
- CI/CD pipeline (Vercel / GitHub Actions)
- Logging & Monitoring (LogRocket / Sentry)
- Unit Test + Integration Test
- Role-based Access Control (RBAC)

---

Hazır! Şimdi istersen şu adıma geçebiliriz:

- Mongoose şemaları
- Next.js page & route yapısı
- UI bileşen tasarımları
- Takvim komponenti ve dersi gösterme sistemi

Hangisinden başlayalım?

