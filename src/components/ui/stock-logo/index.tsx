import { useState } from 'react'

// 주요 기업들의 도메인 매핑
const STOCK_DOMAINS: Record<string, string> = {
  // === 반도체/IT/전자/플랫폼 ===
  '005930': 'samsung.com', // 삼성전자
  '066570': 'lge.co.kr', // LG전자
  '011070': 'lgdisplay.com', // LG디스플레이
  '000660': 'skhynix.com', // SK하이닉스
  '035420': 'navercorp.com', // NAVER
  '035720': 'kakaocorp.com', // 카카오
  '377300': 'kakaopay.com', // 카카오페이
  '323410': 'kakaobank.com', // 카카오뱅크
  '006400': 'samsungsdi.com', // 삼성SDI
  '009150': 'samsungsem.com', // 삼성전기
  '018260': 'samsungsds.com', // 삼성SDS
  '022100': 'poscodx.com', // 포스코DX
  '402340': 'sk-square.com', // SK스퀘어
  '012510': 'douzone.com', // 더존비즈온
  '053800': 'ahnlab.com', // 안랩
  '042000': 'cafe24.com', // 카페24

  // === 게임/엔터/미디어 ===
  '352820': 'hybecorp.com', // 하이브
  '035900': 'jype.com', // JYP Ent.
  '041510': 'smentertainment.com', // 에스엠
  '122870': 'ygfamily.com', // 와이지엔터테인먼트
  '035760': 'cjenm.com', // CJ ENM
  '259960': 'krafton.com', // 크래프톤
  '251270': 'netmarble.com', // 넷마블
  '036570': 'ncsoft.com', // 엔씨소프트
  '293490': 'kakaogames.com', // 카카오게임즈
  '263750': 'pearlabyss.com', // 펄어비스
  '112040': 'wemade.com', // 위메이드
  '067160': 'sooplive.co.kr', // SOOP
  '079160': 'cgv.co.kr', // CJ CGV

  // === 2차전지/화학/에너지/신소재 ===
  '373220': 'lgensol.com', // LG에너지솔루션
  '051910': 'lgchem.com', // LG화학
  '011170': 'lottechem.com', // 롯데케미칼
  '096770': 'skinnovation.com', // SK이노베이션
  '003670': 'poscofuturem.com', // 포스코퓨처엠
  '247540': 'ecoprobm.co.kr', // 에코프로비엠
  '086520': 'ecopro.co.kr', // 에코프로
  '066970': 'landf.co.kr', // 엘앤에프
  '051900': 'lghnh.com', // LG생활건강
  '090430': 'amorepacific.com', // 아모레퍼시픽
  '010950': 's-oil.com', // S-Oil
  '011780': 'kumhopetro.com', // 금호석유
  '120110': 'kolonindustries.com', // 코오롱인더
  '010060': 'oci.co.kr', // OCI
  '002380': 'kccworld.co.kr', // KCC

  // === 자동차/운송/중공업/방산 ===
  '005380': 'hyundai.com', // 현대차
  '000270': 'kia.com', // 기아
  '012330': 'mobis.co.kr', // 현대모비스
  '005490': 'posco.co.kr', // POSCO홀딩스
  '047050': 'posco-intl.com', // 포스코인터내셔널
  '010130': 'koreanair.com', // 대한항공
  '003490': 'koreanair.com', // 대한항공우
  '000120': 'cjlogistics.com', // CJ대한통운
  '011200': 'hmm21.com', // HMM
  '028670': 'panocean.com', // 팬오션
  '020560': 'flyasiana.com', // 아시아나항공
  '089590': 'jejuair.net', // 제주항공
  '095400': 'hhi.co.kr', // 한국조선해양
  '329180': 'hhi.co.kr', // 현대중공업
  '010140': 'samsungshi.com', // 삼성중공업
  '042660': 'hanwhaocean.com', // 한화오션
  '012450': 'hanwhaaerospace.co.kr', // 한화에어로스페이스
  '047810': 'koreaaero.com', // 한국항공우주 (KAI)
  '272210': 'hanwhasystems.com', // 한화시스템
  '079550': 'lignex1.com', // LIG넥스원
  '267260': 'hd-hyundaielectric.com', // HD현대일렉트릭
  '126300': 'hd-hyundaiconstructionequipment.com', // HD현대건설기계
  '267250': 'hd-hyundaisitecore.com', // HD현대인프라코어
  '180640': 'hanjinkal.co.kr', // 한진칼
  '161390': 'hankooktire.com', // 한국타이어앤테크놀로지
  '073240': 'kumhotire.com', // 금호타이어
  '103140': 'poongsan.co.kr', // 풍산

  // === 건설/부동산/인프라 ===
  '000720': 'hdec.kr', // 현대건설
  '006360': 'gsenc.com', // GS건설
  '047040': 'daewooenc.com', // 대우건설
  '375500': 'dlenc.co.kr', // DL이앤씨
  '294870': 'hdc-dvp.com', // HDC현대산업개발
  '015760': 'kepco.co.kr', // 한국전력
  '112610': 'cswind.com', // 씨에스윈드
  '034020': 'doosan.com', // 두산에너빌리티

  // === 바이오/헬스케어 ===
  '207940': 'samsungbiologics.com', // 삼성바이오로직스
  '068270': 'celltrion.com', // 셀트리온
  '068760': 'celltrionph.com', // 셀트리온제약
  '028300': 'hlb.co.kr', // HLB
  '196170': 'alteogen.com', // 알테오젠
  '302440': 'skbioscience.co.kr', // SK바이오사이언스
  '000100': 'yuhan.co.kr', // 유한양행
  '128940': 'hanmi.co.kr', // 한미약품
  '006280': 'greencross.com', // 녹십자
  '326030': 'skbp.com', // SK바이오팜
  '145020': 'hugel.co.kr', // 휴젤
  '214150': 'classys.com', // 클래시스
  '141080': 'ligachembio.com', // 리가켐바이오
  '214450': 'pharmaresearch.co.kr', // 파마리서치

  // === 금융/지주/증권/보험 ===
  '105560': 'kbfg.com', // KB금융
  '055550': 'shinhangroup.com', // 신한지주
  '086790': 'hanafn.com', // 하나금융지주
  '316140': 'woorifg.com', // 우리금융지주
  '008560': 'meritzgroup.com', // 메리츠금융지주
  '071050': 'koreaholdings.com', // 한국금융지주
  '005830': 'dbins.net', // DB손해보험
  '001450': 'hi.co.kr', // 현대해상
  '088350': 'hanwhalife.com', // 한화생명
  '001800': 'bnkfg.com', // BNK금융지주
  '139130': 'dgbhk.co.kr', // DGB금융지주
  '175330': 'jbfinancialgroup.com', // JB금융지주
  '016360': 'samsungpop.com', // 삼성증권
  '006800': 'miraeasset.com', // 미래에셋증권
  '039490': 'kiwoom.com', // 키움증권
  '005940': 'nhqv.com', // NH투자증권
  '032830': 'samsunglife.com', // 삼성생명
  '000810': 'samsungfire.com', // 삼성화재
  '029780': 'samsungcard.com', // 삼성카드
  '000370': 'hanwha.co.kr', // 한화
  '001040': 'cj.net', // CJ
  '000150': 'doosan.com', // 두산
  '004800': 'hyosung.com', // 효성
  '006260': 'lsholdings.com', // LS
  '010120': 'ls-electric.com', // LS일렉트릭
  '078930': 'gs.co.kr', // GS
  '003550': 'lg.co.kr', // LG
  '028260': 'samsungcnt.com', // 삼성물산

  // === 소비재/유통/식품/서비스 ===
  '004170': 'shinsegae.com', // 신세계
  '023530': 'lotte.co.kr', // 롯데쇼핑
  '139480': 'emart.com', // 이마트
  '028150': 'gsretail.com', // GS리테일
  '069960': 'hyundaidepartmentstore.com', // 현대백화점
  '008770': 'hotelshilla.com', // 호텔신라
  '026960': 'dongsuh.co.kr', // 동서
  '282330': 'bgfretail.com', // BGF리테일
  '097950': 'cj.co.kr', // CJ제일제당
  '271560': 'orionworld.com', // 오리온
  '033780': 'ktng.com', // KT&G
  '003230': 'samyangfoods.com', // 삼양식품
  '004370': 'nongshim.com', // 농심
  '007310': 'ottogi.co.kr', // 오뚜기
  '005180': 'bing.co.kr', // 빙그레
  '267980': 'maeil.com', // 매일유업
  '017810': 'pulmuone.co.kr', // 풀무원
  '001680': 'daesang.com', // 대상
  '005610': 'spcsamlip.co.kr', // SPC삼립
  '005300': 'lottechilsung.co.kr', // 롯데칠성
  '000080': 'hitejinro.com', // 하이트진로
  '383220': 'fnfcorp.com', // F&F
  '021240': 'coway.com', // 코웨이
  '009240': 'hanssem.com', // 한샘
  '035250': 'kangwonland.com', // 강원랜드
  '081660': 'filaholdings.com', // 휠라홀딩스
  '093050': 'lfcorp.com', // LF

  // === 통신/기타 기술 ===
  '017670': 'sktelecom.com', // SK텔레콤
  '030200': 'kt.com', // KT
  '032640': 'lguplus.com', // LG유플러스
  '277810': 'rainbow-robotics.com', // 레인보우로보틱스
  '403870': 'hpsp.co.kr', // HPSP
  '058470': 'leeno.co.kr', // 리노공업
}

interface StockLogoProps {
  code: string // 종목 코드 (ticker)
  name: string // 종목명 (fallback용)
  size?: 'sm' | 'md' | 'lg' | 'xl' // 사이즈 옵션
  className?: string
}

export default function StockLogo({ code, name, size = 'md', className = '' }: StockLogoProps) {
  const [error, setError] = useState(false)
  const domain = STOCK_DOMAINS[code]
  
  // Google Favicon API 사용 (신뢰성 높음)
  const logoUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null

  // 사이즈 설정
  const sizeClass = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base'
  }[size]

  // 로고가 없거나 로드 실패시 텍스트 fallback 표시
  if (!logoUrl || error) {
    return (
      <div 
        className={`
          ${sizeClass} ${className}
          flex items-center justify-center rounded-full 
          bg-secondary-50 border border-secondary-100 
          font-bold text-secondary-600 overflow-hidden
        `}
      >
        {name.slice(0, 1)}
      </div>
    )
  }

  return (
    <div 
      className={`
        ${sizeClass} ${className}
        rounded-full bg-white border border-secondary-100 overflow-hidden 
        flex items-center justify-center p-1.5 shadow-sm
      `}
    >
      <img
        src={logoUrl}
        alt={`${name} 로고`}
        className="w-full h-full object-contain"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  )
}
