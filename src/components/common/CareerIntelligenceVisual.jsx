import React, { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Dna,
  GraduationCap,
  ShieldCheck,
  Code2,
  Briefcase,
  TrendingUp,
  Sparkles
} from 'lucide-react'

export const CareerIntelligenceVisual = () => {
  const [hoveredStage, setHoveredStage] = useState(null)
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

  // 5 Orbital Stages & Coordinates (ViewBox: 620 x 540, Center: 310, 270)
  const center = { x: 310, y: 270 }

  const stages = [
    {
      id: 'learn',
      label: 'LEARN',
      tag: 'Build Skills',
      icon: GraduationCap,
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.45)',
      x: 310,
      y: 58,
      align: 'top',
      delay: 0
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      tag: 'Prove It',
      icon: ShieldCheck,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.45)',
      x: 95,
      y: 195,
      align: 'left',
      delay: 2.2
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      tag: 'Build & Ship',
      icon: Code2,
      color: '#10B981',
      glow: 'rgba(16, 185, 129, 0.45)',
      x: 525,
      y: 195,
      align: 'right',
      delay: 0.8
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      icon: TrendingUp,
      color: '#FF5500',
      glow: 'rgba(255, 85, 0, 0.45)',
      x: 130,
      y: 445,
      align: 'bottom-left',
      delay: 1.6
    },
    {
      id: 'career',
      label: 'CAREER',
      tag: 'Achieve Goals',
      icon: Briefcase,
      color: '#3B82F6',
      glow: 'rgba(59, 130, 246, 0.45)',
      x: 490,
      y: 445,
      align: 'bottom-right',
      delay: 1.2
    }
  ]

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
        maxWidth: '620px',
        aspectRatio: '620 / 540',
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
                scale: hoveredStage || isCoreHovered ? 1.04 : [0.96, 1.02, 0.96],
                opacity: hoveredStage || isCoreHovered ? 0.38 : [0.22, 0.30, 0.22]
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: hoveredStage
            ? `radial-gradient(circle, ${stages.find((s) => s.id === hoveredStage)?.glow} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(59, 130, 246, 0.12) 40%, transparent 75%)',
          filter: 'blur(42px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
        }}
      />

      {/* SVG Orbital Paths, Flow Lines, & Moving Light Trails */}
      <svg
        viewBox="0 0 620 540"
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
          <linearGradient id="orbitalLoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.35" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="75%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0.35" />
          </linearGradient>

          {stages.map((stage) => (
            <linearGradient
              key={`orbit-ray-${stage.id}`}
              id={`ray-grad-${stage.id}`}
              x1={center.x < stage.x ? '0%' : '100%'}
              y1={center.y < stage.y ? '0%' : '100%'}
              x2={center.x < stage.x ? '100%' : '0%'}
              y2={center.y < stage.y ? '100%' : '0%'}
            >
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor={stage.color} stopOpacity="0.9" />
            </linearGradient>
          ))}
        </defs>

        {/* Outer Continuous Star Orbital Ellipses */}
        <motion.g
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <ellipse
            cx={center.x}
            cy={center.y}
            rx="230"
            ry="195"
            fill="none"
            stroke="url(#orbitalLoopGrad)"
            strokeWidth="1.2"
            strokeDasharray="5 7"
          />
          <ellipse
            cx={center.x}
            cy={center.y}
            rx="160"
            ry="135"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        </motion.g>

        {/* Inner Counter-Rotating Orbit Ring */}
        <motion.g
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <circle
            cx={center.x}
            cy={center.y}
            r="82"
            fill="none"
            stroke="rgba(139, 92, 246, 0.22)"
            strokeWidth="1.1"
            strokeDasharray="3 5"
          />
        </motion.g>

        {/* Faint Orbital Constellation Loop connecting all 5 stages */}
        <path
          d={`M ${stages[0].x} ${stages[0].y} 
              Q 430 110 ${stages[2].x} ${stages[2].y} 
              Q 530 330 ${stages[4].x} ${stages[4].y} 
              Q 310 490 ${stages[3].x} ${stages[3].y} 
              Q 90 330 ${stages[1].x} ${stages[1].y} 
              Q 190 110 ${stages[0].x} ${stages[0].y}`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />

        {/* Dynamic Curved Flow Paths from Core to each Orbital Stage */}
        {stages.map((stage) => {
          const isHovered = hoveredStage === stage.id
          const isAnyHovered = Boolean(hoveredStage) || isCoreHovered
          // Gentle curved bezier from center to stage
          const midX = (center.x + stage.x) / 2 + (stage.x < center.x ? -15 : 15)
          const midY = (center.y + stage.y) / 2 + (stage.y < center.y ? -10 : 10)
          const pathD = `M ${center.x} ${center.y} Q ${midX} ${midY} ${stage.x} ${stage.y}`

          return (
            <g key={`flow-path-${stage.id}`}>
              {/* Base Path Ray */}
              <path
                d={pathD}
                fill="none"
                stroke={isHovered ? stage.color : `url(#ray-grad-${stage.id})`}
                strokeWidth={isHovered ? 2.6 : 1.2}
                strokeDasharray={isHovered ? 'none' : '4 4'}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${stage.color})` : 'none',
                  transition: 'all 0.3s ease',
                  opacity: isAnyHovered && !isHovered && !isCoreHovered ? 0.3 : 0.85
                }}
              />

              {/* Moving Light Trail Particle along path */}
              {!shouldReduceMotion && (
                <motion.circle
                  r={isHovered ? 3.5 : 2.2}
                  fill={isHovered ? '#FFFFFF' : stage.color}
                  style={{
                    filter: `drop-shadow(0 0 6px ${stage.color})`
                  }}
                  animate={{
                    cx: [center.x, midX, stage.x, midX, center.x],
                    cy: [center.y, midY, stage.y, midY, center.y],
                    opacity: [0.2, 0.95, 0.8, 0.95, 0.2]
                  }}
                  transition={{
                    duration: 5.5 + stage.delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* CENTRAL CORE: CAREER DNA NEURAL HUB */}
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
          left: `${(center.x / 620) * 100}%`,
          top: `${(center.y / 540) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '130px',
          height: '130px',
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
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.28) 0%, rgba(255, 85, 0, 0.18) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '3px',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.35)'
          }}
        >
          <Dna size={19} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.75))' }} />
        </div>

        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.08em',
            lineHeight: 1.1
          }}
        >
          CAREER DNA
        </span>
        <span
          style={{
            fontSize: '0.56rem',
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

      {/* 5 ORBITAL STAGE NODES (CIRCULAR GLASS FRAMES, NON-CARD) */}
      {stages.map((stage) => {
        const Icon = stage.icon
        const isHovered = hoveredStage === stage.id
        const isAnyHovered = Boolean(hoveredStage)

        return (
          <motion.div
            key={stage.id}
            onMouseEnter={() => setHoveredStage(stage.id)}
            onMouseLeave={() => setHoveredStage(null)}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: isHovered ? 0 : [0, -3, 0],
                    scale: isHovered ? 1.04 : 1
                  }
            }
            transition={{
              y: { duration: 4.2 + stage.delay, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              left: `${(stage.x / 620) * 100}%`,
              top: `${(stage.y / 540) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              flexDirection: stage.align === 'left' ? 'row-reverse' : stage.align === 'top' ? 'column' : 'row'
            }}
          >
            {/* Circular Glass Icon Node */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isHovered ? 'rgba(20, 26, 56, 0.95)' : 'rgba(10, 14, 32, 0.85)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: isHovered ? `1.4px solid ${stage.color}` : `1.2px solid ${stage.color}88`,
                boxShadow: isHovered
                  ? `0 0 18px ${stage.color}77, inset 0 0 8px ${stage.color}44`
                  : `0 0 10px ${stage.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stage.color,
                transition: 'all 0.25s ease',
                flexShrink: 0
              }}
            >
              <Icon size={17} style={{ filter: isHovered ? `drop-shadow(0 0 4px ${stage.color})` : 'none' }} />
            </div>

            {/* Clean Minimal Typography Label */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: stage.align === 'left' ? 'flex-end' : stage.align === 'top' ? 'center' : 'flex-start',
                opacity: isAnyHovered && !isHovered ? 0.5 : 1,
                transition: 'opacity 0.25s ease',
                textAlign: stage.align === 'top' ? 'center' : 'left'
              }}
            >
              <span
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.92)',
                  lineHeight: 1.1,
                  letterSpacing: '0.06em',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                }}
              >
                {stage.label}
              </span>
              <span
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  color: isHovered ? stage.color : 'var(--color-text-dim)',
                  lineHeight: 1.1,
                  marginTop: '2px',
                  transition: 'color 0.25s ease'
                }}
              >
                {stage.tag}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default CareerIntelligenceVisual
