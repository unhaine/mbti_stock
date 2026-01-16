/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // 더 필요한 환경 변수들을 여기에 추가하세요
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.jsx' {
  import { FC, PropsWithChildren } from 'react'
  const component: FC<any>
  export default component
}

declare module '*.json' {
  const value: any
  export default value
}
