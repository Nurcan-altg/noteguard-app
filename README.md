# NoteGuard - Metin Analiz ve İyileştirme Platformu

NoteGuard, kullanıcıların yazdıkları metinleri analiz ederek dilbilgisi hatalarını tespit eden, tekrarları bulup çıkaran ve anlamsal bütünlüğü değerlendiren modern bir web uygulamasıdır.

## 🚀 Hızlı Başlangıç (Yeni Başlayanlar İçin)

Bu bölüm, projeyi hiç bilmeyen kullanıcılar için hazırlanmıştır. Adım adım kurulum talimatlarını takip edin.

### 📋 Ön Gereksinimler

Projeyi çalıştırmak için bilgisayarınızda şu programların yüklü olması gerekiyor:

#### 1. Python Kurulumu
- **Windows:** [Python İndirme Sayfası](https://www.python.org/downloads/) adresinden Python 3.9 veya üstünü indirin
- **Kurulum sırasında:** "Add Python to PATH" seçeneğini işaretleyin
- **Kontrol:** Komut satırında `python --version` yazarak kurulumu doğrulayın

#### 2. Node.js Kurulumu
- **Windows:** [Node.js İndirme Sayfası](https://nodejs.org/) adresinden LTS versiyonunu indirin
- **Kontrol:** Komut satırında `node --version` yazarak kurulumu doğrulayın

#### 3. Git Kurulumu
- **Windows:** [Git İndirme Sayfası](https://git-scm.com/download/win) adresinden indirin
- **Kontrol:** Komut satırında `git --version` yazarak kurulumu doğrulayın

### 🔧 Proje Kurulumu

#### Adım 1: Projeyi İndirin
```bash
# Projeyi bilgisayarınıza indirin
git clone https://github.com/KULLANICI_ADINIZ/noteguard-app.git
cd noteguard-app
```

#### Adım 2: Backend Kurulumu
```bash
# Backend klasörüne geçin
cd backend

# Sanal ortam oluşturun (Windows)
python -m venv venv
venv\Scripts\activate

# Sanal ortam oluşturun (Mac/Linux)
python -m venv venv
source venv/bin/activate

# Gerekli programları yükleyin
pip install -r requirements.txt
```

#### Adım 3: Frontend Kurulumu
```bash
# Ana klasöre geri dönün
cd ..

# Frontend klasörüne geçin
cd frontend

# Gerekli programları yükleyin
npm install
```

#### Adım 4: Uygulamayı Çalıştırın

**Terminal 1 - Backend:**
```bash
# Backend klasöründe olduğunuzdan emin olun
cd backend

# Sanal ortamı aktifleştirin (Windows)
venv\Scripts\activate

# Sanal ortamı aktifleştirin (Mac/Linux)
source venv/bin/activate

# Backend sunucusunu başlatın
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
# Frontend klasöründe olduğunuzdan emin olun
cd frontend

# Frontend sunucusunu başlatın
npm run dev
```

#### Adım 5: Uygulamayı Kullanın
- **Frontend:** Tarayıcınızda `http://localhost:5173` adresine gidin
- **Backend API:** `http://localhost:8000` adresinde çalışır
- **API Dokümantasyonu:** `http://localhost:8000/docs` adresinde bulunur

### 🎯 İlk Kullanım

1. **Metin Analizi:** Ana sayfada metin alanına yazınızı yazın
2. **Dosya Yükleme:** .txt veya .docx dosyası yükleyebilirsiniz
3. **Analiz:** "Analiz Et" butonuna tıklayın
4. **Sonuçlar:** Dilbilgisi, tekrar ve anlamsal analiz sonuçlarını görün

### ❓ Sık Karşılaşılan Sorunlar

#### "python komutu bulunamadı" Hatası
- Python'u PATH'e eklemeyi unutmuş olabilirsiniz
- Kurulumu tekrar yapın ve "Add Python to PATH" seçeneğini işaretleyin

#### "npm komutu bulunamadı" Hatası
- Node.js kurulumunu kontrol edin
- Bilgisayarınızı yeniden başlatın

#### "Port 8000 kullanımda" Hatası
- Başka bir uygulama bu portu kullanıyor olabilir
- Farklı bir port kullanın: `--port 8001`

#### "ModuleNotFoundError" Hatası
- Sanal ortamın aktif olduğundan emin olun
- `pip install -r requirements.txt` komutunu tekrar çalıştırın

### 🆘 Yardım

Eğer sorun yaşıyorsanız:
1. **Hata mesajını** kopyalayın
2. **İşletim sisteminizi** belirtin (Windows/Mac/Linux)
3. **Python ve Node.js versiyonlarınızı** kontrol edin
4. **GitHub Issues** bölümünde sorununuzu bildirin

---

## 🎯 Proje Amacı

NoteGuard, özellikle öğrenciler, yazarlar ve içerik üreticileri için tasarlanmış bir metin analiz platformudur. Uygulama, kullanıcıların yazılarını yükleyerek veya doğrudan giriş yaparak:

### ✨ Ana Özellikler

- **📝 Dilbilgisi Kontrolü**: Yazım ve dilbilgisi hatalarını tespit eder
- **🔄 Tekrar Tespiti**: Metindeki gereksiz tekrarları bulur
- **🧠 Anlamsal Bütünlük**: Cümleler arası anlamsal tutarlılığı değerlendirir
- **📊 Puanlama**: Metnin genel kalitesini puanlar
- **💡 Öneriler**: İyileştirme önerileri sunar

### 🎯 Hedef Kullanıcılar

- **Öğrenciler**: Ödev ve makalelerini kontrol etmek için
- **Yazarlar**: Yazılarının kalitesini artırmak için
- **İçerik Üreticileri**: Blog yazıları ve makaleler için
- **Editörler**: Metin düzenleme süreçlerinde
- **Dil Öğrenenler**: Yazım becerilerini geliştirmek için

### 📈 Faydalar

- **Zaman Tasarrufu**: Manuel kontrol yerine otomatik analiz
- **Kalite Artışı**: Detaylı geri bildirim ve öneriler
- **Öğrenme**: Hata türleri ve düzeltme yöntemleri hakkında bilgi
- **Tutarlılık**: Standart bir analiz süreci

## 🚀 Teknoloji Yığını

### Backend
- **FastAPI**: Modern, hızlı web framework
- **Python 3.9+**: Ana programlama dili
- **Pydantic**: Veri doğrulama ve serialization
- **language-tool-python**: Dilbilgisi kontrolü
- **sentence-transformers**: Anlamsal analiz
- **python-docx**: Word dosyası işleme
- **Uvicorn**: ASGI sunucu

### Frontend
- **React 18**: Kullanıcı arayüzü kütüphanesi
- **TypeScript**: Tip güvenliği
- **Vite**: Hızlı build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client

### DevOps & Araçlar
- **Docker**: Containerization
- **GitHub Actions**: CI/CD
- **Pytest**: Test framework
- **Black & Flake8**: Kod formatlama ve linting
- **ESLint & Prettier**: Frontend kod kalitesi

## 📁 Proje Yapısı

```
noteguard-app/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Konfigürasyon
│   │   ├── models/         # Pydantic modelleri
│   │   ├── services/       # İş mantığı
│   │   └── utils/          # Yardımcı fonksiyonlar
│   ├── tests/              # Test dosyaları
│   ├── requirements.txt    # Python bağımlılıkları
│   └── Dockerfile         # Backend container
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React komponentleri
│   │   ├── pages/         # Sayfa komponentleri
│   │   ├── services/      # API servisleri
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # CSS dosyaları
│   ├── public/            # Statik dosyalar
│   └── package.json       # Node.js bağımlılıkları
├── docs/                  # Dokümantasyon
└── README.md             # Bu dosya
```

## 🛠️ Detaylı Kurulum (Geliştiriciler İçin)

### Gereksinimler
- Python 3.9+
- Node.js 16+
- Git

### Backend Kurulumu

1. **Backend klasörüne geçin:**
```bash
cd backend
```

2. **Sanal ortam oluşturun:**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate     # Windows
```

3. **Bağımlılıkları yükleyin:**
```bash
pip install -r requirements.txt
```

4. **Uygulamayı çalıştırın:**
```bash
uvicorn app.main:app --reload
```

Backend http://localhost:8000 adresinde çalışacaktır.

### Frontend Kurulumu

1. **Frontend klasörüne geçin:**
```bash
cd frontend
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

Frontend http://localhost:5173 adresinde çalışacaktır.

### 🐳 Docker ile Kurulum (İsteğe Bağlı)

Eğer Docker kullanmak istiyorsanız:

```bash
# Tüm uygulamayı Docker ile çalıştırın
docker-compose up --build
```

**Not:** Docker kurulumu için [Docker Desktop](https://www.docker.com/products/docker-desktop/) indirmeniz gerekir.



## 🧪 Test

### Backend Testleri
```bash
cd backend
pytest
```

### Frontend Testleri
```bash
cd frontend
npm test
```

## 📊 API Dokümantasyonu

Backend çalıştıktan sonra API dokümantasyonuna şu adreslerden erişebilirsiniz:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Geliştirme

### Kod Formatlama

**Backend:**
```bash
cd backend
black .
flake8 .
```

**Frontend:**
```bash
cd frontend
npm run format
npm run lint
```

### Git Workflow

1. `main` branch'inden yeni feature branch oluşturun
2. Değişikliklerinizi commit edin
3. Pull request oluşturun
4. Code review sonrası merge edin

## 🚀 Dağıtım

### Staging Ortamı
```bash
docker-compose -f docker-compose.staging.yml up
```

### Production Ortamı
```bash
docker-compose -f docker-compose.prod.yml up
```

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi**: [İsim]
- **E-posta**: [E-posta]
- **GitHub**: [GitHub Profili]

## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak projelerin kullanımıyla mümkün olmuştur:
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [LanguageTool](https://languagetool.org/)

## 🚀 Hızlı Başlangıç Özeti

Eğer sadece projeyi hızlıca denemek istiyorsanız:

```bash
# 1. Projeyi indirin
git clone https://github.com/KULLANICI_ADINIZ/noteguard-app.git
cd noteguard-app

# 2. Backend'i başlatın
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# 3. Yeni terminal açın ve frontend'i başlatın
cd frontend
npm install
npm run dev

# 4. Tarayıcıda açın
# http://localhost:5173
```

## 📞 Destek

- **Sorun Bildirimi**: [GitHub Issues](https://github.com/KULLANICI_ADINIZ/noteguard-app/issues)
- **Özellik Önerisi**: [GitHub Discussions](https://github.com/KULLANICI_ADINIZ/noteguard-app/discussions)
- **Dokümantasyon**: [Wiki](https://github.com/KULLANICI_ADINIZ/noteguard-app/wiki)

---

**NoteGuard** - Yazılarınızı daha iyi hale getirin! ✨ 