import React, { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Dna,
  GraduationCap,
  ShieldCheck,
  Code2,
  Briefcase,
  TrendingUp
} from 'lucide-react'

export const CareerIntelligenceVisual = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null)
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

  // 5 Subtle Orbiting Career Points
  const points = [
    {
      id: 'learn',
      label: 'LEARN',
      tag: 'Build Skills',
      icon: GraduationCap,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.35)',
      top: '11%',
      left: '50%',
      delay: 0
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      tag: 'Prove It',
      icon: ShieldCheck,
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.35)',
      top: '32%',
      left: '16%',
      delay: 1.8
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      tag: 'Build & Ship',
      icon: Code2,
      color: '#00D2FF',
      glow: 'rgba(0, 210, 255, 0.35)',
      top: '32%',
      left: '84%',
      delay: 0.6
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      icon: TrendingUp,
      color: '#EC4899',
      glow: 'rgba(236, 72, 153, 0.35)',
      top: '74%',
      left: '23%',
      delay: 1.2
    },
    {
      id: 'career',
      label: 'CAREER',
      tag: 'Achieve Goals',
      icon: Briefcase,
      color: '#FF8800',
      glow: 'rgba(255, 136, 0, 0.35)',
      top: '74%',
      left: '77%',
      delay: 0.9
    }
  ]

  const parallaxOffset = {
    x: mousePos.x * 4,
    y: mousePos.y * 4
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        aspectRatio: '540 / 500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        perspective: 1000
      }}
    >
      {/* Deep Navy / Purple Atmospheric Center Aura (Calm & Non-glaring) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: hoveredPoint || isCoreHovered ? 1.04 : [0.97, 1.02, 0.97],
                opacity: hoveredPoint || isCoreHovered ? 0.3 : [0.15, 0.22, 0.15]
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: hoveredPoint
            ? `radial-gradient(circle, ${points.find((p) => p.id === hoveredPoint)?.glow} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 75%)',
          filter: 'blur(36px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(calc(-50% + ${parallaxOffset.x}px), calc(-50% + ${parallaxOffset.y}px))`
        }}
      />

      {/* ONE Continuous Subtle Orbital Path (Smooth Elliptical Flow) */}
      <svg
        viewBox="0 0 540 500"
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
          <linearGradient id="orbitFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="30%" stopColor="#A855F7" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#00D2FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF8800" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Faint Inner Core Orbit Guide */}
        <circle
          cx="270"
          cy="250"
          r="105"
          fill="none"
          stroke="rgba(139, 92, 246, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />

        {/* Outer Continuous Orbital Ellipse */}
        <ellipse
          cx="270"
          cy="250"
          rx="195"
          ry="170"
          fill="none"
          stroke="url(#orbitFlowGrad)"
          strokeWidth="1.2"
          strokeDasharray="6 8"
        />

        {/* Single Flowing Light Particle travelling along the orbit */}
        {!shouldReduceMotion && (
          <motion.circle
            r="2.5"
            fill="#FFFFFF"
            style={{
              filter: 'drop-shadow(0 0 5px #38BDF8)'
            }}
            animate={{
              cx: [270, 465, 270, 75, 270],
              cy: [80, 250, 420, 250, 80],
              opacity: [0.3, 0.9, 0.4, 0.9, 0.3]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </svg>

      {/* CENTRAL CORE: COMPACT LIVING INTELLIGENCE HUB */}
      <motion.div
        onMouseEnter={() => setIsCoreHovered(true)}
        onMouseLeave={() => setIsCoreHovered(false)}
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: isCoreHovered ? 1.03 : [0.985, 1.015, 0.985]
              }
        }
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${parallaxOffset.x}px), calc(-50% + ${parallaxOffset.y}px))`,
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 35%, rgba(16, 20, 44, 0.92) 0%, rgba(6, 8, 18, 0.96) 85%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: isCoreHovered
            ? '1.4px solid rgba(168, 85, 247, 0.7)'
            : '1.1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: isCoreHovered
            ? '0 0 24px rgba(139, 92, 246, 0.35), inset 0 0 14px rgba(139, 92, 246, 0.2)'
            : '0 0 16px rgba(139, 92, 246, 0.18), inset 0 0 10px rgba(139, 92, 246, 0.12)',
          cursor: 'default',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Core Icon Badge */}
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(56, 189, 248, 0.18) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '3px',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)'
          }}
        >
          <Dna size={18} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 5px rgba(168, 85, 247, 0.75))' }} />
        </div>

        <span
          style={{
            fontSize: '0.74rem',
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

      {/* 5 SUBTLE ORBITING POINTS (LUMINOUS POINT + CLEAN TYPOGRAPHY) */}
      {points.map((p) => {
        const Icon = p.icon
        const isHovered = hoveredPoint === p.id
        const isAnyHovered = Boolean(hoveredPoint)

        return (
          <motion.div
            key={p.id}
            onMouseEnter={() => setHoveredPoint(p.id)}
            onMouseLeave={() => setHoveredPoint(null)}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: isHovered ? 0 : [0, -2.5, 0],
                    scale: isHovered ? 1.04 : 1
                  }
            }
            transition={{
              y: { duration: 4.2 + p.delay, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              top: p.top,
              left: p.left,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            {/* Small Luminous Point / Micro Icon Frame */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: isHovered ? 'rgba(18, 22, 52, 0.95)' : 'rgba(8, 10, 24, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isHovered ? `1.4px solid ${p.color}` : `1.1px solid ${p.color}88`,
                boxShadow: isHovered
                  ? `0 0 16px ${p.color}77, inset 0 0 6px ${p.color}44`
                  : `0 0 8px ${p.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: p.color,
                transition: 'all 0.25s ease',
                flexShrink: 0
              }}
            >
              <Icon size={15} style={{ filter: isHovered ? `drop-shadow(0 0 4px ${p.color})` : 'none' }} />
            </div>

            {/* Clean Minimal Typography */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                opacity: isAnyHovered && !isHovered ? 0.55 : 1,
                transition: 'opacity 0.25s ease',
                pointerEvents: 'none'
              }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.92)',
                  lineHeight: 1.1,
                  letterSpacing: '0.07em',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
                }}
              >
                {p.label}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  color: isHovered ? p.color : '#94A3B8',
                  lineHeight: 1.1,
                  marginTop: '1px',
                  textShadow: '0 1px 6px rgba(0, 0, 0, 0.9)',
                  transition: 'color 0.25s ease'
                }}
              >
                {p.tag}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default CareerIntelligenceVisual
