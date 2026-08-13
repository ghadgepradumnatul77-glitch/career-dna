import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Target, TrendingUp, Clock, HelpCircle } from 'lucide-react'

export const ActionCard = ({ nextAction }) => {
  if (!nextAction) return null

  // Support array of actions or single action object
  const actionObj = Array.isArray(nextAction) ? nextAction[0] : nextAction
  if (!actionObj) return null

  const title = actionObj.title || actionObj.action || actionObj.skill || 'Recommended Action Plan'
  const reasoning = actionObj.description || actionObj.reasoning || actionObj.reason || 'High impact project recommendation to close target skill gap.'
  const expectedImpact = actionObj.expected_impact || (actionObj.success_criteria ? actionObj.success_criteria.join(' • ') : 'Significant improvement in target skill readiness.')
  const estimatedEffort = actionObj.estimated_effort || (actionObj.estimated_effort_hours ? `${actionObj.estimated_effort_hours} hours` : null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'linear-gradient(135deg, rgba(18, 24, 36, 0.98) 0%, rgba(12, 16, 25, 0.98) 100%)',
        border: '1px solid var(--color-border-active)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        boxShadow: 'var(--shadow-glow-orange)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glow Ambient Effect */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(255, 85, 0, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="badge badge-orange" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
          <Zap size={14} />
          Highest Impact Priority Action
        </div>
        {estimatedEffort && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)'
            }}
          >
            <Clock size={14} />
            <span>Est. Effort: {estimatedEffort}</span>
          </div>
        )}
      </div>

      <h2 style={{ fontSize: 'clamp(1.35rem, 2.8vw, 1.95rem)', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 'var(--space-6)', lineHeight: 1.25 }}>
        {title}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Why this action? */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2.5)' }}>
            <HelpCircle size={18} style={{ color: 'var(--color-accent)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-main)', letterSpacing: '0.04em' }}>
              WHY THIS ACTION?
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            {reasoning}
          </p>
        </div>

        {/* Expected Impact */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.04)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2.5)' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-success)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-success)', letterSpacing: '0.04em' }}>
              EXPECTED IMPACT & CRITERIA
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: '1.6' }}>
            {expectedImpact}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ActionCard
