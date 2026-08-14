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

  // MATHEMATICAL SINGLE SOURCE OF TRUTH: Polar Coordinates (Percentage-based)
  // Center: Exactly 50%, 50%
  // Radius: Exactly 33% from center
  const centerPercent = { x: 50, y: 50 }
  const radiusPercent = 33

  // Fixed Symmetrical Node Angles (Regular 72° Pentagonal Symmetry)
  // Vertical Axis of Symmetry: x = 50%
  // LEARN (-90°): on vertical axis (50%, 17%)
  // PROJECTS (-18°) ↔ EVIDENCE (-162°): exact horizontal mirror pair
  // CAREER (54°) ↔ GROWTH (126°): exact horizontal mirror pair
  const nodeDefs = [
    {
      id: 'learn',
      label: 'LEARN',
      tag: 'Build Skills',
      icon: GraduationCap,
      color: '#00D2FF',
      angle: -90
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      tag: 'Build & Ship',
      icon: Code2,
      color: '#38BDF8',
      angle: -18
    },
    {
      id: 'career',
      label: 'CAREER',
      tag: 'Achieve Goals',
      icon: Briefcase,
      color: '#FF8800',
      angle: 54
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      icon: TrendingUp,
      color: '#EC4899',
      angle: 126
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      tag: 'Prove It',
      icon: ShieldCheck,
      color: '#A855F7',
      angle: -162
    }
  ]

  // Compute exact mathematical Cartesian coordinates for each node
  const nodes = nodeDefs.map((n, i) => {
    const rad = (n.angle * Math.PI) / 180
    const left = centerPercent.x + radiusPercent * Math.cos(rad)
    const top = centerPercent.y + radiusPercent * Math.sin(rad)
    return {
      ...n,
      left: `${left}%`,
      top: `${top}%`,
      delay: i * 0.4
    }
  })

  // SVG coordinate constants for 560 x 560 viewBox
  const svgCenter = 280
  const svgRadius = (radiusPercent / 100) * 560 // 184.8px

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
        maxWidth: '560px',
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        perspective: 1000
      }}
    >
      {/* Soft Ambient Radial Halo mathematically centered behind Core */}
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
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: hoveredNode
            ? `radial-gradient(circle, ${nodes.find((n) => n.id === hoveredNode)?.color}55 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(0, 210, 255, 0.10) 40%, transparent 75%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: `translate(calc(-50% + ${parallaxOffset.x}px), calc(-50% + ${parallaxOffset.y}px))`
        }}
      />

      {/* SVG TRUE CIRCULAR RING TOPOLOGY (Centered at 280, 280) */}
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
          {/* Continuous Multi-Color Ring Gradient */}
          <linearGradient id="symmetricRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.95" />
          </linearGradient>

          {/* Faint Base Ring Glow Gradient */}
          <linearGradient id="symmetricGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.25" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Faint Inner Core Orbit Guide */}
        <circle
          cx={svgCenter}
          cy={svgCenter}
          r="105"
          fill="none"
          stroke="rgba(139, 92, 246, 0.14)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Glow Halo behind Main Circle */}
        <circle
          cx={svgCenter}
          cy={svgCenter}
          r={svgRadius}
          fill="none"
          stroke="url(#symmetricGlowGrad)"
          strokeWidth="4"
          style={{
            filter: 'blur(3px)'
          }}
        />

        {/* TRUE PERFECT CIRCULAR RING */}
        <circle
          cx={svgCenter}
          cy={svgCenter}
          r={svgRadius}
          fill="none"
          stroke="url(#symmetricRingGrad)"
          strokeWidth="2.2"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(0, 210, 255, 0.45))'
          }}
        />

        {/* Animated Flowing Light Pulse along the Circular Ring */}
        {!shouldReduceMotion && (
          <motion.circle
            cx={svgCenter}
            cy={svgCenter}
            r={svgRadius}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeDasharray="40 340"
            animate={{ rotate: 360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              transformOrigin: `${svgCenter}px ${svgCenter}px`,
              filter: 'drop-shadow(0 0 8px #FFFFFF)'
            }}
          />
        )}
      </svg>

      {/* EXACTLY MATHEMATICALLY CENTERED CORE: CAREER DNA NEURAL HUB */}
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
            ? '0 0 28px rgba(0, 210, 255, 0.45), inset 0 0 16px rgba(168, 85, 247, 0.3)'
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

      {/* 5 MATHEMATICALLY POSITIONED NODES (Polar calculated, separate label offset) */}
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
                    scale: isHovered ? 1.04 : 1
                  }
            }
            transition={{
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              left: node.left,
              top: node.top,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Circular Glass Icon Node strictly centered on the Ring vertex */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: isHovered ? 'rgba(20, 26, 60, 0.96)' : 'rgba(8, 12, 28, 0.90)',
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
                  transition: 'all 0.25s ease'
                }}
              >
                <Icon size={20} style={{ filter: isHovered ? `drop-shadow(0 0 5px ${node.color})` : 'none' }} />
              </div>

              {/* Labels with absolute offset (never shifts node coordinate on the circle) */}
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  opacity: isAnyHovered && !isHovered ? 0.55 : 1,
                  transition: 'opacity 0.25s ease'
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
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default CareerIntelligenceVisual
