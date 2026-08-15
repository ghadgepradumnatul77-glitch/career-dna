import React from 'react'
import { Loader2 } from 'lucide-react'

export const LoadingSpinner = ({ label = 'Loading Career Intelligence...', size = 32 }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-6)',
        gap: 'var(--space-4)',
        width: '100%',
        minHeight: '200px'
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: size + 16,
            height: size + 16,
            borderRadius: '50%',
            border: '2px stroke rgba(6, 182, 212, 0.2)',
            animation: 'pulseGlow 2s infinite'
          }}
        />
        <Loader2 size={size} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      </div>
      {label && (
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500, margin: 0 }}>
          {label}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner
