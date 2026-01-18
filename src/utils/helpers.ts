/**
 * 헬퍼 유틸리티 함수 - Re-export for Backward Compatibility
 * 
 * DEPRECATED: 이 파일은 하위 호환성을 위해 유지되며, 향후 삭제될 예정입니다.
 * 각 함수는 개별 파일에서 import하여 사용하세요.
 * 
 * - styles.ts: cn
 * - async.ts: delay, debounce, throttle
 * - math.ts: randomChoice, randomInt
 * - market.ts: getMarketCondition, getMBTIComment
 * - ui.ts: getChangeColor, getChangeBgColor, getChangeArrow, swipePower, SWIPE_THRESHOLD, copyToClipboard
 */

export * from './styles'
export * from './async'
export * from './math'
export * from './market'
export * from './ui'

import * as styles from './styles'
import * as asyncUtils from './async'
import * as math from './math'
import * as market from './market'
import * as ui from './ui'

const helpers = {
  ...styles,
  ...asyncUtils,
  ...math,
  ...market,
  ...ui,
}

export default helpers
