import React, { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Dna,
  ShieldCheck,
  Sparkles,
  Code2,
  Target,
  Zap
} from 'lucide-react'

export const CareerIntelligenceVisual = () => {
  const [hoveredMilestone, setHoveredMilestone] = useState(null)
  const [isCoreHovered, setIsCoreHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  // Subtle mouse parallax movement on desktop (1-2% max)
  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  // Smooth Journey Path Coordinates (ViewBox: 600 x 520)
  const center = { x: 310, y: 265 }

  const milestones = [
    {
      id: 'evidence',
      step: '01',
      label: 'Evidence',
      tag: 'Verified Proof',
      icon: ShieldCheck,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.4)',
      x: 110,
      y: 90,
      labelAlign: 'left',
      delay: 0
    },
    {
      id: 'skills',
      step: '02',
      label: 'Skills',
      tag: 'Demonstrated AST',
      icon: Sparkles,
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.4)',
      x: 265,
      y: 155,
      labelAlign: 'top',
      delay: 0.8
    },
    {
      id: 'projects',
      step: '03',
      label: 'Projects',
      tag: 'Production Code',
      icon: Code2,
      color: '#10B981',
      glow: 'rgba(16, 185, 129, 0.4)',
      x: 485,
      y: 320,
      labelAlign: 'right',
      delay: 1.6
    },
    {
      id: 'career',
      step: '04',
      label: 'Career',
      tag: 'Target Benchmark',
      icon: Target,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.4)',
      x: 320,
      y: 425,
      labelAlign: 'bottom-left',
      delay: 2.4
    },
    {
      id: 'growth',
      step: '05',
      label: 'Growth',
      tag: 'Next Best Action',
      icon: Zap,
      color: '#FF5500',
      glow: 'rgba(255, 85, 0, 0.4)',
      x: 485,
      y: 465,
      labelAlign: 'right',
      delay: 3.2
    }
  ]

  // Continuous organic flowing SVG bezier path
  const journeyPathD = `
    M 110 90
    C 175 90, 215 135, 265 155
    C 305 170, 290 230, 310 265
    C 340 300, 435 285, 485 320
    C 525 350, 390 395, 320 425
    C 270 450, 420 465, 485 465
  `

  const parallaxOffset = {
    x: mousePos.x * 5,
    y: mousePos.y * 5
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        aspectRatio: '600 / 520',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        perspective: 1000
      }}
    >
      {/* Controlled Atmospheric Ambient Glow */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: hoveredMilestone || isCoreHovered ? 1.04 : [0.96, 1.02, 0.96],
                opacity: hoveredMilestone || isCoreHovered ? 0.4 : [0.22, 0.32, 0.22]
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: hoveredMilestone
            ? `radial-gradient(circle, ${milestones.find((m) => m.id === hoveredMilestone)?.glow} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(59, 130, 246, 0.12) 40%, transparent 75%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
        }}
      />

      {/* SVG Flowing Journey Path & Milestone Connections */}
      <svg
        viewBox="0 0 600 520"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <defs>
          {/* Path Flow Gradient */}
          <linearGradient id="journeyFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#A855F7" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#C084FC" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#10B981" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0.9" />
          </linearGradient>

          {/* Faint Base Gradient */}
          <linearGradient id="journeyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="30%" stopColor="#A855F7" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Faint Ambient Orbit Guides */}
        <circle
          cx={center.x}
          cy={center.y}
          r="140"
          fill="none"
          stroke="rgba(139, 92, 246, 0.1)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx={center.x}
          cy={center.y}
          r="80"
          fill="none"
          stroke="rgba(56, 189, 248, 0.08)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        {/* Base Continuous Journey Path Line */}
        <path
          d={journeyPathD}
          fill="none"
          stroke="url(#journeyBaseGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Animated Flowing Glow Journey Path */}
        {!shouldReduceMotion && (
          <motion.path
            d={journeyPathD}
            fill="none"
            stroke="url(#journeyFlowGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="16 32"
            animate={{ strokeDashoffset: [-96, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.5))'
            }}
          />
        )}

        {/* Active Hover Glow Path */}
        {hoveredMilestone && (
          <path
            d={journeyPathD}
            fill="none"
            stroke={milestones.find((m) => m.id === hoveredMilestone)?.color || '#A855F7'}
            strokeWidth="3.2"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${milestones.find((m) => m.id === hoveredMilestone)?.color})`,
              opacity: 0.6,
              transition: 'all 0.3s ease'
            }}
          />
        )}

        {/* Traveling Energy Pulse Node along the Journey */}
        {!shouldReduceMotion && (
          <motion.circle
            r="3.5"
            fill="#FFFFFF"
            style={{
              filter: 'drop-shadow(0 0 8px #C084FC)'
            }}
            animate={{
              cx: [110, 265, 310, 485, 320, 485],
              cy: [90, 155, 265, 320, 425, 465],
              opacity: [0.3, 0.95, 0.8, 0.95, 0.85, 0.9]
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </svg>

      {/* CENTRAL CORE: ELEGANT CAREER DNA INTELLIGENCE HUB */}
      <motion.div
        onMouseEnter={() => setIsCoreHovered(true)}
        onMouseLeave={() => setIsCoreHovered(false)}
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: isCoreHovered ? 1.04 : [0.98, 1.015, 0.98],
                y: parallaxOffset.y,
                x: parallaxOffset.x
              }
        }
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: `${(center.x / 600) * 100}%`,
          top: `${(center.y / 520) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '124px',
          height: '124px',
          borderRadius: '50%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 35%, rgba(18, 22, 50, 0.94) 0%, rgba(6, 8, 20, 0.98) 80%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isCoreHovered
            ? '1.5px solid rgba(168, 85, 247, 0.7)'
            : '1.2px solid rgba(168, 85, 247, 0.45)',
          boxShadow: isCoreHovered
            ? '0 0 28px rgba(168, 85, 247, 0.45), inset 0 0 16px rgba(139, 92, 246, 0.3)'
            : '0 0 20px rgba(139, 92, 246, 0.25), inset 0 0 12px rgba(139, 92, 246, 0.15)',
          cursor: 'default',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Core Icon Mark */}
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.28) 0%, rgba(255, 85, 0, 0.2) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '3px',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.35)'
          }}
        >
          <Dna size={18} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.7))' }} />
        </div>

        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.09em',
            lineHeight: 1.1
          }}
        >
          CAREER DNA
        </span>
        <span
          style={{
            fontSize: '0.54rem',
            fontWeight: 700,
            color: 'var(--color-purple-light)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginTop: '2px'
          }}
        >
          Neural Core
        </span>
      </motion.div>

      {/* 5 GLOWING JOURNEY MILESTONE NODES (MINIMAL, NON-CARD) */}
      {milestones.map((m) => {
        const Icon = m.icon
        const isHovered = hoveredMilestone === m.id
        const isAnyHovered = Boolean(hoveredMilestone)

        return (
          <motion.div
            key={m.id}
            onMouseEnter={() => setHoveredMilestone(m.id)}
            onMouseLeave={() => setHoveredMilestone(null)}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: isHovered ? 0 : [0, -3, 0],
                    scale: isHovered ? 1.05 : 1
                  }
            }
            transition={{
              y: { duration: 4 + m.delay, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              left: `${(m.x / 600) * 100}%`,
              top: `${(m.y / 520) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              flexDirection: m.labelAlign === 'right' ? 'row' : m.labelAlign === 'left' ? 'row-reverse' : 'row'
            }}
          >
            {/* Minimal Glowing Milestone Node Circle */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isHovered ? 'rgba(20, 26, 56, 0.95)' : 'rgba(10, 14, 30, 0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isHovered ? `1.5px solid ${m.color}` : `1.2px solid ${m.color}88`,
                boxShadow: isHovered
                  ? `0 0 18px ${m.color}77, inset 0 0 8px ${m.color}44`
                  : `0 0 10px ${m.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: m.color,
                transition: 'all 0.25s ease',
                flexShrink: 0
              }}
            >
              <Icon size={15} style={{ filter: isHovered ? `drop-shadow(0 0 4px ${m.color})` : 'none' }} />
            </div>

            {/* Clean Minimal Typography Label */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.labelAlign === 'left' ? 'flex-end' : 'flex-start',
                opacity: isAnyHovered && !isHovered ? 0.5 : 1,
                transition: 'opacity 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: m.color,
                    lineHeight: 1
                  }}
                >
                  {m.step}
                </span>
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.92)',
                    lineHeight: 1,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  {m.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  color: isHovered ? m.color : 'var(--color-text-dim)',
                  lineHeight: 1.1,
                  marginTop: '2px',
                  transition: 'color 0.25s ease'
                }}
              >
                {m.tag}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default CareerIntelligenceVisual
