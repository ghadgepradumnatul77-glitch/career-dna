import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dna, ShieldCheck, FileCode, GitBranch, Terminal } from 'lucide-react'

export const InteractiveDNACore = ({ readinessScore = 82, targetRole = 'AI/ML Engineer' }) => {
  const [hoveredNode, setHoveredNode] = useState(null)

  const skillNodes = [
    { id: 'python', name: 'Python', score: 88, confidence: 94, category: 'Code', evidenceCount: 14, angle: 0 },
    { id: 'ml', name: 'Machine Learning', score: 81, confidence: 88, category: 'AI', evidenceCount: 8, angle: 51 },
    { id: 'pytorch', name: 'PyTorch', score: 76, confidence: 82, category: 'AI', evidenceCount: 5, angle: 102 },
    { id: 'git', name: 'Git & Commits', score: 85, confidence: 96, category: 'DevOps', evidenceCount: 450, angle: 154 },
    { id: 'sql', name: 'SQL & Data', score: 62, confidence: 78, category: 'Data', evidenceCount: 4, angle: 205 },
    { id: 'fastapi', name: 'FastAPI Serving', score: 58, confidence: 64, category: 'Backend', evidenceCount: 2, angle: 257 },
    { id: 'docker', name: 'Docker / MLOps', score: 42, confidence: 50, category: 'DevOps', evidenceCount: 1, angle: 308 }
  ]

  const center = { x: 260, y: 260 }
  const radius = 175

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        aspectRatio: '1',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      <svg
        viewBox="0 0 520 520"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5500" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#FF7722" />
          </linearGradient>
        </defs>

        {/* Orbit Background Rings */}
        <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={center.x} cy={center.y} r={radius * 0.55} fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />

        {/* Connecting Lines */}
        {skillNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180
          const x = center.x + radius * Math.cos(rad)
          const y = center.y + radius * Math.sin(rad)
          const isHovered = hoveredNode === node.id

          return (
            <g key={`line-${node.id}`}>
              <line
                x1={center.x}
                y1={center.y}
                x2={x}
                y2={y}
                stroke={isHovered ? 'url(#lineGradActive)' : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth={isHovered ? 2.5 : 1}
                strokeDasharray={isHovered ? 'none' : '4 4'}
                style={{ transition: 'all 0.3s ease' }}
              />
              {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#FF5500"
                  style={{ filter: 'drop-shadow(0 0 8px #FF5500)' }}
                />
              )}
            </g>
          )
        })}

        {/* Outer Skill Nodes */}
        {skillNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180
          const x = center.x + radius * Math.cos(rad)
          const y = center.y + radius * Math.sin(rad)
          const isHovered = hoveredNode === node.id

          return (
            <g
              key={`node-${node.id}`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer Glow on hover */}
              {isHovered && (
                <circle cx={x} cy={y} r="28" fill="#FF5500" opacity="0.2" style={{ filter: 'blur(6px)' }} />
              )}
              {/* Node Circle */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 22 : 18}
                fill={isHovered ? '#FF5500' : '#121824'}
                stroke={isHovered ? '#FFAA88' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth={isHovered ? 2 : 1}
                style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
              {/* Node Label Text */}
              <text
                x={x}
                y={y + (y > center.y ? 34 : -24)}
                textAnchor="middle"
                fill={isHovered ? '#FFFFFF' : '#9CA3AF'}
                fontSize="11"
                fontWeight={isHovered ? '700' : '600'}
                fontFamily="var(--font-sans)"
              >
                {node.name}
              </text>
              {/* Score Inside Node */}
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill={isHovered ? '#FFFFFF' : '#F9FAFB'}
                fontSize="10"
                fontWeight="800"
                fontFamily="var(--font-mono)"
              >
                {node.score}
              </text>
            </g>
          )
        })}

        {/* Central Career DNA Core */}
        <circle cx={center.x} cy={center.y} r="65" fill="url(#coreGlow)" />
        <circle
          cx={center.x}
          cy={center.y}
          r="48"
          fill="#121824"
          stroke="#FF5500"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 15px rgba(255, 85, 0, 0.4))' }}
        />
        <foreignObject x={center.x - 48} y={center.y - 48} width="96" height="96">
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <Dna size={18} style={{ color: '#FF5500', marginBottom: '2px' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {readinessScore}
            </span>
            <span style={{ fontSize: '0.625rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700, marginTop: '2px' }}>
              DNA INDEX
            </span>
          </div>
        </foreignObject>
      </svg>

      {/* Floating Tooltip Detail Card on Hover */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(18, 24, 36, 0.95)',
              border: '1px solid #FF5500',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1rem',
              boxShadow: 'var(--shadow-glow-orange)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '220px',
              textAlign: 'center'
            }}
          >
            {(() => {
              const node = skillNodes.find((n) => n.id === hoveredNode)
              if (!node) return null
              return (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>
                    {node.name} — <span style={{ color: '#FF5500' }}>{node.score}/100</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                    <span>⚡ {node.confidence}% Confidence</span>
                    <span>📁 {node.evidenceCount} Receipts</span>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InteractiveDNACore
