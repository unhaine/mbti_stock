
import requests
import json
import time

API_URL = "http://localhost:8000/recommend/themes"

def test_recommendation_api(mbti="INTJ"):
    print(f"🔄 Testing API for MBTI: {mbti}...")
    headers = {"Content-Type": "application/json"}
    payload = {"mbti": mbti}
    
    start_time = time.time()
    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! (Took {elapsed:.2f}s)")
            print(f"📦 Received {len(data)} themes.")
            
            for i, theme in enumerate(data):
                print(f"\n[Theme {i+1}] {theme['emoji']} {theme['title']}")
                print(f"   Category: {theme['category']}")
                print(f"   Stocks: {len(theme['stocks'])} items")
                for stock in theme['stocks']:
                    print(f"     - {stock['name']} ({stock['ticker']}): {stock['score']}점 | {stock['reason']}")
        else:
            print(f"❌ Failed with Status Code: {response.status_code}")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Tip: Make sure the backend server is running (uvicorn main:app --reload)")

if __name__ == "__main__":
    test_recommendation_api("INTJ")
    print("\n" + "="*30 + "\n")
    test_recommendation_api("ENFP")
