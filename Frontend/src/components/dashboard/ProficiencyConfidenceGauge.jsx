import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Info } from 'lucide-react'

export const ProficiencyConfidenceGauge = ({ proficiency = 86, confidence = 91 }) => {
  return (
    <div className="glass-panel" style={{ padding: 'var(--space-6)', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>EVIDENCE METRICS</span>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#FFF' }}>Proficiency vs. Confidence</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        {/* Overlapping Concentric Meters */}
        <div style={{ position: 'relative', width: '200px', height: '140px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer Ring - Confidence (Electric Cyan/Blue) */}
          <div
            style={{
              position: 'absolute',
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              border: '10px solid rgba(56, 189, 248, 0.15)',
              borderTopColor: '#38BDF8',
              borderRightColor: '#06B6D4',
              transform: 'rotate(-45deg)',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.3)'
            }}
          />

          {/* Overlapping Inner Ring - Proficiency (Electric Purple) */}
          <div
            style={{
              position: 'absolute',
              width: '94px',
              height: '94px',
              borderRadius: '50%',
              border: '10px solid rgba(168, 85, 247, 0.15)',
              borderTopColor: '#A855F7',
              borderLeftColor: '#8B5CF6',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {proficiency}%
            </span>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', fontWeight: 700 }}>PROFICIENCY</div>
          </div>
        </div>

        {/* Explainability Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFF' }}>Proficiency: {proficiency}%</span>
              <Zap size={14} style={{ color: 'var(--color-purple-light)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              <strong style={{ color: '#FFF' }}>Demonstrated ability:</strong> Skill score derived from static analysis of code complexity, algorithmic logic & OOP structure.
            </p>
          </div>

          <div style={{ padding: '0.75rem 1rem', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFF' }}>Evidence Confidence: {confidence}%</span>
              <ShieldCheck size={14} style={{ color: 'var(--color-blue-light)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              <strong style={{ color: '#FFF' }}>Strength & completeness:</strong> Calculated cross-verification score matching GitHub AST code against resume claims.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProficiencyConfidenceGauge
