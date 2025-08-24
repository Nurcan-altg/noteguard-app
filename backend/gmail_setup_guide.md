# Gmail SMTP Ayarları Rehberi

## 1. Gmail'de 2-Factor Authentication'ı Aktifleştirin

1. Gmail hesabınıza giriş yapın
2. Google Hesabı ayarlarına gidin: https://myaccount.google.com/
3. "Güvenlik" sekmesine tıklayın
4. "2 Adımlı Doğrulama"yı aktifleştirin

## 2. App Password Oluşturun

1. Google Hesabı ayarlarında "Güvenlik" sekmesinde
2. "2 Adımlı Doğrulama" altında "Uygulama Şifreleri"ni bulun
3. "Uygulama Seç" > "Diğer (Özel ad)" seçin
4. İsim olarak "NoteGuard" yazın
5. "Oluştur" butonuna tıklayın
6. 16 karakterlik şifreyi kopyalayın (örn: abcd efgh ijkl mnop)

## 3. .env Dosyasını Güncelleyin

Backend klasöründe `.env` dosyası oluşturun:

```env
# Database Configuration
DATABASE_URL=sqlite+aiosqlite:///./noteguard.db

# Gmail SMTP Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-gmail@gmail.com
SMTP_PASSWORD=your-16-character-app-password
FROM_EMAIL=your-gmail@gmail.com
APP_URL=http://localhost:5173

# Authentication
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 4. Önemli Notlar

- SMTP_USERNAME: Gmail adresiniz
- SMTP_PASSWORD: App Password (normal şifreniz değil!)
- FROM_EMAIL: Gmail adresiniz (SMTP_USERNAME ile aynı olmalı)
- APP_URL: Frontend URL'iniz

## 5. Test Etmek İçin

1. Backend'i yeniden başlatın
2. Yeni kullanıcı kaydı yapın
3. Console'da e-posta detaylarını kontrol edin
4. Gerçek e-posta gönderimi için email_service.py'deki mock kodu kaldırın

## 6. Production İçin

Gerçek e-posta gönderimi için `backend/app/services/email_service.py` dosyasında:

```python
# Bu satırları kaldırın:
print(f"=== EMAIL SENT ===")
print(f"To: {to_email}")
# ... diğer print satırları

# Bu satırların yorumunu kaldırın:
msg = MIMEMultipart('alternative')
msg['Subject'] = subject
# ... diğer SMTP kodu
```
