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

  // Star / Radial Neural Coordinates (ViewBox: 600 x 520, Center: 300, 260)
  const center = { x: 300, y: 260 }

  const nodes = [
    {
      id: 'skills',
      label: 'Skills',
      category: 'Demonstrated AST',
      icon: Sparkles,
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.35)',
      x: 300,
      y: 60,
      delay: 0
    },
    {
      id: 'evidence',
      label: 'Evidence',
      category: 'Verified Proof',
      icon: ShieldCheck,
      color: '#3B82F6',
      glow: 'rgba(59, 130, 246, 0.35)',
      x: 95,
      y: 215,
      delay: 2.4
    },
    {
      id: 'projects',
      label: 'Projects',
      category: 'Production Code',
      icon: Code2,
      color: '#10B981',
      glow: 'rgba(16, 185, 129, 0.35)',
      x: 505,
      y: 215,
      delay: 0.6
    },
    {
      id: 'growth',
      label: 'Growth',
      category: 'Next Best Action',
      icon: Zap,
      color: '#FF5500',
      glow: 'rgba(255, 85, 0, 0.35)',
      x: 145,
      y: 435,
      delay: 1.8
    },
    {
      id: 'career',
      label: 'Career',
      category: 'Target Benchmark',
      icon: Target,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.35)',
      x: 455,
      y: 435,
      delay: 1.2
    }
  ]

  const parallaxCenter = {
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
      {/* Controlled Soft Ambient Background Glow (Calm & Non-glaring) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: hoveredNode || isCoreHovered ? 1.05 : [0.96, 1.03, 0.96],
                opacity: hoveredNode || isCoreHovered ? 0.45 : [0.25, 0.35, 0.25]
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
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(59, 130, 246, 0.12) 40%, rgba(255, 85, 0, 0.06) 70%, transparent 100%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(${parallaxCenter.x}px, ${parallaxCenter.y}px)`
        }}
      />

      {/* SVG Neural Constellation Network & Orbit Geometry */}
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
          <linearGradient id="radialOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0.2" />
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
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor={node.color} stopOpacity="0.9" />
            </linearGradient>
          ))}
        </defs>

        {/* Concentric Thin Star Orbit Rings */}
        <motion.g
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        >
          <circle
            cx={center.x}
            cy={center.y}
            r="195"
            fill="none"
            stroke="url(#radialOrbitGrad)"
            strokeWidth="1.1"
            strokeDasharray="4 6"
          />
          <circle
            cx={center.x}
            cy={center.y}
            r="135"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        </motion.g>

        {/* Inner Counter Orbit Ring */}
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
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        </motion.g>

        {/* Faint Star Perimeter Polygon Geometry */}
        <polygon
          points={nodes.map((n) => `${n.x},${n.y}`).join(' ')}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        {/* Dynamic Star Radial Rays from Central Core to Each Node */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id
          const isAnyHovered = Boolean(hoveredNode) || isCoreHovered

          return (
            <g key={`line-group-${node.id}`}>
              {/* Star Connection Line */}
              <line
                x1={center.x}
                y1={center.y}
                x2={node.x}
                y2={node.y}
                stroke={isHovered ? node.color : 'rgba(139, 92, 246, 0.22)'}
                strokeWidth={isHovered ? 2.5 : 1.2}
                strokeDasharray={isHovered ? 'none' : '3 4'}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 6px ${node.color})` : 'none',
                  transition: 'all 0.3s ease',
                  opacity: isAnyHovered && !isHovered && !isCoreHovered ? 0.3 : 1
                }}
              />

              {/* Star-like Junction Dot at Mid-Ray */}
              <circle
                cx={(center.x + node.x) / 2}
                cy={(center.y + node.y) / 2}
                r={isHovered ? 2.5 : 1.5}
                fill={isHovered ? node.color : 'rgba(139, 92, 246, 0.4)'}
                style={{
                  transition: 'all 0.3s ease'
                }}
              />

              {/* Animated Flowing Energy Dot */}
              {!shouldReduceMotion && (
                <motion.circle
                  r={isHovered ? 3.2 : 2}
                  fill={isHovered ? '#FFF' : node.color}
                  style={{
                    filter: `drop-shadow(0 0 5px ${node.color})`
                  }}
                  animate={{
                    cx: [center.x, node.x, center.x],
                    cy: [center.y, node.y, center.y],
                    opacity: [0.15, 0.9, 0.15]
                  }}
                  transition={{
                    duration: 4.2 + node.delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* CENTRAL CORE: ELEGANT COMPACT CAREER DNA NEURAL HUB */}
      <motion.div
        onMouseEnter={() => setIsCoreHovered(true)}
        onMouseLeave={() => setIsCoreHovered(false)}
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: isCoreHovered || hoveredNode ? 1.03 : [0.98, 1.015, 0.98],
                y: parallaxCenter.y,
                x: parallaxCenter.x
              }
        }
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '136px',
          height: '136px',
          borderRadius: '50%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 35%, rgba(18, 22, 48, 0.92) 0%, rgba(7, 9, 22, 0.96) 80%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isCoreHovered ? '1.5px solid rgba(168, 85, 247, 0.7)' : '1.2px solid rgba(168, 85, 247, 0.4)',
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
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(255, 85, 0, 0.18) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.35)'
          }}
        >
          <Dna size={20} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.7))' }} />
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
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: '2px'
          }}
        >
          Neural Core
        </span>
      </motion.div>

      {/* 5 COMPACT SATELLITE NODES IN STAR RADIAL POSITION */}
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
                    y: isHovered ? 0 : [0, -4, 0],
                    scale: isHovered ? 1.03 : 1
                  }
            }
            transition={{
              y: { duration: 4 + node.delay, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              left: `${(node.x / 600) * 100}%`,
              top: `${(node.y / 520) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px 7px 8px',
                borderRadius: 'var(--radius-lg)',
                background: isHovered ? 'rgba(18, 24, 48, 0.92)' : 'rgba(10, 14, 30, 0.78)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: isHovered ? `1px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isHovered
                  ? `0 0 18px ${node.color}40, 0 6px 20px rgba(0, 0, 0, 0.45)`
                  : '0 4px 16px rgba(0, 0, 0, 0.3)',
                opacity: isAnyHovered && !isHovered ? 0.65 : 1,
                transition: 'all 0.25s ease'
              }}
            >
              {/* Compact Node Icon */}
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: 'var(--radius-md)',
                  background: `rgba(${node.color === '#A855F7' ? '168, 85, 247' : node.color === '#10B981' ? '16, 185, 129' : node.color === '#38BDF8' ? '56, 189, 248' : node.color === '#FF5500' ? '255, 85, 0' : '59, 130, 246'}, 0.18)`,
                  border: `1px solid ${node.color}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: node.color,
                  boxShadow: isHovered ? `0 0 10px ${node.color}66` : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <Icon size={16} />
              </div>

              {/* Node Label & Context Tag */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 800,
                    color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.92)',
                    lineHeight: 1.1
                  }}
                >
                  {node.label}
                </span>
                <span
                  style={{
                    fontSize: '0.64rem',
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
