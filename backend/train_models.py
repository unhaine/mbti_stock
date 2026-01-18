"""
Train XGBoost models for all MBTI types
모든 MBTI 타입에 대해 XGBoost 모델 학습
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# 상위 디렉토리를 path에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ml.trainer import train_all_mbti_models

# Load environment
load_dotenv('../.env')

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Supabase credentials not found!")
    sys.exit(1)

def main():
    print("🚀 MBTI Stock - XGBoost Model Training")
    print("=" * 60)
    
    # Supabase 클라이언트 생성
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 모든 MBTI 모델 학습
    results = train_all_mbti_models(supabase)
    
    # 결과 요약
    print("\n📊 Training Summary:")
    print("=" * 60)
    
    success_count = sum(1 for r in results.values() if r['status'] == 'success')
    failed_count = sum(1 for r in results.values() if r['status'] == 'failed')
    
    print(f"✅ Successful: {success_count}/16")
    print(f"❌ Failed: {failed_count}/16")
    
    if success_count > 0:
        print("\n✨ Models ready for deployment!")
        print("📁 Models saved in: backend/ml/models/")
    else:
        print("\n⚠️  No models were trained successfully.")
        print("💡 Make sure you have enough training data (at least 20 samples per MBTI)")

if __name__ == '__main__':
    main()
