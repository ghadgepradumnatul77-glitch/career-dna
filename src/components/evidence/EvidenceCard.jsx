import React from 'react'
import { FileText, GitBranch, GitCommit, Code, FolderGit2, Calendar } from 'lucide-react'

export const EvidenceCard = ({ item }) => {
  const getSourceIcon = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'resume':
        return FileText
      case 'github repository':
      case 'repository':
        return FolderGit2
      case 'commit history':
      case 'commits':
        return GitCommit
      case 'code analysis':
      case 'code evidence':
        return Code
      default:
        return GitBranch
    }
  }

  const Icon = getSourceIcon(item.sourceType)

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4) var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2.5)',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-light)'
            }}
          >
            <Icon size={16} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              Source: {item.sourceType}
            </span>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
              {item.title}
            </h4>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {item.strength && (
            <span className={`badge ${item.strength === 'EXPERT' || item.strength === 'HIGH' ? 'badge-success' : 'badge-cyan'}`}>
              {item.strength}
            </span>
          )}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
        {item.description}
      </p>

      {item.date && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
          <Calendar size={13} />
          <span>Verified: {item.date}</span>
        </div>
      )}
    </div>
  )
}

export default EvidenceCard
