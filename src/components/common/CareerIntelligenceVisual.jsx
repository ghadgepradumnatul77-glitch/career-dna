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
  const [hoveredNode, setHoveredNode] = useState(null)
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

  // 5 Clean Constellation Nodes geometrically distributed around center (50%, 50%)
  const nodes = [
    {
      id: 'learn',
      label: 'LEARN',
      tag: 'Build Skills',
      icon: GraduationCap,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.45)',
      top: '10%',
      left: '50%',
      delay: 0
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      tag: 'Prove It',
      icon: ShieldCheck,
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.45)',
      top: '32%',
      left: '14%',
      delay: 1.8
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      tag: 'Build & Ship',
      icon: Code2,
      color: '#00D2FF',
      glow: 'rgba(0, 210, 255, 0.45)',
      top: '32%',
      left: '86%',
      delay: 0.6
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      icon: TrendingUp,
      color: '#EC4899',
      glow: 'rgba(236, 72, 153, 0.45)',
      top: '76%',
      left: '22%',
      delay: 1.2
    },
    {
      id: 'career',
      label: 'CAREER',
      tag: 'Achieve Goals',
      icon: Briefcase,
      color: '#FF8800',
      glow: 'rgba(255, 136, 0, 0.45)',
      top: '76%',
      left: '78%',
      delay: 0.9
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
        maxWidth: '560px',
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        perspective: 1000
      }}
    >
      {/* Soft Ambient Center Glow behind Core */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: hoveredNode || isCoreHovered ? 1.05 : [0.96, 1.02, 0.96],
                opacity: hoveredNode || isCoreHovered ? 0.35 : [0.18, 0.26, 0.18]
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: hoveredNode
            ? `radial-gradient(circle, ${nodes.find((n) => n.id === hoveredNode)?.glow} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(56, 189, 248, 0.10) 40%, transparent 75%)',
          filter: 'blur(42px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(calc(-50% + ${parallaxOffset.x}px), calc(-50% + ${parallaxOffset.y}px))`
        }}
      />

      {/* Subtle Background Orbit Rings (No Visible Direct Connector Lines) */}
      <svg
        viewBox="0 0 560 560"
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
          <linearGradient id="subtleOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.16" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FF8800" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        {/* Faint Concentric Orbit Guides (Center: 280, 280) */}
        <motion.g
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '280px 280px' }}
        >
          <circle
            cx="280"
            cy="280"
            r="190"
            fill="none"
            stroke="url(#subtleOrbitGrad)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle
            cx="280"
            cy="280"
            r="125"
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
        </motion.g>
      </svg>

      {/* EXACTLY CENTERED CENTRAL CORE: CAREER DNA NEURAL HUB */}
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
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${parallaxOffset.x}px), calc(-50% + ${parallaxOffset.y}px))`,
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 35%, rgba(18, 22, 50, 0.94) 0%, rgba(6, 8, 20, 0.98) 85%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isCoreHovered
            ? '1.5px solid rgba(168, 85, 247, 0.75)'
            : '1.2px solid rgba(139, 92, 246, 0.45)',
          boxShadow: isCoreHovered
            ? '0 0 28px rgba(139, 92, 246, 0.45), inset 0 0 16px rgba(139, 92, 246, 0.25)'
            : '0 0 18px rgba(139, 92, 246, 0.25), inset 0 0 12px rgba(139, 92, 246, 0.15)',
          cursor: 'default',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Core Icon Mark */}
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.28) 0%, rgba(56, 189, 248, 0.2) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.35)'
          }}
        >
          <Dna size={22} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))' }} />
        </div>

        <span
          style={{
            fontSize: '0.80rem',
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
            fontSize: '0.58rem',
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

      {/* 5 CLEAN CONSTELLATION NODES (NO CONNECTOR LINES, CLEAN SPACING) */}
      {nodes.map((node) => {
        const Icon = node.icon
        const isHovered = hoveredNode === node.id
        const isAnyHovered = Boolean(hoveredNode)

        return (
          <motion.div
            key={node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: isHovered ? 0 : [0, -3, 0],
                    scale: isHovered ? 1.03 : 1
                  }
            }
            transition={{
              y: { duration: 4.2 + node.delay, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              top: node.top,
              left: node.left,
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
            {/* Small Circular Icon Node */}
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: isHovered ? 'rgba(20, 26, 60, 0.96)' : 'rgba(8, 12, 28, 0.88)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: isHovered ? `1.6px solid ${node.color}` : `1.2px solid ${node.color}99`,
                boxShadow: isHovered
                  ? `0 0 20px ${node.color}88, inset 0 0 10px ${node.color}55`
                  : `0 0 12px ${node.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: node.color,
                transition: 'all 0.25s ease',
                flexShrink: 0
              }}
            >
              <Icon size={20} style={{ filter: isHovered ? `drop-shadow(0 0 5px ${node.color})` : 'none' }} />
            </div>

            {/* Clean Minimal Typography Labels (Below Node) */}
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
                {node.label}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: isHovered ? node.color : '#94A3B8',
                  lineHeight: 1.1,
                  marginTop: '2px',
                  textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)',
                  transition: 'color 0.25s ease'
                }}
              >
                {node.tag}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default CareerIntelligenceVisual
