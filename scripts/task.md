\# NoteGuard Projesi Geliştirme Planı ve Görev Listesi

Bu doküman, NoteGuard projesinin MVP sürümünün geliştirilmesi için gereken tüm görevleri içerir. Görevler, mantıksal fazlara ve sprintlere bölünmüştür.

\---

\#\# Faz 0: Proje Kurulumu ve Planlama (Süre: \~2 Gün)

\*\*Amaç:\*\* Geliştirme ortamını hazırlamak, proje altyapısını kurmak ve ekip için standartları belirlemek.

\* \`\[ \]\` \*\*Görev 0.1:\*\* GitHub üzerinde \`noteguard-app\` adında bir public/private repo oluşturmak.  
\* \`\[ \]\` \*\*Görev 0.2:\*\* GitHub Projects veya Trello gibi bir proje yönetim panosu oluşturmak ve bu görev listesini oraya aktarmak.  
\* \`\[ \]\` \*\*Görev 0.3:\*\* Proje için bir dallanma (branching) stratejisi belirlemek (Örn: GitFlow \- \`main\`, \`develop\`, \`feature/\`, \`bugfix/\`).  
\* \`\[ \]\` \*\*Görev 0.4:\*\* Detaylı bir \`README.md\` dosyası oluşturmak (Proje açıklaması, teknoloji yığını, kurulum adımları).  
\* \`\[ \]\` \*\*Görev 0.5:\*\* Kök dizine \`backend\` ve \`frontend\` adında iki klasör oluşturmak.  
\* \`\[ \]\` \*\*Görev 0.6:\*\* Backend için \`.gitignore\` dosyası oluşturmak (Python, venv, IDE dosyaları için).  
\* \`\[ \]\` \*\*Görev 0.7:\*\* Frontend için \`.gitignore\` dosyası oluşturmak (Node.js, IDE dosyaları için).  
\* \`\[ \]\` \*\*Görev 0.8:\*\* Kod formatlama ve linting kurallarını belirlemek ve yapılandırmak:  
    \* \`\[ \]\` Backend: \`Black\` (formatlama), \`Flake8\` (linting).  
    \* \`\[ \]\` Frontend: \`Prettier\` (formatlama), \`ESLint\` (linting).

\---

\#\# Faz 1: Çekirdek Backend Geliştirmesi (Süre: \~2 Hafta)

\*\*Amaç:\*\* Tüm analiz mantığını içeren, test edilmiş ve güvenilir bir API servisi oluşturmak.

\#\#\# Sprint 1: API İskeleti ve İlk Analiz Modülü

\* \`\[ \]\` \*\*Görev 1.1.1:\*\* \`backend\` klasöründe FastAPI projesinin iskeletini oluşturmak.  
\* \`\[ \]\` \*\*Görev 1.1.2:\*\* Gerekli Python bağımlılıklarını (\`fastapi\`, \`uvicorn\`, \`pydantic\`, \`python-dotenv\`) \`requirements.txt\` dosyasına eklemek.  
\* \`\[ \]\` \*\*Görev 1.1.3:\*\* API isteği ve yanıtı için Pydantic modellerini tanımlamak (\`AnalyzeRequest\`, \`AnalyzeResponse\`).  
\* \`\[ \]\` \*\*Görev 1.1.4:\*\* \*\*Dilbilgisi Kontrol Modülü'nü\*\* (\`language-tool-python\` kullanarak) geliştirmek.  
\* \`\[ \]\` \*\*Görev 1.1.5:\*\* Dilbilgisi modülü için unit test'ler yazmak (\`pytest\`).  
\* \`\[ \]\` \*\*Görev 1.1.6:\*\* Sadece dilbilgisi analizi yapan ilk \`/analyze\` endpoint'ini oluşturmak.  
\* \`\[ \]\` \*\*Görev 1.1.7:\*\* Sistemin çalışıp çalışmadığını kontrol etmek için bir \`/health\` endpoint'i oluşturmak.

\#\#\# Sprint 2: İleri NLP Modülleri ve Dosya İşleme

\* \`\[ \]\` \*\*Görev 1.2.1:\*\* \*\*Tekrar Tespit Modülü'nü\*\* (n-gram tabanlı) geliştirmek ve unit test'lerini yazmak.  
\* \`\[ \]\` \*\*Görev 1.2.2:\*\* \*\*Anlamsal Bütünlük Modülü'nü\*\* (\`sentence-transformers\` kullanarak) geliştirmek.  
    \* \`\[ \]\` Alt-Görev: En uygun Türkçe Sentence-BERT modelini araştırmak ve seçmek.  
    \* \`\[ \]\` Alt-Görev: Referans metin ve ana metin cümlelerinin embedding'lerini üreten fonksiyonu yazmak.  
    \* \`\[ \]\` Alt-Görev: Cümleler arası cosine similarity hesaplayan fonksiyonu yazmak.  
\* \`\[ \]\` \*\*Görev 1.2.3:\*\* Anlamsal bütünlük modülü için unit test'ler yazmak.  
\* \`\[ \]\` \*\*Görev 1.2.4:\*\* Tüm analiz modüllerini \`/analyze\` endpoint'ine entegre etmek.  
\* \`\[ \]\` \*\*Görev 1.2.5:\*\* \`.txt\` ve \`.docx\` dosya yükleme (\`FastAPI.UploadFile\` ve \`python-docx\`) işlevselliğini eklemek.  
\* \`\[ \]\` \*\*Görev 1.2.6:\*\* Backend uygulaması için bir \`Dockerfile\` oluşturmak.

\---

\#\# Faz 2: Çekirdek Frontend Geliştirmesi (Süre: \~2 Hafta)

\*\*Amaç:\*\* Kullanıcının etkileşime gireceği arayüzü oluşturmak ve sahte verilerle (mock data) çalıştırmak.

\#\#\# Sprint 3: Arayüz İskeleti ve Giriş Komponentleri

\* \`\[ \]\` \*\*Görev 2.3.1:\*\* \`frontend\` klasöründe Vite kullanarak React \+ TypeScript projesi oluşturmak.  
\* \`\[ \]\` \*\*Görev 2.3.2:\*\* Proje klasör yapısını oluşturmak (\`components\`, \`pages\`, \`services\`, \`hooks\`, \`styles\`).  
\* \`\[ \]\` \*\*Görev 2.3.3:\*\* Temel stil/tema yapılandırmasını yapmak (örn: Tailwind CSS kurulumu).  
\* \`\[ \]\` \*\*Görev 2.3.4:\*\* Ana \`Layout\` komponentini (Header, Footer, Content Alanı) oluşturmak.  
\* \`\[ \]\` \*\*Görev 2.3.5:\*\* \`TextInputArea\` komponentini oluşturmak.  
\* \`\[ \]\` \*\*Görev 2.3.6:\*\* \`ReferenceTopicInput\` komponentini oluşturmak.  
\* \`\[ \]\` \*\*Görev 2.3.7:\*\* \`FileUploadButton\` komponentini oluşturmak.  
\* \`\[ \]\` \*\*Görev 2.3.8:\*\* Tüm giriş komponentlerini ana sayfada (\`HomePage.tsx\`) birleştirmek.

\#\#\# Sprint 4: Sonuç Ekranı ve Mock Servis Entegrasyonu

\* \`\[ \]\` \*\*Görev 2.4.1:\*\* \`ScoreCard\` (Puan Kartı) komponentini tasarlamak.  
\* \`\[ \]\` \*\*Görev 2.4.2:\*\* \`HighlightedTextViewer\` (Vurgulu Metin Görüntüleyici) komponentini tasarlamak.  
\* \`\[ \]\` \*\*Görev 2.4.3:\*\* \`ResultsDashboard\` (Sonuç Paneli) komponentini oluşturarak \`ScoreCard\` ve \`HighlightedTextViewer\`'ı birleştirmek.  
\* \`\[ \]\` \*\*Görev 2.4.4:\*\* Backend'in üreteceği JSON yanıtını taklit eden bir mock veri (\`mockData.json\`) oluşturmak.  
\* \`\[ \]\` \*\*Görev 2.4.5:\*\* Bu mock veriyi kullanarak \`ResultsDashboard\`'un statik olarak doğru görüntülenmesini sağlamak.

\---

\#\# Faz 3: Entegrasyon ve Uçtan Uca İşlevsellik (Süre: \~1 Hafta)

\*\*Amaç:\*\* Frontend ve Backend'i birbirine bağlayarak uygulamanın tam olarak çalışır hale gelmesini sağlamak.

\#\#\# Sprint 5: API Bağlantısı ve Dinamik Arayüz

\* \`\[ \]\` \*\*Görev 3.5.1:\*\* Frontend'de \`Axios\` veya \`fetch\` kullanarak bir API servis katmanı (\`apiService.ts\`) oluşturmak.  
\* \`\[ \]\` \*\*Görev 3.5.2:\*\* "Analiz Et" butonunun tıklanma olayını backend'deki \`/analyze\` endpoint'ine bağlamak.  
\* \`\[ \]\` \*\*Görev 3.5.3:\*\* API istekleri sırasında yüklenme (loading), başarı (success) ve hata (error) durumlarını arayüzde yönetmek (örn: spinner göstermek, hata mesajı basmak).  
\* \`\[ \]\` \*\*Görev 3.5.4:\*\* \`HighlightedTextViewer\` komponentini, backend'den gelen dinamik veriye göre metni renklendirecek ve üzerine gelince ipucu gösterecek şekilde geliştirmek.  
\* \`\[ \]\` \*\*Görev 3.5.5:\*\* \`ScoreCard\` komponentini dinamik skor verileriyle güncellemek.  
\* \`\[ \]\` \*\*Görev 3.5.6:\*\* Kullanıcı akışının başından sonuna kadar (metin gir \-\> analiz et \-\> sonuç gör \-\> metni düzelt \-\> tekrar analiz et) çalıştığını test etmek.

\---

\#\# Faz 4: Test, İyileştirme ve Dağıtım (Süre: \~1 Hafta)

\*\*Amaç:\*\* Uygulamayı sağlamlaştırmak, hataları gidermek ve canlı ortama taşımak.

\#\#\# Sprint 6: Sağlamlaştırma ve Lansman

\* \`\[ \]\` \*\*Görev 4.6.1:\*\* Temel kullanıcı senaryoları için E2E (Uçtan Uca) testler yazmak (Cypress veya Playwright ile).  
\* \`\[ \]\` \*\*Görev 4.6.2:\*\* Farklı tarayıcılarda (Chrome, Firefox, Safari) uyumluluk testi yapmak.  
\* \`\[ \]\` \*\*Görev 4.6.3:\*\* Uzun metinlerle performans testi yaparak API yanıt süresini ölçmek.  
\* \`\[ \]\` \*\*Görev 4.6.4:\*\* Son kullanıcı geri bildirimlerine göre arayüzde küçük iyileştirmeler ve cila (polish) yapmak.  
\* \`\[ \]\` \*\*Görev 4.6.5:\*\* GitHub Actions kullanarak bir CI/CD pipeline'ı kurmak (Test et \-\> Build al \-\> Docker imajı oluştur).  
\* \`\[ \]\` \*\*Görev 4.6.6:\*\* Bir bulut platformu (Google Cloud Run, Heroku vb.) üzerinde staging (test) ortamı kurmak.  
\* \`\[ \]\` \*\*Görev 4.6.7:\*\* Uygulamayı staging ortamına dağıtmak ve son kullanıcı kabul testlerini (UAT) yapmak.  
\* \`\[ \]\` \*\*Görev 4.6.8:\*\* Staging testleri başarılıysa, production (canlı) ortamına ilk dağıtımı yapmak.

\---

\#\# Faz 5: Lansman Sonrası (Sürekli)

\*\*Amaç:\*\* Uygulamanın sağlığını izlemek, kullanıcı geri bildirimlerini toplamak ve geleceği planlamak.

\* \`\[ \]\` \*\*Görev 5.1:\*\* Hata takibi için Sentry gibi bir aracı entegre etmek.  
\* \`\[ \]\` \*\*Görev 5.2:\*\* Kullanım metriklerini izlemek için basit bir analiz aracı (Plausible, Umami vb.) kurmak.  
\* \`\[ \]\` \*\*Görev 5.3:\*\* Kullanıcılardan geri bildirim toplamak için bir kanal oluşturmak (iletişim formu, e-posta vb.).  
\* \`\[ \]\` \*\*Görev 5.4:\*\* Gelen hataları ve kullanıcı isteklerini önceliklendirerek \`v1.1\` için bir backlog oluşturmak.  
