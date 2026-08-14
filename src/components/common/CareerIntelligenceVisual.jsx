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

  // Exact Mathematical Regular Pentagon Coordinates on Ring (Radius R = 190, Center = 300, 270)
  const center = { x: 300, y: 270 }
  const radius = 190

  const nodes = [
    {
      id: 'learn',
      label: 'LEARN',
      tag: 'Build Skills',
      icon: GraduationCap,
      color: '#00D2FF',
      glow: 'rgba(0, 210, 255, 0.45)',
      x: 300,
      y: 80,
      delay: 0
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      tag: 'Build & Ship',
      icon: Code2,
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.45)',
      x: 481,
      y: 211,
      delay: 0.6
    },
    {
      id: 'career',
      label: 'CAREER',
      tag: 'Achieve Goals',
      icon: Briefcase,
      color: '#FF8800',
      glow: 'rgba(255, 136, 0, 0.45)',
      x: 412,
      y: 424,
      delay: 1.2
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      icon: TrendingUp,
      color: '#EC4899',
      glow: 'rgba(236, 72, 153, 0.45)',
      x: 188,
      y: 424,
      delay: 1.8
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      tag: 'Prove It',
      icon: ShieldCheck,
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.45)',
      x: 119,
      y: 211,
      delay: 2.4
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
        maxWidth: '580px',
        aspectRatio: '600 / 540',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        perspective: 1000
      }}
    >
      {/* Soft Ambient Radial Halo behind Core and Ring */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: hoveredNode || isCoreHovered ? 1.04 : [0.97, 1.02, 0.97],
                opacity: hoveredNode || isCoreHovered ? 0.35 : [0.18, 0.26, 0.18]
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: hoveredNode
            ? `radial-gradient(circle, ${nodes.find((n) => n.id === hoveredNode)?.glow} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(0, 210, 255, 0.12) 40%, transparent 75%)',
          filter: 'blur(42px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(calc(-50% + ${parallaxOffset.x}px), calc(-50% + ${parallaxOffset.y}px))`
        }}
      />

      {/* SVG Continuous Ring Topology & Light Particles */}
      <svg
        viewBox="0 0 600 540"
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
          {/* Continuous Multi-Color Ring Gradient */}
          <linearGradient id="ringTopologyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.95" />
          </linearGradient>

          {/* Faint Base Ring Glow */}
          <linearGradient id="ringGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.3" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.3" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* 5 Subtle Spoke Lines from Center Core to Ring Vertices */}
        {nodes.map((node) => (
          <line
            key={`spoke-${node.id}`}
            x1={center.x}
            y1={center.y}
            x2={node.x}
            y2={node.y}
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}

        {/* Faint Concentric Orbit Guides */}
        <circle
          cx={center.x}
          cy={center.y}
          r="105"
          fill="none"
          stroke="rgba(139, 92, 246, 0.15)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Glow Halo behind Main Ring */}
        <circle
          cx={center.x}
          cy={center.y}
          r={radius}
          fill="none"
          stroke="url(#ringGlowGrad)"
          strokeWidth="4"
          style={{
            filter: 'blur(3px)'
          }}
        />

        {/* MAIN CONTINUOUS CIRCULAR RING TOPOLOGY */}
        <circle
          cx={center.x}
          cy={center.y}
          r={radius}
          fill="none"
          stroke="url(#ringTopologyGrad)"
          strokeWidth="2.2"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(0, 210, 255, 0.45))'
          }}
        />

        {/* Animated Light Flow Pulse along the Ring */}
        {!shouldReduceMotion && (
          <motion.circle
            cx={center.x}
            cy={center.y}
            r={radius}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeDasharray="40 340"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              transformOrigin: `${center.x}px ${center.y}px`,
              filter: 'drop-shadow(0 0 8px #FFFFFF)'
            }}
          />
        )}

        {/* Flowing Light Particles along the Ring Path */}
        {!shouldReduceMotion && (
          <>
            <motion.circle
              r="3.5"
              fill="#FFFFFF"
              style={{ filter: 'drop-shadow(0 0 6px #00D2FF)' }}
              animate={{
                cx: [300, 481, 412, 188, 119, 300],
                cy: [80, 211, 424, 424, 211, 80],
                opacity: [0.3, 0.95, 0.4, 0.95, 0.4, 0.3]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </>
        )}
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
          left: `${(center.x / 600) * 100}%`,
          top: `${(center.y / 540) * 100}%`,
          transform: `translate(calc(-50% + ${parallaxOffset.x}px), calc(-50% + ${parallaxOffset.y}px))`,
          width: '156px',
          height: '156px',
          borderRadius: '50%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 35%, rgba(18, 22, 50, 0.95) 0%, rgba(6, 8, 20, 0.98) 85%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isCoreHovered
            ? '1.6px solid rgba(0, 210, 255, 0.8)'
            : '1.2px solid rgba(139, 92, 246, 0.5)',
          boxShadow: isCoreHovered
            ? '0 0 30px rgba(0, 210, 255, 0.45), inset 0 0 16px rgba(168, 85, 247, 0.3)'
            : '0 0 20px rgba(139, 92, 246, 0.25), inset 0 0 12px rgba(0, 210, 255, 0.15)',
          cursor: 'default',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Core Icon Badge */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(0, 210, 255, 0.2) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.35)'
          }}
        >
          <Dna size={21} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))' }} />
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

      {/* 5 NODES PLACED PRECISELY ON THE CONTINUOUS RING TOPOLOGY */}
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
                    scale: isHovered ? 1.04 : 1
                  }
            }
            transition={{
              y: { duration: 4.2 + node.delay, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              left: `${(node.x / 600) * 100}%`,
              top: `${(node.y / 540) * 100}%`,
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
            {/* Circular Glass Icon Node on the Ring */}
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: isHovered ? 'rgba(20, 26, 60, 0.96)' : 'rgba(8, 12, 28, 0.88)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: isHovered ? `1.8px solid ${node.color}` : `1.3px solid ${node.color}`,
                boxShadow: isHovered
                  ? `0 0 22px ${node.color}88, inset 0 0 10px ${node.color}55`
                  : `0 0 14px ${node.color}55`,
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

            {/* Clean Minimal Typography Labels (Directly Under Node) */}
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
