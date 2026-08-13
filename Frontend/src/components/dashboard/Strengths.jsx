import React from 'react'
import { CheckCircle2, ShieldAlert } from 'lucide-react'
import Card from '../common/Card'

export const Strengths = ({ strengths = [] }) => {
  return (
    <Card title="Demonstrated Strengths" icon={CheckCircle2}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2.5)' }}>
        {strengths.map((str, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              padding: '0.6rem 0.75rem',
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <CheckCircle2 size={16} style={{ color: 'var(--color-success)', marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
              {str}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default Strengths
