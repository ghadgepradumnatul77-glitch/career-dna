import React from 'react'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../common/Card'

export const Weaknesses = ({ weaknesses = [] }) => {
  return (
    <Card
      title="Skill Gaps & Weaknesses"
      icon={AlertTriangle}
      action={
        <Link
          to="/gaps"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.8rem',
            color: 'var(--color-accent-light)',
            fontWeight: 600
          }}
        >
          View Gaps <ArrowRight size={14} />
        </Link>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2.5)' }}>
        {weaknesses.map((weak, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              padding: '0.6rem 0.75rem',
              background: 'rgba(245, 158, 11, 0.06)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <AlertTriangle size={16} style={{ color: 'var(--color-warning)', marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
              {weak}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default Weaknesses
