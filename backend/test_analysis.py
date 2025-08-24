import requests
import json

def test_analysis():
    url = "http://localhost:8010/api/v1/analyze"
    
    test_data = {
        "text": "Yapay zeka, öğrencilere bireysel öğrenme imakanları sunar. Örneğin, bir ogrencinin hatalarını analiz ederek kişisel öneriler verir. Ancak bazen yanliş önerileride getirebilir. Öğretmenlerin rolü tamamen ortadan kalkmıyacaktır.",
        "reference_topic": "yapay zeka eğitimi"
    }
    
    try:
        response = requests.post(url, json=test_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_analysis()
