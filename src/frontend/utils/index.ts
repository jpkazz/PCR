import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string): string {
  if (!time) return ''
  
  // If already in HH:MM format, return as is
  if (time.match(/^\d{2}:\d{2}$/)) return time
  
  // If in HHMM format, add colon
  if (time.match(/^\d{4}$/)) {
    return `${time.slice(0, 2)}:${time.slice(2)}`
  }
  
  return time
}

export function validateTime(time: string): boolean {
  if (!time) return false
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

export function validateDate(date: string): boolean {
  if (!date) return false
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

export function validateEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false
  const phoneRegex = /^\+?[\d\s\-\(\)\.]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getCurrentTime(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

export function calculateAge(birthDate: string): string {
  if (!birthDate) return ''
  
  const birth = new Date(birthDate)
  const today = new Date()
  
  if (birth > today) return ''
  
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age.toString()
}

export function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

export function exportToJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export function importFromJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}

export const validationRules = {
  required: (value: any) => {
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
  },
  
  minLength: (min: number) => (value: string) => {
    return value.length >= min
  },
  
  maxLength: (max: number) => (value: string) => {
    return value.length <= max
  },
  
  pattern: (regex: RegExp) => (value: string) => {
    return regex.test(value)
  },
  
  number: (value: string) => {
    return !isNaN(Number(value))
  },
  
  range: (min: number, max: number) => (value: string | number) => {
    const num = typeof value === 'string' ? Number(value) : value
    return num >= min && num <= max
  }
}