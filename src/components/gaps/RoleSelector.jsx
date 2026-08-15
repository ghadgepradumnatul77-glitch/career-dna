import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Target,
  Brain,
  Terminal,
  Database,
  ChevronDown,
  Check
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const RoleSelector = ({ compact = false }) => {
  const { user, updateTargetRole } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const selectorRef = useRef(null)

  const careerPaths = [
    {
      id: 'AI/ML Engineer',
      title: 'AI/ML Engineer',
      subtitle: 'Data & Neural Models',
      icon: Brain,
      color: '#A855F7'
    },
    {
      id: 'Software Engineer',
      title: 'Software Engineer',
      subtitle: 'Systems & Architecture',
      icon: Terminal,
      color: '#38BDF8'
    },
    {
      id: 'Data Scientist',
      title: 'Data Scientist',
      subtitle: 'Pipelines & Insights',
      icon: Database,
      color: '#FF7700'
    }
  ]

  const currentPath =
    careerPaths.find((p) => p.id === user.targetRole) || careerPaths[0]
  const CurrentIcon = currentPath.icon

  // Click outside and Escape key handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelectRole = (roleId) => {
    updateTargetRole(roleId)
    setIsOpen(false)
  }

  if (compact) {
    return (
      <div className="career-path-switcher" ref={selectorRef}>
        <button
          type="button"
          className={`career-path-btn ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsOpen(!isOpen)
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Current Career Path: ${currentPath.title}. Click to switch role.`}
        >
          {/* Subtle Accent Glow Dot & Icon */}
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(139, 92, 246, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-purple-light)',
              flexShrink: 0
            }}
          >
            <CurrentIcon size={12} />
          </div>

          {/* Label prefix (hidden on small viewports) */}
          <span className="career-path-prefix">
            Career Path
            <span style={{ opacity: 0.45, margin: '0 1px' }}>•</span>
          </span>

          {/* Current Role Name */}
          <span className="career-path-value">
            {currentPath.title}
          </span>

          {/* Tiny Animated Chevron */}
          <ChevronDown
            size={13}
            style={{
              color: 'var(--color-text-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
              marginLeft: '2px'
            }}
          />
        </button>

        {/* Premium Dark Glass Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="career-path-dropdown"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              role="listbox"
              aria-label="Select Career Path"
            >
              {/* Header Label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.35rem 0.55rem 0.45rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '0.35rem'
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: 'var(--color-text-dim)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}
                >
                  CAREER PATH
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: 'var(--color-purple-light)',
                    background: 'rgba(139, 92, 246, 0.15)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}
                >
                  Active Target
                </span>
              </div>

              {/* Career Path Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {careerPaths.map((path) => {
                  const isSelected = user.targetRole === path.id
                  const PathIcon = path.icon

                  return (
                    <div
                      key={path.id}
                      onClick={() => handleSelectRole(path.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background: isSelected
                          ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.22) 0%, rgba(59, 130, 246, 0.08) 100%)'
                          : 'transparent',
                        border: isSelected
                          ? '1px solid rgba(139, 92, 246, 0.45)'
                          : '1px solid transparent',
                        transition: 'all 150ms ease'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'transparent'
                        }
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: 'var(--radius-sm)',
                            background: isSelected
                              ? 'rgba(139, 92, 246, 0.25)'
                              : 'rgba(255, 255, 255, 0.04)',
                            border: `1px solid ${
                              isSelected
                                ? 'rgba(139, 92, 246, 0.5)'
                                : 'rgba(255, 255, 255, 0.08)'
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isSelected ? 'var(--color-purple-light)' : 'var(--color-text-dim)'
                          }}
                        >
                          <PathIcon size={15} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            style={{
                              fontSize: '0.825rem',
                              fontWeight: isSelected ? 700 : 600,
                              color: isSelected ? '#FFFFFF' : 'var(--color-text-muted)'
                            }}
                          >
                            {path.title}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              color: isSelected ? 'var(--color-purple-light)' : 'var(--color-text-dim)'
                            }}
                          >
                            {path.subtitle}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'rgba(139, 92, 246, 0.25)',
                            border: '1px solid var(--color-purple-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Check size={11} style={{ color: 'var(--color-purple-light)' }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Non-compact role tabs (for Skill Gaps & Next Action pages)
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {careerPaths.map((role) => {
        const active = user.targetRole === role.id
        const RoleIcon = role.icon
        return (
          <button
            key={role.id}
            onClick={() => updateTargetRole(role.id)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: active
                ? 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)'
                : 'var(--color-surface)',
              color: active ? '#FFFFFF' : 'var(--color-text-muted)',
              border: active ? 'none' : '1px solid var(--color-border)',
              boxShadow: active ? '0 4px 15px rgba(6, 182, 212, 0.3)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <RoleIcon size={16} />
            <span>{role.title}</span>
          </button>
        )
      })}
    </div>
  )
}

export default RoleSelector
