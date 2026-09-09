# EduVisual V1.1
Gerçek içerik altyapısına geçirilmiş ilk MVP.

Çalıştırma:
- Dosyaları aynı klasörde tutun.
- `index.html` açılabilir; ancak `data.json` fetch'i bazı tarayıcılarda file:// altında engellenebilir.
- Yayına aldığınızda doğrudan çalışır.
- En kolay yerel test: klasörde `python -m http.server 8000` çalıştırıp `http://localhost:8000` açmak.

Yeni özellikler:
- data.json içerik kataloğu
- gerçek klasör yapısı
- kategori + etiket + sınıf + açıklama araması
- her görsel için ayrı SEO sayfası
- gerçek ücretsiz indirme dosyası
- lazy-loaded görseller
- ileride admin/CMS/API eklenebilecek yapı

## V1.2 düzeltmeleri
- Kategori tıklaması artık filtreyi aktif olarak işaretler.
- Aynı kategoriye ikinci kez tıklayınca filtre kapanır ve tüm içerikler geri gelir.
- “Tümünü göster” hızlı sıfırlama seçeneği eklendi.
- SVG indirme dosyaları Adobe Illustrator'da düzenlenebilir vektör olarak açılabilir.
