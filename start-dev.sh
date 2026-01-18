#!/bin/bash

# MBTI Stock 개발 서버 실행 스크립트
# 사용법: ./start-dev.sh

echo "🚀 MBTI Stock 개발 서버 시작..."
echo ""

# 환경 변수 체크
if [ ! -f ".env" ]; then
    echo "❌ .env 파일이 없습니다!"
    echo "📝 .env.example을 참고하여 .env 파일을 생성해주세요."
    exit 1
fi

echo "✅ 환경 변수 파일 확인 완료"
echo ""

# 함수: 프로세스 종료
cleanup() {
    echo ""
    echo "🛑 서버 종료 중..."
    kill $PROXY_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# 1. 프록시 서버 시작
echo "📡 프록시 서버 시작 (포트 3001)..."
node scripts/proxy-server.js &
PROXY_PID=$!
sleep 2

# 2. 백엔드 서버 시작
echo "🐍 백엔드 서버 시작 (포트 8000)..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..
sleep 3

# 3. 프론트엔드 서버 시작
echo "⚛️  프론트엔드 서버 시작 (포트 5173)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✨ 모든 서버가 시작되었습니다!"
echo ""
echo "📍 접속 주소:"
echo "   - 프론트엔드: http://localhost:5173"
echo "   - 백엔드 API: http://localhost:8000/docs"
echo "   - 프록시: http://localhost:3001"
echo ""
echo "⏹️  종료하려면 Ctrl+C를 누르세요."
echo ""

# 서버 실행 유지
wait
