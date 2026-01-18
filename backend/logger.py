"""
User Action Logger for ML Training Data Collection
사용자 행동을 Supabase에 기록하여 XGBoost 학습 데이터로 활용
"""

from datetime import datetime
from typing import Optional
from supabase import Client
import os


class UserActionLogger:
    """사용자 행동 로깅 클래스"""
    
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        
    def _log_action(
        self,
        user_id: str,
        mbti: str,
        action_type: str,
        stock_ticker: str,
        theme_id: Optional[str] = None,
        theme_title: Optional[str] = None,
        rank_position: Optional[int] = None,
        quantity: Optional[int] = None,
        price: Optional[float] = None
    ):
        """공통 로깅 함수"""
        try:
            data = {
                "user_id": user_id,
                "mbti": mbti.upper(),
                "action_type": action_type,
                "stock_ticker": stock_ticker,
                "theme_id": theme_id,
                "theme_title": theme_title,
                "rank_position": rank_position,
                "quantity": quantity,
                "price": price,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # None 값 제거
            data = {k: v for k, v in data.items() if v is not None}
            
            result = self.supabase.table('user_actions').insert(data).execute()
            return result.data
            
        except Exception as e:
            print(f"[Logger Error] Failed to log {action_type}: {e}")
            return None
    
    def log_recommendation_view(
        self,
        user_id: str,
        mbti: str,
        stock_ticker: str,
        theme_id: str,
        theme_title: str,
        rank_position: int
    ):
        """
        추천 종목 노출 로깅
        - 사용자에게 추천 리스트가 표시되었을 때
        """
        return self._log_action(
            user_id=user_id,
            mbti=mbti,
            action_type="view",
            stock_ticker=stock_ticker,
            theme_id=theme_id,
            theme_title=theme_title,
            rank_position=rank_position
        )
    
    def log_stock_click(
        self,
        user_id: str,
        mbti: str,
        stock_ticker: str,
        theme_id: str,
        theme_title: str,
        rank_position: int
    ):
        """
        종목 카드 클릭 로깅
        - 사용자가 종목을 클릭하여 상세 페이지로 이동
        """
        return self._log_action(
            user_id=user_id,
            mbti=mbti,
            action_type="click",
            stock_ticker=stock_ticker,
            theme_id=theme_id,
            theme_title=theme_title,
            rank_position=rank_position
        )
    
    def log_detail_view(
        self,
        user_id: str,
        mbti: str,
        stock_ticker: str,
        theme_id: Optional[str] = None,
        theme_title: Optional[str] = None
    ):
        """
        상세 페이지 진입 로깅
        - Bottom Sheet가 열렸을 때
        """
        return self._log_action(
            user_id=user_id,
            mbti=mbti,
            action_type="detail_view",
            stock_ticker=stock_ticker,
            theme_id=theme_id,
            theme_title=theme_title
        )
    
    def log_stock_buy(
        self,
        user_id: str,
        mbti: str,
        stock_ticker: str,
        quantity: int,
        price: float,
        theme_id: Optional[str] = None
    ):
        """
        매수 로깅
        - 사용자가 종목을 매수했을 때 (가장 강한 positive signal)
        """
        return self._log_action(
            user_id=user_id,
            mbti=mbti,
            action_type="buy",
            stock_ticker=stock_ticker,
            theme_id=theme_id,
            quantity=quantity,
            price=price
        )
    
    def log_stock_sell(
        self,
        user_id: str,
        mbti: str,
        stock_ticker: str,
        quantity: int,
        price: float
    ):
        """
        매도 로깅
        - 사용자가 종목을 매도했을 때
        """
        return self._log_action(
            user_id=user_id,
            mbti=mbti,
            action_type="sell",
            stock_ticker=stock_ticker,
            quantity=quantity,
            price=price
        )
    
    def get_user_history(
        self,
        user_id: str,
        limit: int = 100
    ):
        """사용자 행동 히스토리 조회"""
        try:
            result = self.supabase.table('user_actions')\
                .select('*')\
                .eq('user_id', user_id)\
                .order('timestamp', desc=True)\
                .limit(limit)\
                .execute()
            return result.data
        except Exception as e:
            print(f"[Logger Error] Failed to get history: {e}")
            return []
    
    def get_mbti_statistics(self, mbti: str):
        """MBTI별 통계 조회 (ML 학습 데이터 충분성 확인용)"""
        try:
            result = self.supabase.table('user_actions')\
                .select('action_type', count='exact')\
                .eq('mbti', mbti.upper())\
                .execute()
            return {
                'mbti': mbti,
                'total_actions': result.count,
                'data': result.data
            }
        except Exception as e:
            print(f"[Logger Error] Failed to get statistics: {e}")
            return None


# 싱글톤 인스턴스 (main.py에서 초기화)
_logger_instance: Optional[UserActionLogger] = None


def init_logger(supabase_client: Client):
    """로거 초기화 (앱 시작 시 한 번 호출)"""
    global _logger_instance
    _logger_instance = UserActionLogger(supabase_client)
    print("[Logger] User action logger initialized")


def get_logger() -> UserActionLogger:
    """로거 인스턴스 가져오기"""
    if _logger_instance is None:
        raise RuntimeError("Logger not initialized. Call init_logger() first.")
    return _logger_instance
