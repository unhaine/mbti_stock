"""
Hybrid Ranker: Rule-based + XGBoost
Rule-based 랭커와 XGBoost 모델을 결합한 하이브리드 시스템
"""

import os
from typing import Dict, List, Any, Tuple
from ml.trainer import MBTIStockRanker
from ml.feature_extractor import StockFeatureExtractor, extract_stock_features_from_db


class HybridStockRanker:
    """Rule-based와 ML을 결합한 하이브리드 랭커"""
    
    def __init__(self, mbti: str, models_dir: str = 'ml/models'):
        self.mbti = mbti.upper()
        self.models_dir = models_dir
        self.ml_ranker = None
        self.feature_extractor = StockFeatureExtractor()
        
        # ML 모델 로드 시도
        self._load_ml_model()
    
    def _load_ml_model(self):
        """ML 모델 로드"""
        model_path = os.path.join(self.models_dir, f'{self.mbti}_ranker.json')
        
        if os.path.exists(model_path):
            try:
                self.ml_ranker = MBTIStockRanker(self.mbti)
                self.ml_ranker.load_model(model_path)
                print(f"[Hybrid] Loaded ML model for {self.mbti}")
            except Exception as e:
                print(f"[Hybrid] Failed to load ML model for {self.mbti}: {e}")
                self.ml_ranker = None
        else:
            print(f"[Hybrid] No ML model found for {self.mbti}, using rule-based only")
    
    def score_stock_ml(
        self,
        stock_data: Dict[str, Any],
        theme_category: str
    ) -> float:
        """
        ML 모델로 점수 예측
        
        Args:
            stock_data: 주식 정보
            theme_category: 테마 카테고리
        
        Returns:
            예측 점수 (0-100 스케일로 정규화)
        """
        if self.ml_ranker is None:
            return 0.0
        
        try:
            # Feature 추출
            features = self.feature_extractor.extract_features(
                stock_data,
                self.mbti,
                theme_category
            )
            
            # 예측 (XGBoost는 relevance score 반환)
            import numpy as np
            score = self.ml_ranker.predict(np.array([features]))[0]
            
            # 0-100 스케일로 정규화 (relevance score는 0-3 범위)
            normalized_score = min(100, max(0, score * 33.33))
            
            return float(normalized_score)
            
        except Exception as e:
            print(f"[Hybrid] ML prediction error: {e}")
            return 0.0
    
    def score_stock_rule_based(
        self,
        stock_features: Dict[str, Any],
        mbti: str,
        theme_category: str
    ) -> Tuple[float, str]:
        """
        Rule-based 점수 계산 (기존 ranker.py 로직)
        
        Returns:
            (점수, 설명)
        """
        # 기존 ranker.py의 score_stock 로직을 여기에 복사
        # 간단히 하기 위해 핵심 로직만 구현
        
        from ranker import score_stock
        return score_stock(stock_features, mbti, theme_category)
    
    def score_stock_hybrid(
        self,
        stock_features: Dict[str, Any],
        theme_category: str,
        ml_weight: float = 0.7
    ) -> Tuple[float, str]:
        """
        하이브리드 점수 계산
        
        Args:
            stock_features: 주식 Feature 딕셔너리
            theme_category: 테마 카테고리
            ml_weight: ML 모델 가중치 (0.0 ~ 1.0)
        
        Returns:
            (최종 점수, 설명)
        """
        # 1. Rule-based 점수
        rule_score, rule_reason = self.score_stock_rule_based(
            stock_features,
            self.mbti,
            theme_category
        )
        
        # 2. ML 모델이 있으면 ML 점수도 계산
        if self.ml_ranker is not None:
            stock_data = extract_stock_features_from_db(stock_features)
            ml_score = self.score_stock_ml(stock_data, theme_category)
            
            # 앙상블: 가중 평균
            final_score = ml_weight * ml_score + (1 - ml_weight) * rule_score
            
            reason = f"🤖 ML 기반 추천 (ML: {ml_score:.1f}, Rule: {rule_score:.1f})"
        else:
            # ML 모델 없으면 Rule-based만 사용
            final_score = rule_score
            reason = f"📊 Rule 기반 추천: {rule_reason}"
        
        return final_score, reason
    
    def rank_stocks(
        self,
        stocks: List[Dict[str, Any]],
        theme_category: str,
        use_ml: bool = True,
        ml_weight: float = 0.7
    ) -> List[Tuple[Dict[str, Any], float, str]]:
        """
        주식 리스트 랭킹
        
        Args:
            stocks: 주식 객체 리스트 (각 객체는 'features' 키를 포함해야 함)
            theme_category: 테마 카테고리
            use_ml: ML 모델 사용 여부
            ml_weight: ML 가중치
        
        Returns:
            (주식객체, 점수, 설명) 튜플 리스트 (점수 내림차순)
        """
        scored_stocks = []
        
        for stock_obj in stocks:
            features = stock_obj.get('features', stock_obj)
            
            if use_ml and self.ml_ranker is not None:
                score, reason = self.score_stock_hybrid(
                    features,
                    theme_category,
                    ml_weight
                )
            else:
                score, reason = self.score_stock_rule_based(
                    features,
                    self.mbti,
                    theme_category
                )
            
            scored_stocks.append((stock_obj, score, reason))
        
        # 점수 내림차순 정렬
        scored_stocks.sort(key=lambda x: x[1], reverse=True)
        
        return scored_stocks


def get_hybrid_ranker(mbti: str) -> HybridStockRanker:
    """
    MBTI별 하이브리드 랭커 인스턴스 반환
    
    Args:
        mbti: MBTI 타입
    
    Returns:
        HybridStockRanker 인스턴스
    """
    return HybridStockRanker(mbti)
