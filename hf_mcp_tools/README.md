# Hugging Face MCP Server

Bu proje, Hugging Face modellerini kullanarak çeşitli NLP ve görüntü işleme görevlerini gerçekleştiren bir Model Context Protocol (MCP) sunucusudur.

## Özellikler

### Mevcut Araçlar

1. **Text Generation** - Metin üretimi
2. **Sentiment Analysis** - Duygu analizi
3. **Translation** - Çeviri
4. **Summarization** - Özetleme
5. **Question Answering** - Soru cevaplama
6. **Text Classification** - Metin sınıflandırma
7. **Image Classification** - Görüntü sınıflandırma
8. **Zero-shot Classification** - Sıfır atışlı sınıflandırma
9. **Model Information** - Model bilgileri
10. **Popular Models List** - Popüler modeller listesi

## Kurulum

### 1. Gereksinimler

```bash
pip install -r requirements.txt
```

### 2. Hugging Face API Token (İsteğe bağlı)

Daha hızlı model indirme için Hugging Face API token'ı ayarlayabilirsiniz:

```bash
export HUGGINGFACE_API_TOKEN="your_token_here"
```

### 3. MCP Konfigürasyonu

Cursor'da MCP sunucusunu kullanmak için `mcp_config.json` dosyasını düzenleyin:

```json
{
  "mcpServers": {
    "huggingface": {
      "command": "python",
      "args": ["huggingface_mcp_server.py"],
      "env": {
        "HUGGINGFACE_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

## Kullanım

### Basit Sunucu

```bash
python huggingface_mcp_server.py
```

### Gelişmiş Sunucu

```bash
python huggingface_mcp_advanced.py
```

## Araç Detayları

### 1. Text Generation

Metin üretimi için kullanılır.

**Parametreler:**
- `model`: Model adı (örn: "gpt2", "microsoft/DialoGPT-medium")
- `prompt`: Giriş metni
- `max_length`: Maksimum uzunluk (varsayılan: 100)
- `temperature`: Sıcaklık (varsayılan: 0.7)
- `top_p`: Top-p sampling (varsayılan: 0.9)

### 2. Sentiment Analysis

Metin duygu analizi yapar.

**Parametreler:**
- `text`: Analiz edilecek metin
- `model`: Model adı (isteğe bağlı)

### 3. Translation

Metin çevirisi yapar.

**Parametreler:**
- `text`: Çevrilecek metin
- `source_lang`: Kaynak dil (varsayılan: "en")
- `target_lang`: Hedef dil (varsayılan: "es")

### 4. Summarization

Uzun metinleri özetler.

**Parametreler:**
- `text`: Özetlenecek metin
- `max_length`: Maksimum özet uzunluğu (varsayılan: 150)
- `min_length`: Minimum özet uzunluğu (varsayılan: 30)

### 5. Question Answering

Bağlama dayalı soru cevaplama.

**Parametreler:**
- `question`: Soru
- `context`: Bağlam metni

### 6. Text Classification

Metin sınıflandırma.

**Parametreler:**
- `text`: Sınıflandırılacak metin
- `model`: Model adı

### 7. Image Classification

Görüntü sınıflandırma.

**Parametreler:**
- `image_path`: Görüntü dosya yolu
- `model`: Model adı (varsayılan: "microsoft/resnet-50")

### 8. Zero-shot Classification

Sıfır atışlı sınıflandırma.

**Parametreler:**
- `text`: Sınıflandırılacak metin
- `candidate_labels`: Olası etiketler listesi

### 9. Model Information

Model hakkında detaylı bilgi alır.

**Parametreler:**
- `model`: Model adı

### 10. Popular Models List

Görev türüne göre popüler modelleri listeler.

**Parametreler:**
- `task`: Görev türü

## Örnek Kullanımlar

### Metin Üretimi
```json
{
  "method": "tools/call",
  "params": {
    "name": "text_generation",
    "arguments": {
      "model": "gpt2",
      "prompt": "Merhaba, bugün hava nasıl?",
      "max_length": 50,
      "temperature": 0.8
    }
  }
}
```

### Duygu Analizi
```json
{
  "method": "tools/call",
  "params": {
    "name": "sentiment_analysis",
    "arguments": {
      "text": "Bu film gerçekten harikaydı!"
    }
  }
}
```

### Çeviri
```json
{
  "method": "tools/call",
  "params": {
    "name": "translation",
    "arguments": {
      "text": "Hello, how are you?",
      "source_lang": "en",
      "target_lang": "tr"
    }
  }
}
```

## Popüler Modeller

### Text Generation
- `gpt2`
- `microsoft/DialoGPT-medium`
- `EleutherAI/gpt-neo-125M`

### Sentiment Analysis
- `cardiffnlp/twitter-roberta-base-sentiment-latest`
- `nlptown/bert-base-multilingual-uncased-sentiment`

### Translation
- `Helsinki-NLP/opus-mt-en-es`
- `Helsinki-NLP/opus-mt-en-de`
- `Helsinki-NLP/opus-mt-en-tr`

### Summarization
- `facebook/bart-large-cnn`
- `t5-base`

### Question Answering
- `deepset/roberta-base-squad2`

## Notlar

1. İlk model yüklemesi biraz zaman alabilir
2. Modeller önbelleğe alınır, sonraki kullanımlar daha hızlı olur
3. GPU kullanımı için CUDA kurulu olmalıdır
4. Büyük modeller için yeterli RAM gerekir

## Sorun Giderme

### Yaygın Hatalar

1. **Model bulunamadı**: Model adını kontrol edin
2. **Bellek hatası**: Daha küçük bir model kullanın
3. **İndirme hatası**: İnternet bağlantınızı kontrol edin

### Performans İpuçları

1. GPU kullanımı için `torch` CUDA versiyonunu kurun
2. Sık kullanılan modelleri önbelleğe alın
3. API token kullanarak daha hızlı indirme yapın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 