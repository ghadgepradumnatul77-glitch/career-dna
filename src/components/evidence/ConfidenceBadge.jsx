import React from 'react'
import { ShieldCheck, HelpCircle } from 'lucide-react'

export const ConfidenceBadge = ({ confidence = 91, label = 'Evidence Confidence' }) => {
  let color = 'var(--color-success)'
  if (confidence < 70) color = 'var(--color-warning)'
  if (confidence < 50) color = 'var(--color-danger)'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.5rem 1rem',
        background: 'rgba(17, 24, 39, 0.9)',
        border: `1px solid ${color}`,
        borderRadius: 'var(--radius-full)',
        boxShadow: `0 0 15px ${color}33`
      }}
    >
      <ShieldCheck size={18} style={{ color }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
          {label}
        </span>
        <span style={{ fontSize: '1rem', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>
          {confidence}%
        </span>
      </div>
    </div>
  )
}

export default ConfidenceBadge
