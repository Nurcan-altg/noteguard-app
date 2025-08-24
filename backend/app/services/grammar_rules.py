"""
Grammar rules for different languages
"""

import re
from typing import Dict, List, Any, Callable


class GrammarRules:
    """Grammar rules for different languages"""
    
    def __init__(self):
        self.rules = {
            'tr': self._get_turkish_rules(),
            'en': self._get_english_rules()
        }
    
    def get_rules(self, language: str) -> List[Dict[str, Any]]:
        """Get grammar rules for specific language"""
        return self.rules.get(language, self.rules['en'])
    
    def _get_turkish_rules(self) -> List[Dict[str, Any]]:
        """Get Turkish grammar rules - simplified to prevent false positives"""
        return [
            # Spacing rules - More precise
            {
                'pattern': r'\s{3,}',
                'message': 'Birden fazla boşluk kullanılmamalı',
                'rule_id': 'MULTIPLE_SPACES'
            },
            {
                'pattern': r'\s+[.!?]',
                'message': 'Noktalama işaretlerinden önce boşluk olmamalı',
                'rule_id': 'PUNCTUATION_SPACING'
            },
            {
                'pattern': r'[.!?][a-zA-Z]',
                'message': 'Noktalama işaretinden sonra boşluk olmalı',
                'rule_id': 'PUNCTUATION_SPACING'
            },
            
            # Turkish specific rules - Only obvious cases
            {
                'pattern': r'\b(ben|sen|o|biz|siz|onlar|bu|şu)\s+de\b',
                'message': '"de" bağlacı ayrı yazılmalı',
                'rule_id': 'TURKISH_DE_DA',
                'suggestion': 'de'
            },
            {
                'pattern': r'\b(ben|sen|o|biz|siz|onlar|bu|şu)\s+da\b',
                'message': '"da" bağlacı ayrı yazılmalı',
                'rule_id': 'TURKISH_DE_DA',
                'suggestion': 'da'
            },
            {
                'pattern': r'\b(öyle|demek)\s+ki\b',
                'message': '"ki" bağlacı ayrı yazılmalı',
                'rule_id': 'TURKISH_KI',
                'suggestion': 'ki'
            },
            
            # Only the most obvious spelling mistakes
            {
                'pattern': r'\b(yalnış)\b',
                'message': 'Yazım hatası: "yalnış" → "yanlış"',
                'rule_id': 'SPELLING',
                'suggestion': 'yanlış'
            },
            {
                'pattern': r'\b(herkez)\b',
                'message': 'Yazım hatası: "herkez" → "herkes"',
                'rule_id': 'SPELLING',
                'suggestion': 'herkes'
            },
            {
                'pattern': r'\b(yanlız)\b',
                'message': 'Yazım hatası: "yanlız" → "yalnız"',
                'rule_id': 'SPELLING',
                'suggestion': 'yalnız'
            },
            
            # Turkish character mistakes - specific patterns to avoid false positives
            {
                'pattern': r'\b(degişikli[kğ])\b',
                'message': 'Türkçe karakter hatası: "degişiklik" → "değişiklik"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': lambda m: m.group(0).replace('degişikli', 'değişikli')
            },
            {
                'pattern': r'\b(buyuk)\b',
                'message': 'Türkçe karakter hatası: "buyuk" → "büyük"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'büyük'
            },
            {
                'pattern': r'\b(tuketti[kğ]ce)\b',
                'message': 'Türkçe karakter hatası: "tukettikce" → "tükettikçe"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'tükettikçe'
            },
            {
                'pattern': r'\b(artmaktadir)\b',
                'message': 'Türkçe karakter hatası: "artmaktadir" → "artmaktadır"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'artmaktadır'
            },
            {
                'pattern': r'\b(ısınmasina)\b',
                'message': 'Türkçe karakter hatası: "ısınmasina" → "ısınmasına"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'ısınmasına'
            },
            {
                'pattern': r'\b(bozulmasina)\b',
                'message': 'Türkçe karakter hatası: "bozulmasina" → "bozulmasına"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'bozulmasına'
            },
            {
                'pattern': r'\b(cogu)\b',
                'message': 'Türkçe karakter hatası: "cogu" → "çoğu"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'çoğu'
            },
            {
                'pattern': r'\b(farkinda)\b',
                'message': 'Türkçe karakter hatası: "farkinda" → "farkında"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'farkında'
            },
            {
                'pattern': r'\b(degildir)\b',
                'message': 'Türkçe karakter hatası: "degildir" → "değildir"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'değildir'
            },
            {
                'pattern': r'\b(yokedilmesi)\b',
                'message': 'Türkçe karakter hatası: "yokedilmesi" → "yok edilmesi"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'yok edilmesi'
            },
            {
                'pattern': r'\b(artmasi)\b',
                'message': 'Türkçe karakter hatası: "artmasi" → "artması"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'artması'
            },
            {
                'pattern': r'\b(yukselmesine)\b',
                'message': 'Türkçe karakter hatası: "yukselmesine" → "yükselmesine"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'yükselmesine'
            },
            {
                'pattern': r'\b(yolacacaktir)\b',
                'message': 'Türkçe karakter hatası: "yolacacaktir" → "yol açacaktır"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'yol açacaktır'
            },
            {
                'pattern': r'\b(urunlerinde)\b',
                'message': 'Türkçe karakter hatası: "urunlerinde" → "ürünlerinde"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'ürünlerinde'
            },
            {
                'pattern': r'\b(dogal)\b',
                'message': 'Türkçe karakter hatası: "dogal" → "doğal"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'doğal'
            },
            {
                'pattern': r'\b(sıkliginda)\b',
                'message': 'Türkçe karakter hatası: "sıkliginda" → "sıklığında"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'sıklığında'
            },
            {
                'pattern': r'\b(yazikki)\b',
                'message': 'Türkçe karakter hatası: "yazikki" → "yazık ki"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'yazık ki'
            },
            {
                'pattern': r'\b(ulkeler)\b',
                'message': 'Türkçe karakter hatası: "ulkeler" → "ülkeler"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'ülkeler'
            },
            {
                'pattern': r'\b(mucadelede)\b',
                'message': 'Türkçe karakter hatası: "mucadelede" → "mücadelede"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'mücadelede'
            },
            {
                'pattern': r'\b(adim)\b',
                'message': 'Türkçe karakter hatası: "adim" → "adım"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'adım'
            },
            {
                'pattern': r'\b(Politakilar)\b',
                'message': 'Türkçe karakter hatası: "Politakilar" → "Politikalar"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'Politikalar'
            },
            {
                'pattern': r'\b(cikarlari)\b',
                'message': 'Türkçe karakter hatası: "cikarlari" → "çıkarları"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'çıkarları'
            },
            {
                'pattern': r'\b(cevre)\b',
                'message': 'Türkçe karakter hatası: "cevre" → "çevre"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'çevre'
            },
            {
                'pattern': r'\b(onune)\b',
                'message': 'Türkçe karakter hatası: "onune" → "önüne"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'önüne'
            },
            {
                'pattern': r'\b(uzerine)\b',
                'message': 'Türkçe karakter hatası: "uzerine" → "üzerine"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'üzerine'
            },
            {
                'pattern': r'\b(dusen)\b',
                'message': 'Türkçe karakter hatası: "dusen" → "düşen"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'düşen'
            },
            {
                'pattern': r'\b(gorevleri)\b',
                'message': 'Türkçe karakter hatası: "gorevleri" → "görevleri"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'görevleri'
            },
            {
                'pattern': r'\b(donusum)\b',
                'message': 'Türkçe karakter hatası: "donusum" → "dönüşüm"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'dönüşüm'
            },
            {
                'pattern': r'\b(tuketim)\b',
                'message': 'Türkçe karakter hatası: "tuketim" → "tüketim"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'tüketim'
            },
            {
                'pattern': r'\b(aliskanliklari)\b',
                'message': 'Türkçe karakter hatası: "aliskanliklari" → "alışkanlıkları"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'alışkanlıkları'
            },
            {
                'pattern': r'\b(Sonuc)\b',
                'message': 'Türkçe karakter hatası: "Sonuc" → "Sonuç"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'Sonuç'
            },
            {
                'pattern': r'\b(hukumetlerin)\b',
                'message': 'Türkçe karakter hatası: "hukumetlerin" → "hükümetlerin"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'hükümetlerin'
            },
            {
                'pattern': r'\b(cozebileceği)\b',
                'message': 'Türkçe karakter hatası: "cozebileceği" → "çözebileceği"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'çözebileceği'
            },
            {
                'pattern': r'\b(sarttır)\b',
                'message': 'Türkçe karakter hatası: "sarttır" → "şarttır"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'şarttır'
            },
            {
                'pattern': r'\b(bugunden)\b',
                'message': 'Türkçe karakter hatası: "bugunden" → "bugünden"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'bugünden'
            },
            {
                'pattern': r'\b(gecilmezse)\b',
                'message': 'Türkçe karakter hatası: "gecilmezse" → "geçilmezse"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'geçilmezse'
            },
            {
                'pattern': r'\b(karsilasacaktir)\b',
                'message': 'Türkçe karakter hatası: "karsilasacaktir" → "karşılaşacaktır"',
                'rule_id': 'TURKISH_CHAR',
                'suggestion': 'karşılaşacaktır'
            }
        ]
    
    def _get_english_rules(self) -> List[Dict[str, Any]]:
        """Get English grammar rules"""
        return [
            # Spacing rules
            {
                'pattern': r'\s{3,}',
                'message': 'Multiple consecutive spaces',
                'rule_id': 'MULTIPLE_SPACES'
            },
            {
                'pattern': r'\s+[.!?]',
                'message': 'No space before punctuation',
                'rule_id': 'PUNCTUATION_SPACING'
            },
            
            # Common English spelling mistakes
            {
                'pattern': r'\b(recieve)\b',
                'message': 'Spelling error: "recieve" → "receive"',
                'rule_id': 'SPELLING',
                'suggestion': 'receive'
            },
            {
                'pattern': r'\b(seperate)\b',
                'message': 'Spelling error: "seperate" → "separate"',
                'rule_id': 'SPELLING',
                'suggestion': 'separate'
            }
        ]
