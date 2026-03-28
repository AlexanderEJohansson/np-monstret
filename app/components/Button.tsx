'use client'

import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-neon to-accent text-primary hover:shadow-glow-lg',
    secondary: 'glass hover:glass-hover text-neon',
    ghost: 'text-neon hover:text-neon-light',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>}
      <span>{children}</span>
    </button>
  )
}
