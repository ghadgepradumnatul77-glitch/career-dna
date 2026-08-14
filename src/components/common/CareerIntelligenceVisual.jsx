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

  // 5 Clean Constellation Nodes around Center (ViewBox: 600 x 520, Center: 300, 260)
  const center = { x: 300, y: 260 }

  const nodes = [
    {
      id: 'learn',
      label: 'LEARN',
      tag: 'Build Skills',
      icon: GraduationCap,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.4)',
      x: 300,
      y: 62,
      delay: 0
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      tag: 'Prove It',
      icon: ShieldCheck,
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.4)',
      x: 95,
      y: 195,
      delay: 1.8
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      tag: 'Build & Ship',
      icon: Code2,
      color: '#00D2FF',
      glow: 'rgba(0, 210, 255, 0.4)',
      x: 505,
      y: 195,
      delay: 0.6
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      icon: TrendingUp,
      color: '#EC4899',
      glow: 'rgba(236, 72, 153, 0.4)',
      x: 155,
      y: 435,
      delay: 1.2
    },
    {
      id: 'career',
      label: 'CAREER',
      tag: 'Achieve Goals',
      icon: Briefcase,
      color: '#FF8800',
      glow: 'rgba(255, 136, 0, 0.4)',
      x: 445,
      y: 435,
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
        maxWidth: '600px',
        aspectRatio: '600 / 520',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        perspective: 1000
      }}
    >
      {/* Soft Ambient Center Aura */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: hoveredNode || isCoreHovered ? 1.04 : [0.96, 1.02, 0.96],
                opacity: hoveredNode || isCoreHovered ? 0.35 : [0.18, 0.26, 0.18]
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: hoveredNode
            ? `radial-gradient(circle, ${nodes.find((n) => n.id === hoveredNode)?.glow} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(56, 189, 248, 0.1) 40%, transparent 75%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
        }}
      />

      {/* SVG Clean Hub-and-Spoke Connections */}
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
          {nodes.map((node) => (
            <linearGradient
              key={`spoke-grad-${node.id}`}
              id={`spoke-grad-${node.id}`}
              x1={center.x < node.x ? '0%' : '100%'}
              y1={center.y < node.y ? '0%' : '100%'}
              x2={center.x < node.x ? '100%' : '0%'}
              y2={center.y < node.y ? '100%' : '0%'}
            >
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor={node.color} stopOpacity="0.85" />
            </linearGradient>
          ))}
        </defs>

        {/* 5 Clean Spoke Lines from Core to each Node */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id
          const isAnyHovered = Boolean(hoveredNode) || isCoreHovered

          return (
            <g key={`spoke-line-${node.id}`}>
              <line
                x1={center.x}
                y1={center.y}
                x2={node.x}
                y2={node.y}
                stroke={isHovered ? node.color : `url(#spoke-grad-${node.id})`}
                strokeWidth={isHovered ? 2.2 : 1.3}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 6px ${node.color})` : 'none',
                  transition: 'all 0.3s ease',
                  opacity: isAnyHovered && !isHovered && !isCoreHovered ? 0.25 : 0.75
                }}
              />

              {/* Tiny subtle flowing pulse dot along each spoke */}
              {!shouldReduceMotion && (
                <motion.circle
                  r={isHovered ? 3 : 2}
                  fill={isHovered ? '#FFFFFF' : node.color}
                  style={{
                    filter: `drop-shadow(0 0 5px ${node.color})`
                  }}
                  animate={{
                    cx: [center.x, node.x, center.x],
                    cy: [center.y, node.y, center.y],
                    opacity: [0.15, 0.9, 0.15]
                  }}
                  transition={{
                    duration: 4.8 + node.delay,
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
                scale: isCoreHovered ? 1.03 : [0.985, 1.015, 0.985],
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

      {/* 5 CLEAN CONSTELLATION NODES (CIRCULAR ICONS WITH LABELS BELOW) */}
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
              left: `${(node.x / 600) * 100}%`,
              top: `${(node.y / 520) * 100}%`,
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
