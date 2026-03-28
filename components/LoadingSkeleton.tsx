'use client'

import React from 'react'

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'button' | 'input'
  count?: number
  width?: string
  height?: string
  className?: string
}

export default function LoadingSkeleton({
  variant = 'card',
  count = 1,
  width = 'w-full',
  height = 'h-12',
  className = '',
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count })

  const variantClasses = {
    card: 'h-48 rounded-xl',
    text: 'h-4 rounded',
    circle: 'w-12 h-12 rounded-full',
    button: 'h-10 rounded-lg w-24',
    input: 'h-10 rounded-lg',
  }

  const baseClass = variantClasses[variant]

  return (
    <>
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className={`skeleton ${baseClass} ${width} ${height} ${className}`}
        />
      ))}
    </>
  )
}
