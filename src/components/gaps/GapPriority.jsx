import React from 'react'
import { getPriorityBadgeClass } from '../../utils/formatters'

export const GapPriority = ({ priority = 'MEDIUM' }) => {
  const badgeClass = getPriorityBadgeClass(priority)
  return <span className={`badge ${badgeClass}`}>{priority}</span>
}

export default GapPriority
