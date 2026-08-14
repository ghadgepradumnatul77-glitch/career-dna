import React, { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Dna,
  GraduationCap,
  FileText,
  Code2,
  Briefcase,
  TrendingUp
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

  // 5 Orbital Stages & Coordinates (ViewBox: 640 x 560, Center: 320, 280)
  const center = { x: 320, y: 280 }

  const stages = [
    {
      id: 'learn',
      label: 'LEARN',
      tag: 'Build Skills',
      icon: GraduationCap,
      color: '#38BDF8',
      secondaryColor: '#818CF8',
      glow: 'rgba(56, 189, 248, 0.45)',
      x: 320,
      y: 75,
      delay: 0
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      tag: 'Prove It',
      icon: FileText,
      color: '#C084FC',
      secondaryColor: '#A855F7',
      glow: 'rgba(192, 132, 252, 0.45)',
      x: 115,
      y: 205,
      delay: 2.4
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      tag: 'Build & Ship',
      icon: Code2,
      color: '#00D2FF',
      secondaryColor: '#3B82F6',
      glow: 'rgba(0, 210, 255, 0.45)',
      x: 525,
      y: 205,
      delay: 0.8
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      icon: TrendingUp,
      color: '#EC4899',
      secondaryColor: '#FF5500',
      glow: 'rgba(236, 72, 153, 0.45)',
      x: 155,
      y: 450,
      delay: 1.8
    },
    {
      id: 'career',
      label: 'CAREER',
      tag: 'Achieve Goals',
      icon: Briefcase,
      color: '#FF8800',
      secondaryColor: '#FF5500',
      glow: 'rgba(255, 136, 0, 0.45)',
      x: 485,
      y: 450,
      delay: 1.2
    }
  ]

  // Flowing Orbital Arc Paths
  // Upper sweeping arc (Evidence -> Learn -> Projects)
  const upperArcD = 'M 115 205 C 130 110, 240 60, 320 75 C 400 60, 510 110, 525 205'
  // Left descending loop (Learn -> Evidence -> Growth)
  const leftArcD = 'M 320 75 C 200 95, 80 145, 115 205 C 135 255, 95 380, 155 450'
  // Right descending loop (Projects -> Career -> Growth)
  const rightArcD = 'M 525 205 C 555 310, 525 390, 485 450 C 445 500, 260 490, 155 450'
  // Core connecting rays (Center to each stage)
  const coreToLearn = 'M 320 280 C 315 200, 315 130, 320 75'
  const coreToEvidence = 'M 320 280 C 230 290, 160 250, 115 205'
  const coreToProjects = 'M 320 280 C 410 290, 480 250, 525 205'
  const coreToGrowth = 'M 320 280 C 250 340, 180 390, 155 450'
  const coreToCareer = 'M 320 280 C 390 340, 460 390, 485 450'

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
        maxWidth: '640px',
        aspectRatio: '640 / 560',
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
                opacity: hoveredStage || isCoreHovered ? 0.35 : [0.20, 0.28, 0.20]
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: hoveredStage
            ? `radial-gradient(circle, ${stages.find((s) => s.id === hoveredStage)?.glow} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(56, 189, 248, 0.12) 40%, transparent 75%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
        }}
      />

      {/* SVG Orbital Paths, Flow Lines, & Chevrons */}
      <svg
        viewBox="0 0 640 560"
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
          {/* Luminous Neon Gradients */}
          <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="purplePinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#C084FC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="orangeCoralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="coreHaloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#C084FC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF8800" stopOpacity="0.8" />
          </linearGradient>

          {stages.map((stage) => (
            <linearGradient
              key={`ray-grad-${stage.id}`}
              id={`ray-grad-${stage.id}`}
              x1={center.x < stage.x ? '0%' : '100%'}
              y1={center.y < stage.y ? '0%' : '100%'}
              x2={center.x < stage.x ? '100%' : '0%'}
              y2={center.y < stage.y ? '100%' : '0%'}
            >
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor={stage.color} stopOpacity="0.95" />
            </linearGradient>
          ))}
        </defs>

        {/* Concentric Subtle Orbit Radar Rings */}
        <circle
          cx={center.x}
          cy={center.y}
          r="175"
          fill="none"
          stroke="rgba(139, 92, 246, 0.12)"
          strokeWidth="1.1"
          strokeDasharray="4 6"
        />
        <circle
          cx={center.x}
          cy={center.y}
          r="125"
          fill="none"
          stroke="rgba(56, 189, 248, 0.08)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        {/* Outer Rotating Neon Halo Arc around Core */}
        <motion.g
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <circle
            cx={center.x}
            cy={center.y}
            r="88"
            fill="none"
            stroke="url(#coreHaloGrad)"
            strokeWidth="1.8"
            strokeDasharray="140 40"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.5))'
            }}
          />
          <circle
            cx={center.x}
            cy={center.y}
            r="78"
            fill="none"
            stroke="rgba(192, 132, 252, 0.25)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </motion.g>

        {/* Flowing Orbital Sweeping Arcs */}
        {/* Upper Cyan/Blue Arc */}
        <path
          d={upperArcD}
          fill="none"
          stroke="url(#cyanBlueGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 5px rgba(56, 189, 248, 0.45))'
          }}
        />

        {/* Left Purple/Pink Arc */}
        <path
          d={leftArcD}
          fill="none"
          stroke="url(#purplePinkGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 5px rgba(192, 132, 252, 0.45))'
          }}
        />

        {/* Right Orange/Coral Arc */}
        <path
          d={rightArcD}
          fill="none"
          stroke="url(#orangeCoralGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 5px rgba(255, 136, 0, 0.45))'
          }}
        />

        {/* Connecting Rays from Core to Each Stage */}
        {[
          { id: 'learn', d: coreToLearn, color: '#38BDF8' },
          { id: 'evidence', d: coreToEvidence, color: '#C084FC' },
          { id: 'projects', d: coreToProjects, color: '#00D2FF' },
          { id: 'growth', d: coreToGrowth, color: '#EC4899' },
          { id: 'career', d: coreToCareer, color: '#FF8800' }
        ].map((ray) => {
          const isHovered = hoveredStage === ray.id
          const isAnyHovered = Boolean(hoveredStage) || isCoreHovered

          return (
            <path
              key={`core-ray-${ray.id}`}
              d={ray.d}
              fill="none"
              stroke={isHovered ? ray.color : `url(#ray-grad-${ray.id})`}
              strokeWidth={isHovered ? 2.5 : 1.2}
              strokeDasharray={isHovered ? 'none' : '4 4'}
              style={{
                filter: isHovered ? `drop-shadow(0 0 8px ${ray.color})` : 'none',
                transition: 'all 0.3s ease',
                opacity: isAnyHovered && !isHovered && !isCoreHovered ? 0.3 : 0.8
              }}
            />
          )
        })}

        {/* Directional Flow Chevron Arrows on the Orbital Paths */}
        {/* Chevron 1: Top-Right between Learn & Projects */}
        <g transform="translate(425, 115) rotate(42)">
          <path d="M -4 -4 L 0 0 L -4 4 M 0 -4 L 4 0 L 0 4" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Chevron 2: Left-Top between Learn & Evidence */}
        <g transform="translate(200, 115) rotate(138)">
          <path d="M -4 -4 L 0 0 L -4 4 M 0 -4 L 4 0 L 0 4" fill="none" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Chevron 3: Left-Mid between Evidence & Growth */}
        <g transform="translate(100, 310) rotate(105)">
          <path d="M -4 -4 L 0 0 L -4 4 M 0 -4 L 4 0 L 0 4" fill="none" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Chevron 4: Right-Mid between Projects & Career */}
        <g transform="translate(535, 320) rotate(75)">
          <path d="M -4 -4 L 0 0 L -4 4 M 0 -4 L 4 0 L 0 4" fill="none" stroke="#00D2FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Chevron 5: Bottom between Growth & Career */}
        <g transform="translate(320, 485) rotate(180)">
          <path d="M -4 -4 L 0 0 L -4 4 M 0 -4 L 4 0 L 0 4" fill="none" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Animated Flowing Light Particles along Paths */}
        {!shouldReduceMotion && (
          <>
            {/* Particle 1: Upper Arc */}
            <motion.circle
              r="3.2"
              fill="#FFFFFF"
              style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }}
              animate={{
                cx: [115, 320, 525, 320, 115],
                cy: [205, 75, 205, 75, 205],
                opacity: [0.2, 0.95, 0.8, 0.95, 0.2]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Particle 2: Core to Growth & Career */}
            <motion.circle
              r="3"
              fill="#FFFFFF"
              style={{ filter: 'drop-shadow(0 0 6px #EC4899)' }}
              animate={{
                cx: [320, 155, 320, 485, 320],
                cy: [280, 450, 280, 450, 280],
                opacity: [0.3, 0.95, 0.3, 0.95, 0.3]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
          </>
        )}
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
          left: `${(center.x / 640) * 100}%`,
          top: `${(center.y / 560) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '134px',
          height: '134px',
          borderRadius: '50%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 35%, rgba(20, 24, 56, 0.95) 0%, rgba(6, 8, 20, 0.98) 85%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isCoreHovered
            ? '1.6px solid rgba(56, 189, 248, 0.8)'
            : '1.2px solid rgba(129, 140, 248, 0.5)',
          boxShadow: isCoreHovered
            ? '0 0 30px rgba(56, 189, 248, 0.5), inset 0 0 16px rgba(192, 132, 252, 0.35)'
            : '0 0 22px rgba(129, 140, 248, 0.3), inset 0 0 12px rgba(56, 189, 248, 0.2)',
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
            background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.3) 0%, rgba(236, 72, 153, 0.25) 100%)',
            border: '1px solid rgba(192, 132, 252, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '3px',
            boxShadow: '0 0 12px rgba(129, 140, 248, 0.4)'
          }}
        >
          <Dna size={19} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 6px rgba(192, 132, 252, 0.8))' }} />
        </div>

        <span
          style={{
            fontSize: '0.76rem',
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

      {/* 5 ORBITAL STAGE NODES (CIRCULAR GLASS FRAMES WITH LABELS DIRECTLY BELOW) */}
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
              left: `${(stage.x / 640) * 100}%`,
              top: `${(stage.y / 560) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {/* Circular Glass Icon Node Frame */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isHovered ? 'rgba(20, 26, 60, 0.96)' : 'rgba(8, 12, 28, 0.88)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: isHovered ? `1.6px solid ${stage.color}` : `1.2px solid ${stage.color}99`,
                boxShadow: isHovered
                  ? `0 0 20px ${stage.color}88, inset 0 0 10px ${stage.color}55`
                  : `0 0 12px ${stage.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stage.color,
                transition: 'all 0.25s ease',
                flexShrink: 0
              }}
            >
              <Icon size={18} style={{ filter: isHovered ? `drop-shadow(0 0 5px ${stage.color})` : 'none' }} />
            </div>

            {/* Clean Minimal Typography Labels (Directly Below Node) */}
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
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.1,
                  letterSpacing: '0.07em',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)'
                }}
              >
                {stage.label}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: isHovered ? stage.color : '#94A3B8',
                  lineHeight: 1.1,
                  marginTop: '2px',
                  textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)',
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
