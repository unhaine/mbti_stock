import { cn } from '../../utils/helpers'

export default function Spinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4',
    }

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-primary-500 border-t-transparent',
                sizes[size],
                className
            )}
        />
    )
}

// 로딩 오버레이
export function LoadingOverlay({ message = '로딩중...' }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm">
            <Spinner size="xl" />
            <p className="mt-4 text-dark-200 animate-pulse">{message}</p>
        </div>
    )
}

// 인라인 로딩
export function LoadingInline({ size = 'sm' }) {
    return (
        <div className="flex items-center gap-2 text-dark-400">
            <Spinner size={size} />
            <span>로딩중...</span>
        </div>
    )
}
