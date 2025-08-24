# NoteGuard - AI-Powered Metin Analiz ve İyileştirme Platformu

NoteGuard, kullanıcıların yazdıkları metinleri yapay zeka destekli analiz ederek dilbilgisi hatalarını tespit eden, tekrarları bulup çıkaran, anlamsal bütünlüğü değerlendiren ve gelişmiş öneriler sunan modern bir web uygulamasıdır.

## 🎯 Temel Özellikler

### 🧠 **Yapay Zeka Destekli Analiz**
- **Türkçe Karakter Hata Tespiti**: Türkçe karakterlerin yanlış yazımını tespit eder
- **False Positive Önleme**: Doğru kelimeleri yanlış olarak işaretlemez
- **Context-Aware Analiz**: Bağlam duyarlı hata tespiti
- **LLM Entegrasyonu**: Hugging Face Transformers ile gelişmiş analiz

### 👤 **Kullanıcı Yönetimi**
- **Güvenli Kayıt/Giriş**: JWT tabanlı kimlik doğrulama
- **E-posta Doğrulama**: Token bazlı e-posta doğrulama sistemi
- **Şifre Sıfırlama**: Güvenli şifre sıfırlama işlevi
- **Profil Yönetimi**: Kullanıcı profil güncelleme

### 📊 **Veritabanı ve Geçmiş**
- **Analiz Geçmişi**: Tüm analizlerinizi kaydedin ve görüntüleyin
- **SQLite + SQLAlchemy**: Modern async veritabanı desteği
- **Repository Pattern**: Temiz kod mimarisi
- **İstatistik Takibi**: Analiz sayısı ve başarı oranları

### 🎨 **Modern UI/UX**
- **World-Class Design**: Dünya standartlarında landing page
- **Design System**: Tutarlı tasarım sistemi (design.json)
- **Responsive**: Mobil-first yaklaşım
- **Türkçe Arayüz**: Tamamen Türkçe kullanıcı deneyimi

## 🚀 Hızlı Başlangıç

### 📋 Ön Gereksinimler

- **Python 3.9+** - [İndirmek için](https://www.python.org/downloads/)
- **Node.js 18+** - [İndirmek için](https://nodejs.org/)
- **Git** - [İndirmek için](https://git-scm.com/)

### 🔧 Kurulum

#### 1. Projeyi Klonlayın
```bash
git clone https://github.com/Nurcan-altg/noteguard-app.git
cd noteguard-app
```

#### 2. Backend Kurulumu
```bash
cd backend

# Sanal ortam oluşturun
python -m venv venv

# Aktif edin (Windows)
venv\Scripts\activate

# Aktif edin (macOS/Linux)
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt
```

#### 3. Frontend Kurulumu
```bash
cd ../frontend

# Bağımlılıkları yükleyin
npm install
```

#### 4. Uygulamayı Çalıştırın

**Terminal 1 - Backend:**
```bash
cd backend
# Sanal ortamı aktif edin
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Sunucuyu başlatın
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 5. Uygulamayı Açın
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📱 Sayfa Yapısı

### 🌟 **Frontend Sayfaları**
- **LandingPage**: World-class landing page (features, testimonials, pricing)
- **HomePage**: Ana analiz sayfası (metin girişi, sonuçlar)
- **DashboardPage**: Kullanıcı dashboard'u (istatistikler, hızlı eylemler)
- **LoginPage/RegisterPage**: Güvenli giriş/kayıt sayfaları
- **ProfilePage**: Profil yönetimi ve hesap ayarları
- **HistoryPage**: Analiz geçmişi ve detayları
- **DemoPage**: Demo analiz sayfası (kayıt olmadan)
- **HelpPage**: Yardım ve SSS sayfası
- **EmailVerificationPage**: E-posta doğrulama sayfası

## 🔗 API Endpoint'leri

### 🔐 **Authentication**
```
POST /api/v1/auth/register          # Kullanıcı kaydı
POST /api/v1/auth/login             # Giriş yapma
POST /api/v1/auth/logout            # Çıkış yapma
GET  /api/v1/auth/me                # Kullanıcı bilgileri
PUT  /api/v1/auth/profile           # Profil güncelleme
POST /api/v1/auth/verify-email      # E-posta doğrulama
POST /api/v1/auth/forgot-password   # Şifre sıfırlama isteği
POST /api/v1/auth/reset-password    # Şifre sıfırlama
```

### 📝 **Text Analysis**
```
POST /api/v1/analyze                # Kimlik doğrulamalı analiz
POST /api/v1/analyze/demo           # Demo analiz (kayıt olmadan)
```

### 📊 **Analysis History**
```
GET  /api/v1/analyses               # Analiz geçmişi listesi
GET  /api/v1/analyses/{id}          # Belirli analiz detayı
DELETE /api/v1/analyses/{id}        # Analiz silme
```

### 🏥 **Health Check**
```
GET  /health                        # Sistem durumu
```

## 🛠️ Teknoloji Yığını

### 🔙 **Backend**
- **FastAPI 0.104.1**: Modern, hızlı web framework
- **Python 3.9+**: Ana programlama dili
- **SQLAlchemy 2.0**: Async ORM
- **SQLite**: Veritabanı (development)
- **JWT**: Kimlik doğrulama
- **Pydantic v2**: Veri doğrulama
- **Bcrypt**: Şifre hashleme
- **SMTP**: E-posta gönderimi

#### 📚 **Analysis Services**
- **GrammarService**: Türkçe dilbilgisi kontrolü
- **RepetitionService**: N-gram tabanlı tekrar tespiti  
- **SemanticService**: Sentence-transformers ile anlamsal analiz
- **LLMService**: Hugging Face Transformers entegrasyonu
- **AuthService**: JWT ve kullanıcı yönetimi
- **EmailService**: E-posta doğrulama ve bildirimler

### 🎨 **Frontend**
- **React 18**: Modern UI kütüphanesi
- **TypeScript**: Tip güvenliği
- **Vite**: Hızlı build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router v6**: Sayfa yönlendirme
- **Axios**: HTTP client
- **Lucide React**: Modern iconlar
- **Design System**: Merkezi tasarım sistemi

## 📁 Proje Yapısı

```
noteguard-app/
├── backend/                           # FastAPI Backend
│   ├── app/
│   │   ├── api/                      # API Endpoints
│   │   │   ├── auth.py              # Authentication endpoints
│   │   │   └── routes.py            # Analysis endpoints
│   │   ├── core/                    # Konfigürasyon
│   │   │   └── config.py            # Uygulama ayarları
│   │   ├── db/                      # Veritabanı
│   │   │   ├── models.py            # SQLAlchemy modelleri
│   │   │   ├── repository.py        # Repository pattern
│   │   │   └── session.py           # DB session yönetimi
│   │   ├── middleware/              # Middleware'ler
│   │   │   └── logging.py           # Request logging
│   │   ├── models/                  # Pydantic modelleri
│   │   │   ├── requests.py          # Request schemas
│   │   │   └── responses.py         # Response schemas
│   │   ├── services/                # İş Mantığı
│   │   │   ├── analysis_service.py  # Ana analiz servisi
│   │   │   ├── auth_service.py      # Kimlik doğrulama
│   │   │   ├── email_service.py     # E-posta servisi
│   │   │   ├── grammar_service.py   # Dilbilgisi analizi
│   │   │   ├── grammar_analyzer.py  # Dilbilgisi çözümleyici
│   │   │   ├── grammar_rules.py     # Dilbilgisi kuralları
│   │   │   ├── grammar_scorer.py    # Dilbilgisi puanlama
│   │   │   ├── repetition_service.py # Tekrar tespiti
│   │   │   ├── semantic_service.py  # Anlamsal analiz
│   │   │   └── llm_service.py       # LLM entegrasyonu
│   │   └── utils/                   # Yardımcı fonksiyonlar
│   │       └── file_utils.py        # Dosya işlemleri
│   ├── requirements.txt             # Python dependencies
│   └── Dockerfile                   # Container yapılandırması
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # React Komponentleri
│   │   │   ├── Input/               # Giriş komponentleri
│   │   │   │   ├── TextInputArea.tsx
│   │   │   │   ├── ReferenceTopicInput.tsx
│   │   │   │   └── FileUploadButton.tsx
│   │   │   ├── Layout/              # Layout komponentleri
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── Results/             # Sonuç komponentleri
│   │   │   │   ├── ResultsDashboard.tsx
│   │   │   │   ├── ScoreCard.tsx
│   │   │   │   └── HighlightedTextViewer.tsx
│   │   │   └── UI/                  # UI komponentleri
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── ErrorMessage.tsx
│   │   ├── contexts/                # React Contexts
│   │   │   └── AuthContext.tsx      # Authentication context
│   │   ├── pages/                   # Sayfa komponentleri
│   │   │   ├── LandingPage.tsx      # Ana sayfa (world-class)
│   │   │   ├── HomePage.tsx         # Analiz sayfası
│   │   │   ├── DashboardPage.tsx    # Dashboard
│   │   │   ├── LoginPage.tsx        # Giriş sayfası
│   │   │   ├── RegisterPage.tsx     # Kayıt sayfası
│   │   │   ├── ProfilePage.tsx      # Profil sayfası
│   │   │   ├── HistoryPage.tsx      # Analiz geçmişi
│   │   │   ├── DemoPage.tsx         # Demo sayfası
│   │   │   ├── HelpPage.tsx         # Yardım sayfası
│   │   │   └── EmailVerificationPage.tsx
│   │   ├── services/                # API Servisleri
│   │   │   └── apiService.ts        # HTTP client
│   │   ├── utils/                   # Yardımcı fonksiyonlar
│   │   │   └── designSystem.ts      # Design system
│   │   └── styles/                  # CSS dosyaları
│   │       └── index.css            # Global styles
│   ├── design.json                  # Design system config
│   ├── package.json                 # Node.js dependencies
│   └── tailwind.config.js           # Tailwind configuration
├── hf_mcp_tools/                    # Hugging Face MCP Tools
├── noteguard-tasks.md               # Proje görev listesi
└── README.md                        # Bu dosya
```

## 🔧 Geliştirme

### 📝 **Kod Kalitesi**
```bash
# Backend linting
cd backend
black .
flake8 .

# Frontend linting
cd frontend
npm run lint
npm run format
```

### 🧪 **Test**
```bash
# Backend tests
cd backend
pytest

# Frontend tests (gelecekte eklenecek)
cd frontend
npm test
```

### 🐳 **Docker**
```bash
# Tüm uygulamayı Docker ile çalıştırın
docker-compose up --build
```

## 📊 Özellik Detayları

### 🔍 **Analiz Özellikleri**
- **Dilbilgisi Kontrolü**: 35+ Türkçe dilbilgisi kuralı
- **Türkçe Karakter Tespiti**: çğıöşü karakterleri için özel algoritmalar
- **False Positive Önleme**: 100+ yaygın Türkçe kelime koruması
- **Tekrar Analizi**: N-gram tabanlı akıllı tekrar tespiti
- **Anlamsal Tutarlılık**: Sentence-transformers ile cümle analizi
- **AI Önerileri**: Context-aware iyileştirme önerileri

### 👥 **Kullanıcı Sistemi**
- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **E-posta Doğrulama**: Otomatik e-posta doğrulama sistemi
- **Şifre Güvenliği**: Bcrypt ile hash'lenmiş şifreler
- **Profil Yönetimi**: Ad, soyad, e-posta güncelleme
- **Analiz İstatistikleri**: Kullanıcı başına analiz takibi

### 🎨 **UI/UX Özellikleri**
- **Design System**: Merkezi tasarım sistemi (design.json)
- **World-Class Landing**: Modern landing page (hero, features, testimonials, pricing, FAQ)
- **Responsive Design**: Mobile-first yaklaşım
- **Loading States**: Gelişmiş yükleme animasyonları
- **Error Handling**: Kullanıcı dostu hata mesajları
- **Auto-scroll**: Sonuçlara otomatik kaydırma

## 🛡️ Güvenlik

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt
- **Email Verification**: Token-based email verification
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Pydantic model validation
- **SQL Injection Prevention**: SQLAlchemy ORM protection

## 🚀 Deployment

### 🌐 **Production Environment**
```bash
# Environment variables
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
SMTP_SERVER=smtp.gmail.com
```

### 📈 **Performance**
- **Async Operations**: Tüm I/O operasyonları async
- **Database Pooling**: Connection pooling
- **Lazy Loading**: ML model'lerin gecikmeli yüklenmesi
- **Code Splitting**: React lazy loading
- **Caching**: Static asset caching

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👥 İletişim

- **Proje Sahibi**: Nurcan Altug
- **E-posta**: altugnurcan01@gmail.com
- **GitHub**: [@Nurcan-altg](https://github.com/Nurcan-altg)

## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak teknolojileri kullanmaktadır:

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://reactjs.org/) - UI kütüphanesi
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python ORM
- [Hugging Face](https://huggingface.co/) - AI/ML models
- [Sentence Transformers](https://www.sbert.net/) - Semantic analysis

## 🎯 Gelecek Planları

- [ ] PostgreSQL migration
- [ ] Redis caching
- [ ] Real-time collaboration
- [ ] Mobile app development
- [ ] Advanced AI features
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced analytics

---

**NoteGuard** - Yapay zeka destekli Türkçe metin analizi ile yazılarınızı mükemmelleştirin! 🇹🇷✨