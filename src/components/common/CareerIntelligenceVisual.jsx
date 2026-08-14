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

  // SINGLE SOURCE OF TRUTH: SVG Coordinate Space (800 x 800)
  // Center: Exactly (400, 400)
  // Ring Radius: Exactly 280
  const CX = 400
  const CY = 400
  const RADIUS = 280
  const CORE_RADIUS = 80

  // 5 Symmetrical Node Angles (Regular Mathematical Angles)
  // LEARN: -90° (Top, exactly on vertical centerline x = 400)
  // EVIDENCE: -162° (Upper-Left, y = 313.5)
  // PROJECTS: -18° (Upper-Right, y = 313.5)
  // GROWTH: 162° (Lower-Left, y = 486.5)
  // CAREER: 18° (Lower-Right, y = 486.5)
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
      angle: 18
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      icon: TrendingUp,
      color: '#EC4899',
      angle: 162
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

  // Calculate precise mathematical Cartesian coordinates in 800 x 800 SVG canvas
  const nodes = nodeDefs.map((n) => {
    const rad = (n.angle * Math.PI) / 180
    const x = Number((CX + RADIUS * Math.cos(rad)).toFixed(2))
    const y = Number((CY + RADIUS * Math.sin(rad)).toFixed(2))
    return {
      ...n,
      x,
      y
    }
  })

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
        userSelect: 'none'
      }}
    >
      {/* SINGLE UNIFIED SVG CANVAS */}
      <svg
        viewBox="0 0 800 800"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          display: 'block'
        }}
      >
        <defs>
          {/* Continuous Multi-Color Ring Gradient */}
          <linearGradient id="ringTopologyGrad800" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.95" />
          </linearGradient>

          {/* Faint Base Ring Glow Gradient */}
          <linearGradient id="ringGlowGrad800" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.25" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.25" />
          </linearGradient>

          {/* Core Radial Gradient Fill */}
          <radialGradient id="coreGlassGrad800" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#121632" stopOpacity="0.96" />
            <stop offset="85%" stopColor="#060814" stopOpacity="0.98" />
          </radialGradient>

          {/* Core Icon Badge Gradient */}
          <linearGradient id="coreIconGrad800" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.25" />
          </linearGradient>

          {/* Filter for Drop Shadows and Soft Neon Glows */}
          <filter id="softGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* BACKGROUND AMBIENT RADIAL HALO (Centered at 400, 400) */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS + 40}
          fill="radial-gradient(circle, rgba(139, 92, 246, 0.16) 0%, rgba(0, 210, 255, 0.08) 50%, transparent 75%)"
          opacity="0.6"
          pointerEvents="none"
        />

        {/* Faint Inner Core Orbit Guide */}
        <circle
          cx={CX}
          cy={CY}
          r="140"
          fill="none"
          stroke="rgba(139, 92, 246, 0.14)"
          strokeWidth="1.2"
          strokeDasharray="5 7"
          pointerEvents="none"
        />

        {/* Glow Halo behind Main Circle */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="url(#ringGlowGrad800)"
          strokeWidth="6"
          opacity="0.8"
          style={{ filter: 'blur(4px)' }}
          pointerEvents="none"
        />

        {/* TRUE PERFECT CIRCULAR RING (Single Ring, Radius 280, Center 400, 400) */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="url(#ringTopologyGrad800)"
          strokeWidth="3"
          style={{ filter: 'drop-shadow(0 0 8px rgba(0, 210, 255, 0.45))' }}
          pointerEvents="none"
        />

        {/* Animated Continuous Light Pulse Dash along the Ring */}
        {!shouldReduceMotion && (
          <motion.circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeDasharray="60 500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              filter: 'drop-shadow(0 0 10px #FFFFFF)'
            }}
            pointerEvents="none"
          />
        )}

        {/* Flowing Light Particle along Ring Path */}
        {!shouldReduceMotion && (
          <motion.circle
            r="4.5"
            fill="#FFFFFF"
            style={{ filter: 'drop-shadow(0 0 8px #00D2FF)' }}
            animate={{
              cx: [400, 666.3, 666.3, 133.7, 133.7, 400],
              cy: [120, 313.5, 486.5, 486.5, 313.5, 120],
              opacity: [0.3, 0.95, 0.4, 0.95, 0.4, 0.3]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            pointerEvents="none"
          />
        )}

        {/* ======================================================== */}
        {/* CENTER CORE: GROUP TRANSLATED TO (400, 400)               */}
        {/* ======================================================== */}
        <motion.g
          transform={`translate(${CX + parallaxOffset.x} ${CY + parallaxOffset.y})`}
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
          style={{ cursor: 'default' }}
        >
          {/* Core Outer Halo */}
          <circle
            cx="0"
            cy="0"
            r={CORE_RADIUS + 8}
            fill="none"
            stroke={isCoreHovered ? 'rgba(0, 210, 255, 0.3)' : 'rgba(139, 92, 246, 0.2)'}
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* Core Main Disc (Radius 80 = 160px diameter) */}
          <circle
            cx="0"
            cy="0"
            r={CORE_RADIUS}
            fill="url(#coreGlassGrad800)"
            stroke={isCoreHovered ? 'rgba(0, 210, 255, 0.85)' : 'rgba(139, 92, 246, 0.5)'}
            strokeWidth={isCoreHovered ? 2 : 1.4}
            style={{
              filter: isCoreHovered
                ? 'drop-shadow(0 0 24px rgba(0, 210, 255, 0.5))'
                : 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.3))',
              transition: 'all 0.3s ease'
            }}
          />

          {/* Core Icon Badge Circle */}
          <circle
            cx="0"
            cy="-20"
            r="22"
            fill="url(#coreIconGrad800)"
            stroke="rgba(168, 85, 247, 0.55)"
            strokeWidth="1.2"
            style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))' }}
          />

          {/* Center DNA Icon inside foreignObject or SVG */}
          <foreignObject x="-14" y="-34" width="28" height="28" style={{ pointerEvents: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <Dna size={22} style={{ color: '#C084FC', filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.85))' }} />
            </div>
          </foreignObject>

          {/* CAREER DNA Title Text */}
          <text
            x="0"
            y="18"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="17"
            fontWeight="800"
            letterSpacing="0.09em"
            style={{ fontFamily: 'inherit', pointerEvents: 'none' }}
          >
            CAREER DNA
          </text>

          {/* NEURAL CORE Subtitle Text */}
          <text
            x="0"
            y="36"
            textAnchor="middle"
            fill="#C084FC"
            fontSize="12"
            fontWeight="700"
            letterSpacing="0.08em"
            style={{ fontFamily: 'inherit', textTransform: 'uppercase', pointerEvents: 'none' }}
          >
            Neural Core
          </text>
        </motion.g>

        {/* ======================================================== */}
        {/* FIVE NODES GENERATED FROM POLAR COORDINATES              */}
        {/* ======================================================== */}
        {nodes.map((node) => {
          const Icon = node.icon
          const isHovered = hoveredNode === node.id
          const isAnyHovered = Boolean(hoveredNode)

          return (
            <motion.g
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: isHovered ? 1.05 : 1
                    }
              }
              transition={{ scale: { duration: 0.2 } }}
              style={{ cursor: 'pointer' }}
            >
              {/* Node Outer Glass Halo */}
              <circle
                cx="0"
                cy="0"
                r="32"
                fill="none"
                stroke={isHovered ? `${node.color}55` : 'transparent'}
                strokeWidth="1.5"
                style={{ transition: 'stroke 0.25s ease' }}
              />

              {/* Node Circular Badge (Radius 26 = 52px diameter) */}
              <circle
                cx="0"
                cy="0"
                r="26"
                fill={isHovered ? 'rgba(20, 26, 60, 0.96)' : 'rgba(8, 12, 28, 0.92)'}
                stroke={isHovered ? node.color : `${node.color}AA`}
                strokeWidth={isHovered ? 2.2 : 1.5}
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 16px ${node.color})`
                    : `drop-shadow(0 0 10px ${node.color}55)`,
                  transition: 'all 0.25s ease'
                }}
              />

              {/* Centered Node Icon */}
              <foreignObject x="-14" y="-14" width="28" height="28" style={{ pointerEvents: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: node.color }}>
                  <Icon size={21} style={{ filter: isHovered ? `drop-shadow(0 0 6px ${node.color})` : 'none' }} />
                </div>
              </foreignObject>

              {/* Label Group (Centered relative to node's x,y) */}
              <g
                opacity={isAnyHovered && !isHovered ? 0.55 : 1}
                style={{ transition: 'opacity 0.25s ease', pointerEvents: 'none' }}
              >
                {/* Node Title Label */}
                <text
                  x="0"
                  y="46"
                  textAnchor="middle"
                  fill={isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)'}
                  fontSize="16"
                  fontWeight="800"
                  letterSpacing="0.07em"
                  style={{
                    fontFamily: 'inherit',
                    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9))'
                  }}
                >
                  {node.label}
                </text>

                {/* Node Subtitle Tag */}
                <text
                  x="0"
                  y="64"
                  textAnchor="middle"
                  fill={isHovered ? node.color : '#94A3B8'}
                  fontSize="12.5"
                  fontWeight="600"
                  style={{
                    fontFamily: 'inherit',
                    filter: 'drop-shadow(0 1px 6px rgba(0, 0, 0, 0.9))',
                    transition: 'fill 0.25s ease'
                  }}
                >
                  {node.tag}
                </text>
              </g>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

export default CareerIntelligenceVisual
