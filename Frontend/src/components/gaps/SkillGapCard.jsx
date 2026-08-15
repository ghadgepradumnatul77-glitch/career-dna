import React from 'react'
import { AlertCircle, TrendingUp } from 'lucide-react'
import GapPriority from './GapPriority'
import { getScoreColor } from '../../utils/formatters'

export const SkillGapCard = ({ gap }) => {
  const currentLevel = gap.current_level || 0
  const requiredLevel = gap.required_level || 80
  const gapSize = gap.gap_size || requiredLevel - currentLevel

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3.5)',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            {gap.category || 'Skill Gap'}
          </span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>
            {gap.skill}
          </h3>
        </div>
        <GapPriority priority={gap.priority} />
      </div>

      {/* Comparison Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {/* Current Level */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Demonstrated Level:</span>
            <span style={{ fontWeight: 700, color: getScoreColor(currentLevel), fontFamily: 'var(--font-mono)' }}>
              {currentLevel} / 100
            </span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${currentLevel}%`, background: getScoreColor(currentLevel), borderRadius: 'var(--radius-full)' }} />
          </div>
        </div>

        {/* Required Target Level */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Target Role Requirement:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-accent-light)', fontFamily: 'var(--font-mono)' }}>
              {requiredLevel} / 100
            </span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${requiredLevel}%`, background: 'var(--color-accent-light)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </div>
      </div>

      {/* Gap Delta Metric & Reason */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.6rem 0.85rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--color-danger)',
            fontSize: '0.8rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}
        >
          -{gapSize} pts
        </div>
        <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
          {gap.reason}
        </p>
      </div>
    </div>
  )
}

export default SkillGapCard
