import React, { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Dna,
  Sparkles,
  ShieldCheck,
  Code2,
  Target,
  Zap
} from 'lucide-react'

export const CareerIntelligenceVisual = () => {
  const [hoveredNode, setHoveredNode] = useState(null)
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

  // 5 Strategic Career DNA Nodes mapped around center (ViewBox: 620 x 560, Center: 310, 280)
  // Scaled up 20-30% with balanced focal point and clear visibility
  const center = { x: 310, y: 280 }

  const nodes = [
    {
      id: 'skills',
      label: 'Skills',
      category: 'Demonstrated AST',
      icon: Sparkles,
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.45)',
      x: 310,
      y: 62,
      delay: 0
    },
    {
      id: 'projects',
      label: 'Projects',
      category: 'Production Code',
      icon: Code2,
      color: '#10B981',
      glow: 'rgba(16, 185, 129, 0.45)',
      x: 505,
      y: 175,
      delay: 0.6
    },
    {
      id: 'career',
      label: 'Career',
      category: 'Target Benchmark',
      icon: Target,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.45)',
      x: 480,
      y: 435,
      delay: 1.2
    },
    {
      id: 'growth',
      label: 'Growth',
      category: 'Next Best Action',
      icon: Zap,
      color: '#FF5500',
      glow: 'rgba(255, 85, 0, 0.45)',
      x: 140,
      y: 435,
      delay: 1.8
    },
    {
      id: 'evidence',
      label: 'Evidence',
      category: 'Verified Proof',
      icon: ShieldCheck,
      color: '#3B82F6',
      glow: 'rgba(59, 130, 246, 0.45)',
      x: 115,
      y: 175,
      delay: 2.4
    }
  ]

  const parallaxCenter = {
    x: mousePos.x * 6,
    y: mousePos.y * 6
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
        aspectRatio: '620 / 560',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        perspective: 1000
      }}
    >
      {/* Ambient background soft neon aura */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: hoveredNode ? 1.08 : [0.95, 1.05, 0.95],
                opacity: hoveredNode ? 0.7 : [0.38, 0.55, 0.38]
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '390px',
          height: '390px',
          borderRadius: '50%',
          background: hoveredNode
            ? `radial-gradient(circle, ${nodes.find((n) => n.id === hoveredNode)?.glow} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.32) 0%, rgba(59, 130, 246, 0.20) 40%, rgba(255, 85, 0, 0.12) 70%, transparent 100%)',
          filter: 'blur(46px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(${parallaxCenter.x}px, ${parallaxCenter.y}px)`
        }}
      />

      {/* SVG Interactive Connection Lines & Orbit Rings */}
      <svg
        viewBox="0 0 620 560"
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
          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0.3" />
          </linearGradient>

          {nodes.map((node) => (
            <linearGradient
              key={`grad-${node.id}`}
              id={`line-grad-${node.id}`}
              x1={center.x < node.x ? '0%' : '100%'}
              y1={center.y < node.y ? '0%' : '100%'}
              x2={center.x < node.x ? '100%' : '0%'}
              y2={center.y < node.y ? '100%' : '0%'}
            >
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.75" />
              <stop offset="100%" stopColor={node.color} stopOpacity="0.95" />
            </linearGradient>
          ))}
        </defs>

        {/* Orbit Background Rings */}
        <motion.g
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <circle
            cx={center.x}
            cy={center.y}
            r="230"
            fill="none"
            stroke="url(#orbitGrad)"
            strokeWidth="1.3"
            strokeDasharray="6 8"
          />
          <circle
            cx={center.x}
            cy={center.y}
            r="150"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        </motion.g>

        {/* Inner Counter-Rotating Orbit Ring */}
        <motion.g
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <circle
            cx={center.x}
            cy={center.y}
            r="100"
            fill="none"
            stroke="rgba(139, 92, 246, 0.25)"
            strokeWidth="1.2"
            strokeDasharray="3 5"
          />
        </motion.g>

        {/* Faint Outer Constellation Perimeter Geometry */}
        <polygon
          points={nodes.map((n) => `${n.x},${n.y}`).join(' ')}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Dynamic Connecting Lines from Center to Each Node */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id
          const isAnyHovered = Boolean(hoveredNode)

          return (
            <g key={`line-group-${node.id}`}>
              {/* Active glow backing line */}
              <line
                x1={center.x}
                y1={center.y}
                x2={node.x}
                y2={node.y}
                stroke={isHovered ? node.color : 'rgba(139, 92, 246, 0.25)'}
                strokeWidth={isHovered ? 3.5 : 1.4}
                strokeDasharray={isHovered ? 'none' : '4 4'}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 10px ${node.color})` : 'none',
                  transition: 'all 0.3s ease',
                  opacity: isAnyHovered && !isHovered ? 0.3 : 1
                }}
              />

              {/* Animated Flowing Energy Dot along connection line */}
              {!shouldReduceMotion && (
                <motion.circle
                  r={isHovered ? 4 : 2.5}
                  fill={isHovered ? '#FFF' : node.color}
                  style={{
                    filter: `drop-shadow(0 0 8px ${node.color})`
                  }}
                  animate={{
                    cx: [center.x, node.x, center.x],
                    cy: [center.y, node.y, center.y],
                    opacity: [0.2, 0.95, 0.2]
                  }}
                  transition={{
                    duration: 4 + node.delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* CENTRAL CORE: ENLARGED CAREER DNA INTELLIGENCE NODE */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: hoveredNode ? 1.04 : [0.98, 1.02, 0.98],
                y: parallaxCenter.y,
                x: parallaxCenter.x
              }
        }
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '168px',
          height: '168px',
          borderRadius: '50%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 35%, rgba(24, 28, 60, 0.94) 0%, rgba(8, 11, 26, 0.98) 80%)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1.8px solid rgba(168, 85, 247, 0.5)',
          boxShadow: hoveredNode
            ? '0 0 40px rgba(168, 85, 247, 0.6), inset 0 0 25px rgba(139, 92, 246, 0.4)'
            : '0 0 30px rgba(139, 92, 246, 0.35), inset 0 0 18px rgba(139, 92, 246, 0.25)',
          cursor: 'default',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        {/* Core Icon with Dual-Tone Glow */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(255, 85, 0, 0.25) 100%)',
            border: '1.2px solid rgba(168, 85, 247, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '6px',
            boxShadow: '0 0 18px rgba(139, 92, 246, 0.45)'
          }}
        >
          <Dna size={28} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.85))' }} />
        </div>

        <span
          style={{
            fontSize: '0.86rem',
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
            fontSize: '0.65rem',
            fontWeight: 700,
            color: 'var(--color-purple-light)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginTop: '3px'
          }}
        >
          Neural Core
        </span>
      </motion.div>

      {/* 5 ENLARGED SATELLITE STRATEGIC NODES */}
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
                    y: isHovered ? 0 : [0, -5, 0],
                    scale: isHovered ? 1.04 : 1
                  }
            }
            transition={{
              y: { duration: 4.5 + node.delay, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.25 }
            }}
            style={{
              position: 'absolute',
              left: `${(node.x / 620) * 100}%`,
              top: `${(node.y / 560) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 15px 9px 10px',
                borderRadius: 'var(--radius-xl)',
                background: isHovered ? 'rgba(20, 26, 54, 0.94)' : 'rgba(10, 14, 30, 0.82)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: isHovered ? `1.2px solid ${node.color}` : '1.2px solid rgba(255, 255, 255, 0.12)',
                boxShadow: isHovered
                  ? `0 0 25px ${node.color}50, 0 8px 24px rgba(0, 0, 0, 0.55)`
                  : '0 4px 20px rgba(0, 0, 0, 0.4)',
                opacity: isAnyHovered && !isHovered ? 0.65 : 1,
                transition: 'all 0.25s ease'
              }}
            >
              {/* Node Icon Avatar */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: `rgba(${node.color === '#A855F7' ? '168, 85, 247' : node.color === '#10B981' ? '16, 185, 129' : node.color === '#38BDF8' ? '56, 189, 248' : node.color === '#FF5500' ? '255, 85, 0' : '59, 130, 246'}, 0.22)`,
                  border: `1.2px solid ${node.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: node.color,
                  boxShadow: isHovered ? `0 0 14px ${node.color}77` : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <Icon size={19} />
              </div>

              {/* Node Label & Context Tag */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)',
                    lineHeight: 1.15
                  }}
                >
                  {node.label}
                </span>
                <span
                  style={{
                    fontSize: '0.70rem',
                    fontWeight: 600,
                    color: isHovered ? node.color : 'var(--color-text-dim)',
                    lineHeight: 1.1,
                    marginTop: '2px',
                    transition: 'color 0.25s ease'
                  }}
                >
                  {node.category}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default CareerIntelligenceVisual
