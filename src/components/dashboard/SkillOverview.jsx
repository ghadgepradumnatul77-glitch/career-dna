import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, ChevronRight, ShieldCheck, HelpCircle } from 'lucide-react'

export const SkillOverview = ({ skills = [] }) => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [showTooltip, setShowTooltip] = useState(false)

  const categories = ['ALL', ...new Set(skills.map((s) => s.category || 'General'))]

  const filteredSkills =
    selectedCategory === 'ALL'
      ? skills
      : skills.filter((s) => (s.category || 'General') === selectedCategory)

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 85, 0, 0.12)',
              border: '1px solid rgba(255, 85, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)'
            }}
          >
            <Layers size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-text-main)' }}>
                Demonstrated Skill Matrix
              </h3>
              <div
                style={{ position: 'relative', cursor: 'pointer' }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HelpCircle size={15} style={{ color: 'var(--color-text-dim)' }} />
                {showTooltip && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-60px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(18, 24, 36, 0.95)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      width: '240px',
                      zIndex: 20,
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    <strong>Proficiency</strong> = Demonstrated capability.
                    <br />
                    <strong>Confidence</strong> = Depth of code & repo receipts.
                  </div>
                )}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Demonstrated Proficiency vs Evidence Confidence
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: selectedCategory === cat ? 'rgba(255, 85, 0, 0.2)' : 'transparent',
                color: selectedCategory === cat ? 'var(--color-accent)' : 'var(--color-text-dim)',
                border: `1px solid ${selectedCategory === cat ? 'rgba(255, 85, 0, 0.4)' : 'var(--color-border)'}`,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills List with Framer Motion Stagger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: '0.5rem' }}>
        {filteredSkills.map((skill, index) => {
          return (
            <motion.div
              key={skill.skill_id || skill.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => navigate(`/evidence/${skill.skill_id || skill.name.toLowerCase()}`)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 85, 0, 0.04)', borderColor: 'rgba(255, 85, 0, 0.3)' }}
            >
              <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                    {skill.name}
                  </span>
                  {skill.category && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', background: 'rgba(255, 255, 255, 0.05)', padding: '1px 6px', borderRadius: '4px' }}>
                      {skill.category}
                    </span>
                  )}
                </div>
                {/* Visual Animated Bar */}
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      backgroundColor: 'var(--color-accent)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  />
                </div>
              </div>

              {/* Proficiency Score */}
              <div style={{ textAlign: 'right', minWidth: '70px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                  {skill.proficiency}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}> / 100</span>
              </div>

              {/* Evidence Confidence Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.6rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  color: 'var(--color-success)',
                  fontWeight: 700
                }}
              >
                <ShieldCheck size={13} />
                <span>{skill.confidence || 85}% Conf.</span>
              </div>

              <ChevronRight size={18} style={{ color: 'var(--color-text-dim)' }} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default SkillOverview
