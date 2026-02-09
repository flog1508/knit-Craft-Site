import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  // Check if custom styling provided via className
  const isLight = className?.includes('text-white')
  const labelClass = isLight ? 'text-white/90' : 'text-gray-700'
  const helperClass = isLight ? 'text-white/60' : 'text-gray-500'

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={`block text-sm font-medium ${labelClass} mb-1.5`}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full px-4 py-2.5 border-2 rounded-lg transition-colors duration-200',
          'focus:outline-none focus:ring-2',
          error ? 'border-red-500' : 'border-gray-300',
          isLight && 'border-white/30 bg-white/10 text-white focus:border-white/60 focus:ring-white/20 placeholder:text-white/50',
          !isLight && 'focus:border-primary-600 focus:ring-primary-200',
          className
        )}
        {...props}
      />
      {error && <p className={`text-sm ${isLight ? 'text-red-300' : 'text-red-500'} mt-1`}>{error}</p>}
      {helperText && !error && <p className={`text-sm ${helperClass} mt-1`}>{helperText}</p>}
    </div>
  )
}
