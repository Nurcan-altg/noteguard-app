# Katkıda Bulunma Rehberi

NoteGuard projesine katkıda bulunmak istediğiniz için teşekkürler! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 🚀 Başlarken

### Gereksinimler
- Python 3.9+
- Node.js 16+
- Git

### Kurulum
1. Bu repository'yi fork edin
2. Local clone oluşturun:
   ```bash
   git clone https://github.com/YOUR_USERNAME/noteguard-app.git
   cd noteguard-app
   ```
3. Backend bağımlılıklarını yükleyin:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Frontend bağımlılıklarını yükleyin:
   ```bash
   cd frontend
   npm install
   ```

## 🔧 Geliştirme

### Kod Standartları

#### Backend (Python)
- **Black** kullanarak kod formatlaması yapın
- **Flake8** ile linting kontrolü yapın
- **Type hints** kullanın
- **Docstrings** ekleyin

```bash
cd backend
black .
flake8 .
```

#### Frontend (TypeScript/React)
- **Prettier** ile kod formatlaması yapın
- **ESLint** ile linting kontrolü yapın
- **TypeScript** tip güvenliği sağlayın

```bash
cd frontend
npm run format
npm run lint
```

### Test Yazma

#### Backend Testleri
```bash
cd backend
pytest
```

#### Frontend Testleri
```bash
cd frontend
npm test
```

## 📝 Pull Request Süreci

1. **Feature branch oluşturun:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Değişikliklerinizi yapın ve commit edin:**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

3. **Branch'inizi push edin:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Pull Request oluşturun**

### Commit Mesaj Formatı
```
type(scope): description

[optional body]

[optional footer]
```

**Türler:**
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon değişiklikleri
- `style`: Kod formatlaması
- `refactor`: Kod refactoring
- `test`: Test ekleme/düzenleme
- `chore`: Genel bakım

**Örnekler:**
```
feat(api): add semantic analysis endpoint
fix(frontend): resolve semantic score display issue
docs(readme): update installation instructions
```

## 🐛 Hata Bildirimi

Hata bildirirken şu bilgileri ekleyin:
- **İşletim Sistemi:** Windows/Mac/Linux
- **Python Sürümü:** 3.9+
- **Node.js Sürümü:** 16+
- **Hata Açıklaması:** Detaylı açıklama
- **Beklenen Davranış:** Ne olması gerekiyordu
- **Gerçek Davranış:** Ne oldu
- **Adımlar:** Hatayı tekrarlamak için adımlar

## 💡 Özellik Önerileri

Yeni özellik önerirken:
1. **Açık ve net** bir açıklama yapın
2. **Kullanım senaryolarını** belirtin
3. **Teknik detayları** açıklayın
4. **Mockup/Prototip** varsa ekleyin

## 🤝 Code Review

### Review Yaparken
- **Kod kalitesini** kontrol edin
- **Test coverage**'ını değerlendirin
- **Dokümantasyonu** gözden geçirin
- **Güvenlik** açıklarını kontrol edin

### Review Alırken
- **Yapıcı geri bildirimleri** kabul edin
- **Değişiklikleri** hızlıca uygulayın
- **Soruları** net bir şekilde yanıtlayın

## 📚 Dokümantasyon

### Dokümantasyon Yazarken
- **Açık ve anlaşılır** olun
- **Örnekler** ekleyin
- **Güncel** tutun
- **Tutarlı** format kullanın

### Dokümantasyon Türleri
- **API Dokümantasyonu:** Backend endpoint'leri
- **Kullanıcı Kılavuzu:** Frontend kullanımı
- **Geliştirici Kılavuzu:** Kurulum ve geliştirme
- **Deployment Kılavuzu:** Dağıtım süreçleri

## 🎯 Katkı Alanları

### Öncelikli Alanlar
- **Performans İyileştirmeleri:** API response time
- **Kullanıcı Deneyimi:** Frontend UX/UI
- **Test Coverage:** Unit ve integration testleri
- **Dokümantasyon:** Eksik dokümantasyon
- **Güvenlik:** Güvenlik açıkları

### Yeni Başlayanlar İçin
- **Dokümantasyon:** README güncellemeleri
- **Test Yazma:** Unit test ekleme
- **Bug Fixes:** Basit hata düzeltmeleri
- **UI İyileştirmeleri:** Frontend styling

## 🏆 Katkıda Bulunanlar

Katkıda bulunanlar listesi `CONTRIBUTORS.md` dosyasında tutulur.

## 📞 İletişim

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** [E-posta adresi]

---

**Not:** Bu rehber sürekli güncellenir. En güncel versiyon için GitHub repository'sini kontrol edin.
