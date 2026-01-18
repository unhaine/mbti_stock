
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import iconv from 'iconv-lite'; 
import jschardet from 'jschardet';

const app = express();
const PORT = 3001;

app.use(cors());

// 네이버 종목토론실 크롤링 엔드포인트
app.get('/api/naver/discussion', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Stock code is required' });
  }

  try {
    const url = `https://finance.naver.com/item/board.naver?code=${code}`;
    
    // 네이버는 EUC-KR 인코딩을 사용하므로 arrayBuffer로 받아서 디코딩해야 함
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 인코딩 자동 감지
    const detected = jschardet.detect(buffer);
    const encoding = detected.encoding || 'EUC-KR'; // 감지 실패 시 기본값 EUC-KR
    console.log(`Expected: ${code}, Detected Encoding: ${encoding}`);

    const html = iconv.decode(buffer, encoding);

    res.send(html);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Simple Crawler Server running on http://localhost:${PORT}`);
});
