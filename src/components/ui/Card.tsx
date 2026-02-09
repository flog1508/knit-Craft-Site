import React from 'react'
import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  const hasCustomBg = className?.includes('bg-') || className?.includes('backdrop-blur')
  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-200 p-6',
        !hasCustomBg && 'bg-white',
        hover && 'transition-shadow duration-300 hover:shadow-lg cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
