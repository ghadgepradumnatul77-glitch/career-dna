import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button'

export const ErrorMessage = ({
  title = 'Service Temporarily Unavailable',
  message = 'Career analysis service is temporarily unavailable. Please try again.',
  onRetry,
  retryLabel = 'Try Again'
}) => {
  return (
    <div
      style={{
        background: 'var(--color-danger-bg)',
        border: '1px solid var(--color-danger-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--space-3)',
        maxWidth: '520px',
        margin: 'var(--space-6) auto'
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-danger)'
        }}
      >
        <AlertTriangle size={24} />
      </div>
      <h4 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.1rem' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry} style={{ marginTop: 'var(--space-2)' }}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export default ErrorMessage
