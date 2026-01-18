"""
XGBoost Stock Ranker Trainer
사용자 행동 데이터로 Learning-to-Rank 모델 학습
"""

import os
import json
import xgboost as xgb
import pandas as pd
import numpy as np
from typing import List, Tuple, Optional
from datetime import datetime
from supabase import Client

from ml.feature_extractor import StockFeatureExtractor, extract_stock_features_from_db


class MBTIStockRanker:
    """MBTI별 주식 랭킹 모델"""
    
    def __init__(self, mbti_type: str):
        self.mbti = mbti_type.upper()
        self.model: Optional[xgb.Booster] = None
        self.feature_extractor = StockFeatureExtractor()
        
    def prepare_training_data(
        self,
        supabase: Client
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Supabase에서 학습 데이터 준비
        
        Returns:
            X: Feature 행렬
            y: 라벨 (relevance score)
            groups: Query group (각 추천 세션)
        """
        print(f"[{self.mbti}] Preparing training data...")
        
        # 1. user_actions에서 해당 MBTI의 행동 데이터 가져오기
        actions_result = supabase.table('user_actions')\
            .select('*')\
            .eq('mbti', self.mbti)\
            .order('timestamp', desc=False)\
            .execute()
        
        actions = actions_result.data
        
        if not actions or len(actions) < 10:
            raise ValueError(f"Insufficient data for {self.mbti}: {len(actions)} actions")
        
        print(f"  Found {len(actions)} actions for {self.mbti}")
        
        # 2. stocks 테이블에서 종목 정보 가져오기
        stocks_result = supabase.table('stocks').select('*').execute()
        stocks_dict = {s['ticker']: s for s in stocks_result.data}
        
        # 3. 세션별로 그룹화 (user_id + theme_id 조합)
        sessions = {}
        for action in actions:
            session_key = f"{action['user_id']}_{action.get('theme_id', 'default')}"
            if session_key not in sessions:
                sessions[session_key] = []
            sessions[session_key].append(action)
        
        print(f"  Grouped into {len(sessions)} sessions")
        
        # 4. Feature 및 라벨 생성
        X_list = []
        y_list = []
        groups_list = []
        
        for session_key, session_actions in sessions.items():
            # 세션 내 종목별 relevance score 계산
            stock_scores = {}
            
            for action in session_actions:
                ticker = action['stock_ticker']
                action_type = action['action_type']
                
                if ticker not in stock_scores:
                    stock_scores[ticker] = 0.0
                
                # Relevance score 부여
                if action_type == 'buy':
                    stock_scores[ticker] += 3.0  # 매수 = 가장 강한 positive
                elif action_type == 'click':
                    stock_scores[ticker] += 1.0  # 클릭 = positive
                elif action_type == 'view':
                    # view만 있고 click이 없으면 약한 negative
                    if stock_scores[ticker] == 0:
                        stock_scores[ticker] = 0.1
                elif action_type == 'sell':
                    stock_scores[ticker] -= 0.5  # 매도 = 약한 negative
            
            # 세션의 첫 액션에서 theme 정보 추출
            theme_id = session_actions[0].get('theme_id') or 'default'
            
            # 각 종목에 대해 Feature 생성
            session_size = 0
            for ticker, score in stock_scores.items():
                if ticker not in stocks_dict:
                    continue
                
                stock_data = extract_stock_features_from_db(stocks_dict[ticker])
                features = self.feature_extractor.extract_features(
                    stock_data,
                    self.mbti,
                    theme_id
                )
                
                X_list.append(features)
                # Label을 정수로 변환 (XGBoost rank:ndcg 요구사항)
                y_list.append(int(round(score)))
                session_size += 1
            
            if session_size > 0:
                groups_list.append(session_size)
        
        X = np.array(X_list)
        y = np.array(y_list)
        groups = np.array(groups_list)
        
        print(f"  Generated {len(X)} training samples from {len(groups)} sessions")
        print(f"  Feature shape: {X.shape}")
        print(f"  Label distribution: min={y.min():.2f}, max={y.max():.2f}, mean={y.mean():.2f}")
        
        return X, y, groups
    
    def train(
        self,
        X: np.ndarray,
        y: np.ndarray,
        groups: np.ndarray,
        num_boost_round: int = 100
    ):
        """
        XGBoost LambdaRank 학습
        
        Args:
            X: Feature 행렬
            y: Relevance score
            groups: Query group sizes
            num_boost_round: Boosting rounds
        """
        print(f"[{self.mbti}] Training XGBoost model...")
        
        # DMatrix 생성
        dtrain = xgb.DMatrix(X, label=y)
        dtrain.set_group(groups)
        
        # 파라미터 설정
        params = {
            'objective': 'rank:ndcg',
            'eval_metric': 'ndcg@10',
            'eta': 0.1,  # Learning rate
            'max_depth': 6,
            'min_child_weight': 1,
            'subsample': 0.8,
            'colsample_bytree': 0.8,
            'seed': 42
        }
        
        # 학습
        self.model = xgb.train(
            params,
            dtrain,
            num_boost_round=num_boost_round,
            verbose_eval=10
        )
        
        print(f"[{self.mbti}] Training complete!")
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        주어진 종목들의 랭킹 점수 예측
        
        Args:
            X: Feature 행렬
        
        Returns:
            예측 점수 배열
        """
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        dtest = xgb.DMatrix(X)
        return self.model.predict(dtest)
    
    def save_model(self, path: str):
        """모델 저장"""
        if self.model is None:
            raise ValueError("No model to save!")
        
        self.model.save_model(path)
        print(f"[{self.mbti}] Model saved to {path}")
    
    def load_model(self, path: str):
        """모델 로드"""
        self.model = xgb.Booster()
        self.model.load_model(path)
        print(f"[{self.mbti}] Model loaded from {path}")
    
    def get_feature_importance(self) -> dict:
        """Feature 중요도 반환"""
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        importance = self.model.get_score(importance_type='gain')
        feature_names = self.feature_extractor.get_feature_names()
        
        # Feature 이름 매핑
        importance_dict = {}
        for i, name in enumerate(feature_names):
            f_key = f'f{i}'
            if f_key in importance:
                importance_dict[name] = importance[f_key]
        
        # 중요도 순으로 정렬
        return dict(sorted(importance_dict.items(), key=lambda x: x[1], reverse=True))


def train_all_mbti_models(supabase: Client, output_dir: str = 'ml/models'):
    """
    모든 MBTI 타입에 대해 모델 학습
    
    Args:
        supabase: Supabase 클라이언트
        output_dir: 모델 저장 디렉토리
    """
    MBTI_TYPES = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP',
        'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
        'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]
    
    os.makedirs(output_dir, exist_ok=True)
    
    results = {}
    
    for mbti in MBTI_TYPES:
        print(f"\n{'='*60}")
        print(f"Training model for {mbti}")
        print(f"{'='*60}")
        
        try:
            ranker = MBTIStockRanker(mbti)
            X, y, groups = ranker.prepare_training_data(supabase)
            
            if len(X) < 20:
                print(f"⚠️  Skipping {mbti}: insufficient data ({len(X)} samples)")
                continue
            
            ranker.train(X, y, groups)
            
            # 모델 저장
            model_path = os.path.join(output_dir, f'{mbti}_ranker.json')
            ranker.save_model(model_path)
            
            # Feature 중요도
            importance = ranker.get_feature_importance()
            print(f"\n[{mbti}] Top 5 important features:")
            for i, (feat, score) in enumerate(list(importance.items())[:5], 1):
                print(f"  {i}. {feat}: {score:.2f}")
            
            results[mbti] = {
                'status': 'success',
                'samples': len(X),
                'model_path': model_path,
                'top_features': list(importance.keys())[:5]
            }
            
        except Exception as e:
            print(f"❌ Error training {mbti}: {e}")
            results[mbti] = {
                'status': 'failed',
                'error': str(e)
            }
    
    # 결과 저장
    results_path = os.path.join(output_dir, 'training_results.json')
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"Training complete! Results saved to {results_path}")
    print(f"{'='*60}")
    
    return results
