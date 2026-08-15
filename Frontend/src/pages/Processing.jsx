import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Loader2,
  Circle,
  Dna,
  ShieldCheck,
  Terminal,
  Cpu
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'

export const Processing = () => {
  const navigate = useNavigate()
  const { runAnalysis, analysis, isMockMode, setIsMockMode } = useApp()
  const [retryCount, setRetryCount] = useState(0)

  const stages = [
    { id: 1, name: 'Resume parsing & text extraction', key: 'resume' },
    { id: 2, name: 'GitHub repository & AST commit analysis', key: 'github' },
    { id: 3, name: 'Mapping demonstrated skill matrix', key: 'skills' },
    { id: 4, name: 'Computing Career DNA readiness index', key: 'dna' },
    { id: 5, name: 'Evaluating target role skill gaps', key: 'gaps' },
    { id: 6, name: 'Synthesizing Next Best Action roadmap', key: 'next' }
  ]

  useEffect(() => {
    let isMounted = true

    const trigger = async () => {
      const res = await runAnalysis()
      if (res.success && isMounted) {
        setTimeout(() => {
          if (isMounted) navigate('/dashboard')
        }, 600)
      }
    }

    trigger()

    return () => {
      isMounted = false
    }
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const handleSwitchToMock = () => {
    setIsMockMode(true)
    setRetryCount((prev) => prev + 1)
  }

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
        maxWidth: '680px',
        margin: '0 auto'
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{
          width: '76px',
          height: '76px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--color-accent) 0%, #E64A00 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          marginBottom: 'var(--space-6)',
          boxShadow: 'var(--shadow-glow-orange)'
        }}
      >
        <Dna size={40} />
      </motion.div>

      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
        Building Your Career DNA
      </h2>
      <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        Synthesizing technical evidence from resume and GitHub repositories...
      </p>

      {/* Analysis Stages Progress List */}
      <div
        style={{
          width: '100%',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}
      >
        {stages.map((stage) => {
          const isDone = analysis.currentStage > stage.id || analysis.status === 'completed'
          const isCurrent = analysis.currentStage === stage.id && analysis.status === 'processing'
          const isPending = analysis.currentStage < stage.id && analysis.status !== 'completed'

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stage.id * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isCurrent ? 'rgba(255, 85, 0, 0.08)' : 'transparent',
                border: `1px solid ${isCurrent ? 'rgba(255, 85, 0, 0.3)' : 'transparent'}`,
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
                {isDone && <CheckCircle2 size={22} style={{ color: 'var(--color-success)' }} />}
                {isCurrent && <Loader2 size={22} className="animate-spin" style={{ color: 'var(--color-accent)' }} />}
                {isPending && <Circle size={20} style={{ color: 'var(--color-text-dim)' }} />}
              </div>

              <span
                style={{
                  fontSize: '0.925rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isDone
                    ? 'var(--color-text-main)'
                    : isCurrent
                    ? 'var(--color-accent)'
                    : 'var(--color-text-dim)'
                }}
              >
                {stage.name}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Error state & Recovery options */}
      {analysis.status === 'error' && (
        <div style={{ width: '100%' }}>
          <ErrorMessage
            title="Analysis Service Delay"
            message={analysis.error || 'Career analysis service is temporarily unavailable. Please try again.'}
            onRetry={handleRetry}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="outline" size="sm" onClick={handleSwitchToMock}>
              Continue in Standalone Demo Mode
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/setup')}>
              Back to Setup
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Processing
