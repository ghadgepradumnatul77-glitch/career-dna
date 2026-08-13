import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, GitBranch, Code, GitCommit, ShieldCheck, Database } from 'lucide-react'

export const EvidenceKnowledgeGraph = ({ skillName = 'Python', score = 86, confidence = 91 }) => {
  const [activeNode, setActiveNode] = useState(null)

  const nodes = [
    { id: 'resume', label: 'Resume Claims', icon: FileText, color: '#A855F7', source: 'Resume PDF', strength: 'STRONG', conf: 90, date: 'Verified 2026', desc: 'Extracted 4 machine learning project entries & data pipeline specs.' },
    { id: 'github', label: 'GitHub Repos', icon: GitBranch, color: '#38BDF8', source: 'Public GitHub', strength: 'EXPERT', conf: 96, date: '3 days ago', desc: 'ML-Predictor & vision-transformer-pytorch repositories analyzed.' },
    { id: 'code', label: 'AST Code Analysis', icon: Code, color: '#FF7700', source: 'AST Inspection', strength: 'HIGH', conf: 92, date: 'Verified', desc: 'Verified torch.nn.Module, pandas, asyncio, and custom class OOP usage.' },
    { id: 'commits', label: 'Commit Velocity', icon: GitCommit, color: '#10B981', source: 'Git Log', strength: 'CONSISTENT', conf: 95, date: 'Active Daily', desc: '450+ verified commits across 6 repositories with clean git diffs.' }
  ]

  const center = { x: 250, y: 220 }
  const positions = [
    { x: 100, y: 90 },   // Top-Left
    { x: 400, y: 90 },   // Top-Right
    { x: 100, y: 350 },  // Bottom-Left
    { x: 400, y: 350 }   // Bottom-Right
  ]

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        position: 'relative',
        boxShadow: 'var(--shadow-glow-purple)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>AI KNOWLEDGE GRAPH</span>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#FFF' }}>Interactive Evidence Network</h3>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Hover node to inspect verified proof sources
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '420px', margin: '0 auto' }}>
        <svg viewBox="0 0 500 420" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Connecting Animated Lines */}
          {nodes.map((node, i) => {
            const pos = positions[i]
            const isHovered = activeNode === node.id

            return (
              <g key={`link-${node.id}`}>
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isHovered ? node.color : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isHovered ? 2.5 : 1}
                  strokeDasharray={isHovered ? 'none' : '4 4'}
                  style={{ transition: 'all 0.3s ease' }}
                />
              </g>
            )
          })}

          {/* Outer Evidence Nodes */}
          {nodes.map((node, i) => {
            const pos = positions[i]
            const isHovered = activeNode === node.id

            return (
              <g
                key={`node-${node.id}`}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                style={{ cursor: 'pointer' }}
                className="interactive-node"
              >
                {isHovered && (
                  <circle cx={pos.x} cy={pos.y} r="32" fill={node.color} opacity="0.2" style={{ filter: 'blur(8px)' }} />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 26 : 22}
                  fill="#0B0E24"
                  stroke={isHovered ? node.color : 'rgba(255, 255, 255, 0.2)'}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                />
                <text
                  x={pos.x}
                  y={pos.y + (pos.y > center.y ? 42 : -32)}
                  textAnchor="middle"
                  fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                  fontSize="12"
                  fontWeight={isHovered ? '800' : '600'}
                  fontFamily="var(--font-sans)"
                >
                  {node.label}
                </text>
              </g>
            )
          })}

          {/* Central Skill Core */}
          <circle cx={center.x} cy={center.y} r="55" fill="rgba(139, 92, 246, 0.15)" style={{ filter: 'blur(10px)' }} />
          <circle cx={center.x} cy={center.y} r="42" fill="#0B0E24" stroke="#8B5CF6" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.5))' }} />
          <foreignObject x={center.x - 42} y={center.y - 42} width="84" height="84">
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-purple-light)', textTransform: 'uppercase' }}>{skillName}</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-mono)', lineHeight: 1, marginTop: '2px' }}>{score}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)' }}>{confidence}% Conf</span>
            </div>
          </foreignObject>
        </svg>

        {/* Hover Tooltip Details Card */}
        <AnimatePresence>
          {activeNode && (
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
                background: 'rgba(11, 14, 36, 0.95)',
                border: '1px solid var(--color-purple-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                boxShadow: 'var(--shadow-glow-purple)',
                backdropFilter: 'blur(12px)',
                pointerEvents: 'none',
                zIndex: 10,
                width: '85%',
                maxWidth: '340px',
                textAlign: 'left'
              }}
            >
              {(() => {
                const node = nodes.find((n) => n.id === activeNode)
                if (!node) return null
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>{node.label}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{node.strength}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>{node.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-purple-light)', marginTop: '6px', fontWeight: 700 }}>
                      <span>Source: {node.source}</span>
                      <span>{node.conf}% Conf • {node.date}</span>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EvidenceKnowledgeGraph
