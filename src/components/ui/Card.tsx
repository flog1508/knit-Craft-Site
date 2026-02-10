import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...rest }) => {
  const hasCustomBg = className?.includes('bg-') || className?.includes('backdrop-blur')
  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-200 p-6',
        !hasCustomBg && 'bg-white',
        hover && 'transition-shadow duration-300 hover:shadow-lg cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
