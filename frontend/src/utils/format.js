export const formatNumber = (value = 0) =>
  new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(value)

export const formatDate = (dateInput) => {
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('')
}
