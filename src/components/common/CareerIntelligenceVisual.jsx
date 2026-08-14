import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export const CareerIntelligenceVisual = () => {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [isCoreHovered, setIsCoreHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // SINGLE SOURCE OF TRUTH: 800 x 800 SVG Canvas
  // Center: Exactly (400, 400)
  // Ring Radius: 280 (12.9% larger ring for spacious separation)
  // Core Radius: 80 (160px diameter central intelligence anchor)
  const CX = 400
  const CY = 400
  const RADIUS = 280
  const CORE_RADIUS = 80

  // 5 Symmetrical Node Angles (Regular 72° Pentagonal Symmetry)
  // LEARN: -90° (Zenith, on vertical axis x = 400)
  // PROJECTS: -18° (Upper-Right)
  // CAREER: 54° (Lower-Right, ample separation from Projects)
  // GROWTH: 126° (Lower-Left, ample separation from Evidence)
  // EVIDENCE: -162° (Upper-Left, exact mirror of Projects)
  const nodeDefs = [
    {
      id: 'learn',
      label: 'LEARN',
      tag: 'Build Skills',
      color: '#00D2FF',
      angle: -90,
      iconType: 'learn'
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      tag: 'Build & Ship',
      color: '#38BDF8',
      angle: -18,
      iconType: 'projects'
    },
    {
      id: 'career',
      label: 'CAREER',
      tag: 'Achieve Goals',
      color: '#FF8800',
      angle: 54,
      iconType: 'career'
    },
    {
      id: 'growth',
      label: 'GROWTH',
      tag: 'Keep Evolving',
      color: '#EC4899',
      angle: 126,
      iconType: 'growth'
    },
    {
      id: 'evidence',
      label: 'EVIDENCE',
      tag: 'Prove It',
      color: '#A855F7',
      angle: -162,
      iconType: 'evidence'
    }
  ]

  // Calculate Cartesian coordinates in 800x800 SVG
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

  // Pure SVG Icon Paths (Enlarged by ~25% for high clarity and legibility)
  const renderSvgIcon = (type, color) => {
    switch (type) {
      case 'learn': // GraduationCap
        return (
          <g
            transform="translate(-12, -12) scale(1.02)"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
            <path d="M22 10v6" />
            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
          </g>
        )
      case 'evidence': // ShieldCheck
        return (
          <g
            transform="translate(-12, -12) scale(1.02)"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
          </g>
        )
      case 'projects': // Code2
        return (
          <g
            transform="translate(-12, -12) scale(1.02)"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </g>
        )
      case 'growth': // TrendingUp
        return (
          <g
            transform="translate(-12, -12) scale(1.02)"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </g>
        )
      case 'career': // Briefcase
        return (
          <g
            transform="translate(-12, -12) scale(1.02)"
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </g>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="career-dna-visual"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        userSelect: 'none'
      }}
    >
      {/* ONE SINGLE UNIFIED SVG CANVAS */}
      <svg
        viewBox="0 0 800 800"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          overflow: 'visible'
        }}
      >
        <defs>
          {/* Continuous Multi-Color Ring Gradient */}
          <linearGradient id="ringTopologyGrad800" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.92" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.88" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.92" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.92" />
          </linearGradient>

          {/* Faint Ring Glow Gradient */}
          <linearGradient id="ringGlowGrad800" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.22" />
            <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#FF8800" stopOpacity="0.22" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.22" />
          </linearGradient>

          {/* Core Dark Glass Fill */}
          <radialGradient id="coreGlassGrad800" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#141838" stopOpacity="0.96" />
            <stop offset="85%" stopColor="#060814" stopOpacity="0.98" />
          </radialGradient>

          {/* Core Icon Badge Gradient */}
          <linearGradient id="coreIconGrad800" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        {/* Faint Inner Core Orbit Guide */}
        <circle
          cx={CX}
          cy={CY}
          r="135"
          fill="none"
          stroke="rgba(139, 92, 246, 0.12)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          pointerEvents="none"
        />

        {/* Glow Halo behind Main Circle */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="url(#ringGlowGrad800)"
          strokeWidth="5"
          opacity="0.6"
          style={{ filter: 'blur(3px)' }}
          pointerEvents="none"
        />

        {/* TRUE PERFECT CIRCULAR RING (Single Ring, Radius 280, Center 400, 400) */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="url(#ringTopologyGrad800)"
          strokeWidth="2.5"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0, 210, 255, 0.4))' }}
          pointerEvents="none"
        />

        {/* Animated Light Dash Traveling around the Ring */}
        {!shouldReduceMotion && (
          <motion.circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="50 500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              filter: 'drop-shadow(0 0 8px #FFFFFF)'
            }}
            pointerEvents="none"
          />
        )}

        {/* ======================================================== */}
        {/* CENTER CORE: GROUP TRANSLATED TO (400, 400)               */}
        {/* ======================================================== */}
        <g
          transform={`translate(${CX}, ${CY})`}
          onMouseEnter={() => setIsCoreHovered(true)}
          onMouseLeave={() => setIsCoreHovered(false)}
          style={{ cursor: 'default' }}
        >
          {/* Core Outer Halo */}
          <circle
            cx="0"
            cy="0"
            r={CORE_RADIUS + 8}
            fill="none"
            stroke={isCoreHovered ? 'rgba(0, 210, 255, 0.38)' : 'rgba(139, 92, 246, 0.2)'}
            strokeWidth="1.2"
            strokeDasharray="4 5"
          />

          {/* Core Main Disc (Radius 80 = 160px diameter) */}
          <circle
            cx="0"
            cy="0"
            r={CORE_RADIUS}
            fill="url(#coreGlassGrad800)"
            stroke={isCoreHovered ? 'rgba(0, 210, 255, 0.85)' : 'rgba(139, 92, 246, 0.5)'}
            strokeWidth={isCoreHovered ? 1.8 : 1.3}
            style={{
              filter: isCoreHovered
                ? 'drop-shadow(0 0 22px rgba(0, 210, 255, 0.45))'
                : 'drop-shadow(0 0 14px rgba(139, 92, 246, 0.25))',
              transition: 'all 0.3s ease'
            }}
          />

          {/* Core Icon Badge Circle */}
          <circle
            cx="0"
            cy="-19"
            r="21"
            fill="url(#coreIconGrad800)"
            stroke="rgba(168, 85, 247, 0.5)"
            strokeWidth="1.1"
            style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.35))' }}
          />

          {/* Pure SVG DNA Icon */}
          <g
            transform="translate(-11, -30) scale(0.9)"
            fill="none"
            stroke="#C084FC"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 5px rgba(168, 85, 247, 0.8))' }}
          >
            <path d="M2 15c6.667-6 13.333 0 20-6" />
            <path d="m9 22 3-6" />
            <path d="m14 8 1-6" />
            <path d="M17 6l-2.5-2.5" />
            <path d="M14 8l-1-1" />
            <path d="M7 18l2.5 2.5" />
            <path d="m3.5 14.5.5.5" />
            <path d="m20 9.5.5.5" />
            <path d="m6.5 12.5 1 1" />
            <path d="m16.5 10.5 1 1" />
            <path d="m10 16 1.5 1.5" />
          </g>

          {/* CAREER DNA Title Text */}
          <text
            x="0"
            y="18"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="16.5"
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
            fontSize="11.5"
            fontWeight="700"
            letterSpacing="0.08em"
            style={{ fontFamily: 'inherit', textTransform: 'uppercase', pointerEvents: 'none' }}
          >
            Neural Core
          </text>
        </g>

        {/* ======================================================== */}
        {/* FIVE NODES GENERATED FROM POLAR COORDINATES              */}
        {/* ======================================================== */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id
          const isAnyHovered = Boolean(hoveredNode)

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Node Outer Halo on Hover */}
              <circle
                cx="0"
                cy="0"
                r="34"
                fill="none"
                stroke={isHovered ? `${node.color}55` : 'transparent'}
                strokeWidth="1.4"
                style={{ transition: 'stroke 0.25s ease' }}
              />

              {/* Node Circular Badge (Radius 27 = 54px diameter) */}
              <circle
                cx="0"
                cy="0"
                r="27"
                fill={isHovered ? 'rgba(20, 26, 60, 0.96)' : 'rgba(8, 12, 28, 0.92)'}
                stroke={isHovered ? node.color : `${node.color}CC`}
                strokeWidth={isHovered ? 2 : 1.4}
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 14px ${node.color})`
                    : `drop-shadow(0 0 8px ${node.color}44)`,
                  transition: 'all 0.25s ease'
                }}
              />

              {/* Pure SVG Icon (Enlarged ~25%) */}
              {renderSvgIcon(node.iconType, node.color)}

              {/* Label Group with generous spacing */}
              <g
                opacity={isAnyHovered && !isHovered ? 0.55 : 1}
                style={{ transition: 'opacity 0.25s ease', pointerEvents: 'none' }}
              >
                {/* Node Title */}
                <text
                  x="0"
                  y="45"
                  textAnchor="middle"
                  fill={isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)'}
                  fontSize="15"
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
                  y="62"
                  textAnchor="middle"
                  fill={isHovered ? node.color : '#94A3B8'}
                  fontSize="11.5"
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
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default CareerIntelligenceVisual
