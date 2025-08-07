# Pilates Studio Yönetim Sistemi Dokümantasyonu

## Teknoloji Yığını
- Next.js 14.0.4
- TypeScript
- Tailwind CSS
- MongoDB
- NextAuth.js
- React Big Calendar
- Heroicons
- React Hot Toast

## Kullanıcı Tipleri
1. Yönetici (Admin)
2. Öğretmen
3. Öğrenci

## Veri Modelleri

### User (Kullanıcı)
- email: String (unique)
- password: String (hashed)
- name: String
- role: Enum ['admin', 'teacher', 'student']
- isActive: Boolean

### Branch (Şube)
- name: String
- address: String
- phone: String
- email: String (unique)
- managerName: String
- isActive: Boolean
- createdBy: ObjectId (User)

### Teacher (Öğretmen)
- branchId: ObjectId (Branch)
- firstName: String
- lastName: String
- phone: String
- email: String
- colorCode: String
- isActive: Boolean

### Student (Öğrenci)
- studentId: String (unique)
- branchId: ObjectId (Branch)
- firstName: String
- lastName: String
- phone: String
- email: String
- emergencyContact: Object
- healthInfo: Object
- startDate: Date
- endDate: Date
- isActive: Boolean
- teachers: Array[ObjectId] (Teacher)
- packages: Array[Object]

## Tamamlanan Görevler
1. Proje yapısı kurulumu
2. MongoDB bağlantısı
3. Kullanıcı modeli ve kimlik doğrulama
- [x] NextAuth yapılandırması güncellendi
- [x] Oturum yönetimi iyileştirildi
- [x] API route koruması eklendi
- [x] Kimlik doğrulama hataları düzeltildi
- [x] Giriş işlemi iyileştirildi
- [x] Admin kullanıcısı oluşturma script'i eklendi
4. Temel layout ve tema desteği
5. Şube yönetimi başlangıcı

## Devam Eden Görevler
1. Şube CRUD işlemleri
- [x] Şube listeleme API'si iyileştirildi
- [x] Hata yönetimi geliştirildi
- [ ] Şube güncelleme
- [ ] Şube silme
2. Öğretmen yönetimi
3. Öğrenci yönetimi
4. Takvim entegrasyonu

## Yapılacak Görevler
1. Paket yönetimi
2. Ödeme sistemi
3. Sağlık bilgileri takibi
4. Raporlama sistemi
5. Bildirim sistemi
6. Telafi dersi yönetimi
7. Oda ve cihaz yönetimi

## Önemli Gereksinimler
- Haftanın 6 günü çalışma (Pazar hariç)
- Çalışma saatleri: 09:00-22:00
- Her ders 1 saat
- Paket tipleri: 6, 8, 12, 16 saatlik
- Maksimum öğrenci sayıları:
  - 3 oda: 3 kişi
  - 1 oda: 2 kişi
  - 1 oda: 5 kişi (cihazsız) 

## Proje Yapısı ve Best Practices

### Kod Organizasyonu
- `/lib`: Yardımcı fonksiyonlar ve servisler
- `/components`: Yeniden kullanılabilir bileşenler
- `/hooks`: Custom React hooks
- `/types`: TypeScript tip tanımlamaları

### Hata Yönetimi
- Merkezi hata yönetimi sistemi
- Tutarlı hata mesajları
- Detaylı loglama

### State Yönetimi
- Sayfa bazlı state
- Global state için Context API
- Form state için özel hooks

### API İstekleri
- Merkezi api servisi
- İstek önbellekleme
- Hata yakalama 