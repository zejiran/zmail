import { FROZEN_NOW } from './constants'

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = FROZEN_NOW

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isToday) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes} ${ampm}`
  }

  if (date.getFullYear() === now.getFullYear()) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = months[date.getMonth()]
    const day = date.getDate()
    return `${month} ${day}`
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = FROZEN_NOW
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const dayName = days[date.getDay()]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')

  // Calculate relative time
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  let relativeTime = ''
  if (diffHours < 1) {
    relativeTime = '(1 hour ago)'
  } else if (diffHours < 24) {
    relativeTime = `(${diffHours} hours ago)`
  } else if (diffDays === 1) {
    relativeTime = '(1 day ago)'
  } else if (diffDays < 7) {
    relativeTime = `(${diffDays} days ago)`
  } else {
    const diffWeeks = Math.floor(diffDays / 7)
    relativeTime = diffWeeks === 1 ? '(1 week ago)' : `(${diffWeeks} weeks ago)`
  }

  return `${dayName}, ${month} ${day}, ${displayHours}:${displayMinutes} ${ampm} ${relativeTime}`
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${displayHours}:${displayMinutes} ${ampm}`
}
