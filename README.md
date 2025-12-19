[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/2J6DRLWD)

# Movs & Series - Film ve Dizi Kütüphanesi

Bu proje, **TMDB (The Movie Database) API** kullanılarak geliştirilmiş modern bir film ve dizi arama/listeleme uygulamasıdır. Kullanıcılar popüler filmleri inceleyebilir, detaylarını görüntüleyebilir, favorilerine ekleyebilir ve gelişmiş filtreleme seçeneklerini kullanabilirler.

## Özellikler

Proje içerisinde aşağıdaki temel ve gelişmiş özellikler bulunmaktadır:

* **Dinamik Veri Çekme:** TMDB API üzerinden güncel popüler filmlerin listelenmesi.
* **Infinite Scroll (Sonsuz Kaydırma):** Sayfa sonuna gelindiğinde otomatik olarak yeni filmlerin yüklenmesi.
* **Arama Sistemi & Validasyon:**
    * Film ve dizi arama özelliği.
    * **Input Validation:** Boş veya sadece boşluk (space) içeren aramaların engellenmesi (Client-side validation).
* **Detaylı Filtreleme:** Filmleri **Tür (Kategori)** ve **Yıl** bazında filtreleme imkanı.
* **Favori Sistemi (Local Storage):** Kullanıcıların beğendikleri filmleri favorilere eklemesi ve tarayıcıyı kapatsalar bile verilerin kaybolmaması.
* **Modal Yapısı:** Sayfa değişmeden açılan pencereler (Popup) ile film detaylarının ve favori listesinin gösterimi.
* **Responsive Tasarım:** Mobil, tablet ve masaüstü cihazlarla tam uyumlu (CSS Grid & Flexbox).
* **Modern Arayüz:** CSS animasyonları, geçiş efektleri ve özel tasarım bileşenler.

## Kullanılan Teknolojiler

* **HTML5:** Semantik etiket yapısı.
* **CSS3:** Flexbox, Grid, Keyframe Animasyonları, CSS Değişkenleri (Variables).
* **JavaScript (ES6+):**
    * `fetch` API & `async/await` yapısı.
    * DOM Manipülasyonu.
    * Event Listeners.
    * Local Storage API.

## Projeden Kareler

* **Ana Sayfa:** Popüler filmlerin grid yapısında listelenmesi.
* **Detay Modalı:** Filme tıklandığında açılan özet, oyuncu kadrosu ve puan bilgisi.
* **Filtreleme Menüsü:** Kategori ve yıla göre özel listeleme.

---
*Bu proje Web Tasarımı ve Programlama dersi kapsamında geliştirilmiştir.*