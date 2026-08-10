import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'

export const CareerSummary = ({ summary, role }) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF5500', '#FF7722', '#10B981']
    })
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.12) 0%, rgba(18, 24, 36, 0.95) 100%)',
        border: '1px solid rgba(255, 85, 0, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        position: 'relative',
        boxShadow: 'var(--shadow-glow-orange)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--color-accent)' }} />
          <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-text-main)' }}>
            Career DNA Synthesis
          </h3>
        </div>
        <span className="badge badge-orange">Evidence Verified</span>
      </div>

      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--color-text-main)',
          lineHeight: '1.65',
          marginBottom: 'var(--space-4)'
        }}
      >
        "{summary}"
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link
          to="/next-action"
          onClick={triggerConfetti}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.1rem',
            background: 'var(--color-accent)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(255, 85, 0, 0.35)'
          }}
        >
          View Recommended Next Action <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

export default CareerSummary
