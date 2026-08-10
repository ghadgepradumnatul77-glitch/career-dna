import React from 'react'
import { motion } from 'framer-motion'
import { Award, CheckCircle2 } from 'lucide-react'
import CountUp from '../common/CountUp'

export const ReadinessScore = ({ score = 82, status = 'Strong Foundation', targetRole = 'AI/ML Engineer' }) => {
  const radiusInner = 64
  const radiusOuter = 76
  const strokeWidth = 8

  const circumferenceInner = 2 * Math.PI * radiusInner
  const strokeDashoffsetInner = circumferenceInner - (score / 100) * circumferenceInner

  const circumferenceOuter = 2 * Math.PI * radiusOuter
  const strokeDashoffsetOuter = circumferenceOuter - (score / 100) * circumferenceOuter

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-panel"
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: 'var(--shadow-glow-purple)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          alignSelf: 'flex-start',
          marginBottom: 'var(--space-4)'
        }}
      >
        <Award size={18} style={{ color: 'var(--color-purple-light)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Career Readiness Index
        </span>
      </div>

      {/* Double Concentric Glowing Radial Gauge */}
      <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Background Outer Ring */}
          <circle cx="90" cy="90" r={radiusOuter} stroke="rgba(255, 255, 255, 0.05)" strokeWidth={strokeWidth} fill="transparent" />
          {/* Animated Cyan Outer Ring */}
          <motion.circle
            cx="90"
            cy="90"
            r={radiusOuter}
            stroke="url(#cyanGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumferenceOuter}
            initial={{ strokeDashoffset: circumferenceOuter }}
            animate={{ strokeDashoffset: strokeDashoffsetOuter }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))' }}
          />

          {/* Background Inner Ring */}
          <circle cx="90" cy="90" r={radiusInner} stroke="rgba(255, 255, 255, 0.05)" strokeWidth={strokeWidth} fill="transparent" />
          {/* Animated Purple Inner Ring */}
          <motion.circle
            cx="90"
            cy="90"
            r={radiusInner}
            stroke="url(#purpleGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumferenceInner}
            initial={{ strokeDashoffset: circumferenceInner }}
            animate={{ strokeDashoffset: strokeDashoffsetInner }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.6))' }}
          />
        </svg>

        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: '2.85rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
            <CountUp end={score} duration={1400} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 700, marginTop: '2px' }}>/ 100</div>
        </div>
      </div>

      {/* Status Badge */}
      <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
        <div
          className="badge badge-purple"
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.825rem',
            letterSpacing: '0.04em',
            marginBottom: '0.5rem'
          }}
        >
          <CheckCircle2 size={14} />
          {status}
        </div>
        <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
          Assessed for <strong style={{ color: '#FFF' }}>{targetRole}</strong>
        </p>
      </div>
    </motion.div>
  )
}

export default ReadinessScore
