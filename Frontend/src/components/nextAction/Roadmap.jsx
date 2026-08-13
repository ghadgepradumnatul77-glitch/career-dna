import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock, ExternalLink, MapPin } from 'lucide-react'

export const Roadmap = ({ steps = [] }) => {
  const [completedSteps, setCompletedSteps] = useState({})

  const toggleStep = (stepNum) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }))
  }

  if (!steps || steps.length === 0) return null

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6) var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <MapPin size={22} style={{ color: 'var(--color-accent)' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text-main)' }}>
              Execution Roadmap
            </h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
              Sequential milestones to close critical career gaps
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative' }}>
        {steps.map((stepItem, index) => {
          const stepNum = stepItem.step || index + 1
          const isDone = completedSteps[stepNum]

          return (
            <motion.div
              key={stepNum}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                transition: 'all var(--transition-normal)'
              }}
              whileHover={{ borderColor: 'rgba(255, 85, 0, 0.3)' }}
            >
              {/* Step Checkbox Circle */}
              <button
                onClick={() => toggleStep(stepNum)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  alignSelf: 'flex-start',
                  color: isDone ? 'var(--color-success)' : 'var(--color-accent)'
                }}
                aria-label={`Toggle Step ${stepNum}`}
              >
                {isDone ? <CheckCircle2 size={26} /> : <Circle size={26} />}
              </button>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: 'var(--color-accent)',
                        background: 'rgba(255, 85, 0, 0.15)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      STEP {stepNum}
                    </span>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '1.05rem',
                        color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}
                    >
                      {stepItem.title}
                    </h4>
                  </div>

                  {stepItem.estimatedHours && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> ~{stepItem.estimatedHours}h
                    </span>
                  )}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: '1.55'
                  }}
                >
                  {stepItem.description}
                </p>

                {stepItem.resources && stepItem.resources.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {stepItem.resources.map((res, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-dim)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--color-border)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <ExternalLink size={11} /> {res}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Roadmap
