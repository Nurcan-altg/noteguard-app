"""
Email service for sending notifications
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from jinja2 import Template

from app.core.config import settings


class EmailService:
    """Email service for sending notifications"""
    
    def __init__(self):
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.FROM_EMAIL
        self.app_url = settings.APP_URL
    
    def _send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send email using SMTP"""
        try:
            # Check if SMTP credentials are configured
            if (self.smtp_username == "your-email@gmail.com" or 
                self.smtp_password == "your-app-password"):
                # Fallback to development mode
                print(f"=== EMAIL SENT (DEV MODE) ===")
                print(f"To: {to_email}")
                print(f"Subject: {subject}")
                print(f"From: {self.from_email}")
                print(f"Content: {html_content[:200]}...")
                print(f"==================")
                return True
            
            # Production email sending
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            print(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False
    
    def send_welcome_email(self, email: str, first_name: str, verification_token: str) -> bool:
        """Send welcome email with verification link"""
        subject = "NoteGuard'a Hoş Geldiniz! 🎉"
        
        verification_url = f"{self.app_url}/verify-email?token={verification_token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>NoteGuard'a Hoş Geldiniz</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 NoteGuard'a Hoş Geldiniz!</h1>
                    <p>AI destekli metin analizi platformuna katıldığınız için teşekkürler</p>
                </div>
                <div class="content">
                    <h2>Merhaba {first_name}!</h2>
                    <p>NoteGuard hesabınız başarıyla oluşturuldu. Yazılarınızı analiz etmeye başlamak için e-posta adresinizi doğrulamanız gerekiyor.</p>
                    
                    <div style="text-align: center;">
                        <a href="{verification_url}" class="button">E-posta Adresimi Doğrula</a>
                    </div>
                    
                    <p>Bu butona tıklayamıyorsanız, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
                    <p style="word-break: break-all; color: #667eea;">{verification_url}</p>
                    
                    <h3>NoteGuard ile neler yapabilirsiniz?</h3>
                    <ul>
                        <li>📝 Dilbilgisi hatalarını tespit edin</li>
                        <li>🔄 Tekrarları bulun ve düzeltin</li>
                        <li>🧠 Anlamsal tutarlılığı değerlendirin</li>
                        <li>💡 AI destekli öneriler alın</li>
                        <li>📊 Metin kalitesini puanlayın</li>
                    </ul>
                    
                    <p>E-posta doğrulama linki 24 saat geçerlidir.</p>
                </div>
                <div class="footer">
                    <p>Bu e-posta NoteGuard tarafından gönderilmiştir.</p>
                    <p>Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self._send_email(email, subject, html_content)
    
    def send_verification_email(self, email: str, first_name: str, verification_token: str) -> bool:
        """Send email verification link"""
        subject = "NoteGuard - E-posta Doğrulama"
        
        verification_url = f"{self.app_url}/verify-email?token={verification_token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>E-posta Doğrulama</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>E-posta Doğrulama</h2>
                </div>
                <div class="content">
                    <p>Merhaba {first_name},</p>
                    <p>NoteGuard hesabınızın e-posta adresini doğrulamak için aşağıdaki butona tıklayın:</p>
                    
                    <div style="text-align: center;">
                        <a href="{verification_url}" class="button">E-posta Adresimi Doğrula</a>
                    </div>
                    
                    <p>Bu link 24 saat geçerlidir.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self._send_email(email, subject, html_content)
    
    def send_password_reset_email(self, email: str, first_name: str, reset_token: str) -> bool:
        """Send password reset email"""
        subject = "NoteGuard - Şifre Sıfırlama"
        
        reset_url = f"{self.app_url}/reset-password?token={reset_token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Şifre Sıfırlama</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Şifre Sıfırlama</h2>
                </div>
                <div class="content">
                    <p>Merhaba {first_name},</p>
                    <p>NoteGuard hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın:</p>
                    
                    <div style="text-align: center;">
                        <a href="{reset_url}" class="button">Şifremi Sıfırla</a>
                    </div>
                    
                    <p>Bu link 1 saat geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self._send_email(email, subject, html_content)
