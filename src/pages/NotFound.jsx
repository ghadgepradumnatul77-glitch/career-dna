import React from 'react'
import { Link } from 'react-router-dom'
import { Dna, ArrowLeft } from 'lucide-react'
import Button from '../components/common/Button'

export const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-6)',
        gap: 'var(--space-4)'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-danger)'
        }}
      >
        <Dna size={32} />
      </div>

      <h1 style={{ fontSize: '3rem', margin: 0, fontFamily: 'var(--font-mono)' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-main)' }}>
        Page Sequence Not Found
      </h2>
      <p style={{ maxWidth: '400px', color: 'var(--color-text-muted)', margin: 0 }}>
        The requested route sequence does not exist in Career DNA.
      </p>

      <Link to="/dashboard" style={{ textDecoration: 'none', marginTop: 'var(--space-4)' }}>
        <Button variant="primary" icon={ArrowLeft}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
