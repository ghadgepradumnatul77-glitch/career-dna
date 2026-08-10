export const formatScore = (score) => {
  if (score === undefined || score === null) return '0'
  return Math.round(Number(score)).toString()
}

export const getScoreColor = (score) => {
  const s = Number(score) || 0
  if (s >= 80) return 'var(--color-success)'
  if (s >= 65) return 'var(--color-accent)'
  if (s >= 50) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

export const getPriorityBadgeClass = (priority) => {
  switch ((priority || '').toUpperCase()) {
    case 'CRITICAL':
      return 'badge-danger'
    case 'HIGH':
      return 'badge-warning'
    case 'MEDIUM':
      return 'badge-indigo'
    case 'LOW':
    default:
      return 'badge-cyan'
  }
}

export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const formatDate = (isoString) => {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (e) {
    return isoString
  }
}
