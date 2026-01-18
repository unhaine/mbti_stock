"""
Feature Extractor for XGBoost Stock Ranker
주식 데이터에서 ML 학습용 Feature 추출
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Any


class StockFeatureExtractor:
    """주식 Feature 추출기"""
    
    def __init__(self):
        self.feature_names = [
            # 기본 Feature (ranker.py에서 사용 중)
            'change_percent',
            'volatility_low',
            'volatility_medium',
            'volatility_high',
            'dividend_yield',
            'market_cap_small',
            'market_cap_medium',
            'market_cap_large',
            
            # 섹터 Feature (One-Hot Encoding)
            'sector_tech',
            'sector_finance',
            'sector_manufacturing',
            'sector_service',
            'sector_other',
            
            # MBTI Feature (One-Hot Encoding)
            'mbti_I',  # Introvert
            'mbti_E',  # Extrovert
            'mbti_N',  # Intuition
            'mbti_S',  # Sensing
            'mbti_T',  # Thinking
            'mbti_F',  # Feeling
            'mbti_J',  # Judging
            'mbti_P',  # Perceiving
            
            # 테마 Feature
            'theme_tech',
            'theme_dividend',
            'theme_value',
            'theme_momentum',
            'theme_esg',
        ]
    
    def extract_features(
        self,
        stock_data: Dict[str, Any],
        mbti: str,
        theme_category: str
    ) -> List[float]:
        """
        주식 데이터에서 Feature 벡터 추출
        
        Args:
            stock_data: 주식 정보 딕셔너리
            mbti: MBTI 타입 (e.g., 'INTJ')
            theme_category: 테마 카테고리 (e.g., 'tech_growth')
        
        Returns:
            Feature 벡터 (리스트)
        """
        features = []
        
        # 1. 기본 수치 Feature
        change_pct = float(stock_data.get('change_percent', 0))
        features.append(change_pct)
        
        # 2. Volatility (One-Hot)
        volatility = stock_data.get('volatility', 'medium')
        features.extend([
            1.0 if volatility == 'low' else 0.0,
            1.0 if volatility == 'medium' else 0.0,
            1.0 if volatility == 'high' else 0.0,
        ])
        
        # 3. Dividend Yield
        div_yield = float(stock_data.get('dividend_yield', 0))
        features.append(div_yield)
        
        # 4. Market Cap (One-Hot)
        market_cap = stock_data.get('market_cap', 'medium')
        features.extend([
            1.0 if market_cap == 'small' else 0.0,
            1.0 if market_cap == 'medium' else 0.0,
            1.0 if market_cap == 'large' else 0.0,
        ])
        
        # 5. Sector (One-Hot)
        sector = stock_data.get('sector', '')
        features.extend([
            1.0 if '기술' in sector or '반도체' in sector or 'IT' in sector else 0.0,
            1.0 if '금융' in sector or '은행' in sector else 0.0,
            1.0 if '제조' in sector or '자동차' in sector else 0.0,
            1.0 if '서비스' in sector or '유통' in sector else 0.0,
            1.0 if sector and not any(x in sector for x in ['기술', '반도체', 'IT', '금융', '은행', '제조', '자동차', '서비스', '유통']) else 0.0,
        ])
        
        # 6. MBTI Feature (각 차원별)
        features.extend([
            1.0 if 'I' in mbti else 0.0,
            1.0 if 'E' in mbti else 0.0,
            1.0 if 'N' in mbti else 0.0,
            1.0 if 'S' in mbti else 0.0,
            1.0 if 'T' in mbti else 0.0,
            1.0 if 'F' in mbti else 0.0,
            1.0 if 'J' in mbti else 0.0,
            1.0 if 'P' in mbti else 0.0,
        ])
        
        # 7. Theme Feature (One-Hot)
        # 한글 카테고리명을 영문 피처 키워드로 매핑
        theme_map = {
            '기술주': 'tech',
            '신산업': 'tech',
            '성장주': 'momentum',
            '고성장주': 'momentum',
            '단기 매매': 'momentum',
            '배당 투자': 'dividend',
            '가치 투자': 'value',
            '역발상 투자': 'value',
            'ESG 투자': 'esg'
        }
        
        mapped_theme = theme_map.get(theme_category, theme_category.lower())

        features.extend([
            1.0 if 'tech' in mapped_theme else 0.0,
            1.0 if 'dividend' in mapped_theme else 0.0,
            1.0 if 'value' in mapped_theme else 0.0,
            1.0 if 'momentum' in mapped_theme else 0.0,
            1.0 if 'esg' in mapped_theme else 0.0,
        ])
        
        return features
    
    def get_feature_names(self) -> List[str]:
        """Feature 이름 리스트 반환"""
        return self.feature_names
    
    def features_to_dataframe(
        self,
        features_list: List[List[float]]
    ) -> pd.DataFrame:
        """Feature 리스트를 DataFrame으로 변환"""
        return pd.DataFrame(features_list, columns=self.feature_names)


def extract_stock_features_from_db(stock_row: Dict) -> Dict[str, Any]:
    """
    Supabase stocks 테이블 row를 Feature 추출용 딕셔너리로 변환
    
    Args:
        stock_row: Supabase에서 가져온 주식 데이터 row
    
    Returns:
        Feature 추출용 딕셔너리
    """
    return {
        'ticker': stock_row.get('ticker'),
        'name': stock_row.get('name'),
        'sector': stock_row.get('sector', ''),
        'change_percent': stock_row.get('change_percent', 0),
        'volatility': stock_row.get('volatility', 'medium'),
        'dividend_yield': stock_row.get('dividend_yield', 0),
        'market_cap': stock_row.get('market_cap', 'medium'),
    }
