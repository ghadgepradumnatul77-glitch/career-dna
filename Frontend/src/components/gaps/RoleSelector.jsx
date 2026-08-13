import React from 'react'
import { Target, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const RoleSelector = ({ compact = false }) => {
  const { user, updateTargetRole } = useApp()
  const roles = ['AI/ML Engineer', 'Software Engineer', 'Data Scientist']

  if (compact) {
    return (
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-primary-light)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <Target size={14} />
          <select
            value={user.targetRole}
            onChange={(e) => updateTargetRole(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-main)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              paddingRight: '1rem',
              appearance: 'none',
              WebkitAppearance: 'none'
            }}
          >
            {roles.map((r) => (
              <option key={r} value={r} style={{ background: '#111827', color: '#FFF' }}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: '0.5rem', pointerEvents: 'none' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {roles.map((role) => {
        const active = user.targetRole === role
        return (
          <button
            key={role}
            onClick={() => updateTargetRole(role)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: active
                ? 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)'
                : 'var(--color-surface)',
              color: active ? '#FFFFFF' : 'var(--color-text-muted)',
              border: active ? 'none' : '1px solid var(--color-border)',
              boxShadow: active ? '0 4px 15px rgba(6, 182, 212, 0.3)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Target size={16} />
            <span>{role}</span>
          </button>
        )
      })}
    </div>
  )
}

export default RoleSelector
