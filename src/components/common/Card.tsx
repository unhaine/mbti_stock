import { ReactNode } from 'react'
import { cn } from '../../utils/helpers'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'glass' | 'solid' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
  onClick?: () => void
  [key: string]: any
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-200'

  const variants = {
    default: 'bg-white border border-dark-600 shadow-sm',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-md',
    solid: 'bg-dark-700',
    outline: 'bg-transparent border border-dark-500',
  }

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  }

  const hoverStyles = hover
    ? 'cursor-pointer hover:border-dark-400 hover:-translate-y-1 hover:shadow-lg'
    : ''

  return (
    <div
      className={cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
