import React, { forwardRef, useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { cn, formatTime, validateTime } from '@/utils'

interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helpText?: string
  format24?: boolean
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(({
  label,
  error,
  helpText,
  format24 = true,
  className,
  required,
  onChange,
  value,
  ...props
}, ref) => {
  const [displayValue, setDisplayValue] = useState(value || '')
  const [inputError, setInputError] = useState('')
  const inputId = props.id || `time-${Math.random().toString(36).substr(2, 9)}`

  useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue(value || '')
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setDisplayValue(newValue)
    setInputError('')

    if (newValue && !validateTime(newValue)) {
      setInputError('Please enter a valid time (HH:MM)')
      return
    }

    const formattedValue = formatTime(newValue)
    
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
        },
      }
      onChange(syntheticEvent)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedValue = formatTime(displayValue)
    setDisplayValue(formattedValue)
    
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  const currentTime = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const setCurrentTime = () => {
    const time = currentTime()
    setDisplayValue(time)
    
    if (onChange) {
      const syntheticEvent = {
        target: { value: time },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }

  const finalError = error || inputError

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={cn('form-label', required && 'form-label-required')}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type="text"
          id={inputId}
          placeholder={format24 ? 'HH:MM (24-hour)' : 'HH:MM'}
          className={cn(
            'form-input pr-20',
            finalError && 'form-input-error',
            className
          )}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={finalError ? 'true' : 'false'}
          aria-describedby={
            finalError ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          required={required}
          {...props}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-2 py-1 text-xs text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded mr-1"
            title="Set current time"
          >
            Now
          </button>
          <div className="pr-3 flex items-center pointer-events-none">
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      {finalError && (
        <p id={`${inputId}-error`} className="form-error" role="alert">
          {finalError}
        </p>
      )}
      
      {helpText && !finalError && (
        <p id={`${inputId}-help`} className="form-help">
          {helpText}
        </p>
      )}
    </div>
  )
})

TimePicker.displayName = 'TimePicker'

export default TimePicker