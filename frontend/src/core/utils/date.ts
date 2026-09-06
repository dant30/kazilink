export function formatRelativeTime(value?: string) {
  if (!value) return 'Recently'
  const timestamp = new Date(value).getTime()
  if (Number.isNaN(timestamp)) return 'Recently'
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))
  if (elapsedSeconds < 60) return 'Just now'
  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  if (elapsedMinutes < 60) return `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`
  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours} hour${elapsedHours === 1 ? '' : 's'} ago`
  const elapsedDays = Math.floor(elapsedHours / 24)
  if (elapsedDays < 7) return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`
  const elapsedWeeks = Math.floor(elapsedDays / 7)
  if (elapsedWeeks < 5) return `${elapsedWeeks} week${elapsedWeeks === 1 ? '' : 's'} ago`
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(timestamp))
}