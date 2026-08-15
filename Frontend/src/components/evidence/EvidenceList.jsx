import React from 'react'
import EvidenceCard from './EvidenceCard'

export const EvidenceList = ({ sources = [] }) => {
  if (!sources || sources.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        No evidence sources found for this skill.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {sources.map((item, index) => (
        <EvidenceCard key={item.id || index} item={item} />
      ))}
    </div>
  )
}

export default EvidenceList
