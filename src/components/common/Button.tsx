import { ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/helpers'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  className?: string
}

/**
 * Button 컴포넌트
 * 미니멀 디자인 - 빨간색 primary, 그레이 secondary
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none active:scale-[0.98]'

  const variants = {
    // Primary: 빨간색 배경, 흰색 텍스트
    primary:
      'bg-primary-500 text-white hover:bg-primary-600',
    // Secondary: 회색 배경
    secondary:
      'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
    // Ghost: 투명 배경, 빨간색 텍스트
    ghost: 
      'bg-transparent text-primary-500 hover:bg-primary-50',
    // Danger: 빨간색 (primary와 동일하지만 의미적 구분)
    danger: 
      'bg-error text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-3.5 text-lg',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed active:scale-100',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          로딩중...
        </>
      ) : (
        children
      )}
    </button>
  )
}
