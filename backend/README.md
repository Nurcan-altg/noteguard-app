# Backend - Database Setup (Faz 3B)

## Gereksinimler
- Docker / Docker Compose
- Python 3.10+

## Başlatma

1) Postgres'i başlatın:
```bash
cd backend
docker compose up -d db
```

2) Ortam değişkenlerini ayarlayın (bkz. `.env.example`):
- `DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/noteguard`

3) Python bağımlılıklarını kurun:
```bash
pip install -r requirements.txt
```

4) Backend'i başlatın:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8009
```

> İlk kurulumda migrasyonlar henüz eklenmediği için sadece bağlantı testi yapılır. Bir sonraki sprintte (DB2) Alembic migrasyonları eklenecektir.

## Bağlantı Testi
- Server başlarken veritabanı bağlantısı hafif bir işlemle test edilir. Loglarda hata görünmüyorsa bağlantı sağlanmıştır.


