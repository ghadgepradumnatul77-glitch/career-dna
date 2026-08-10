import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dna,
  ShieldCheck,
  FileText,
  GitBranch,
  Target,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  FolderGit2,
  Terminal,
  Cpu,
  Layers,
  Database,
  Server,
  Layers3,
  Search,
  Activity,
  ArrowUpRight
} from 'lucide-react'
import Button from '../components/common/Button'
import RoleSelector from '../components/gaps/RoleSelector'
import InteractiveDNACore from '../components/common/InteractiveDNACore'
import EvidenceKnowledgeGraph from '../components/evidence/EvidenceKnowledgeGraph'
import ProficiencyConfidenceGauge from '../components/dashboard/ProficiencyConfidenceGauge'
import { useApp } from '../context/AppContext'
import dnaHeroHelixImg from '../assets/dna_hero_helix.jpg'
import evidenceSphereImg from '../assets/evidence_sphere.jpg'

export const Landing = () => {
  const navigate = useNavigate()
  const { user } = useApp()
  const [activeTabRole, setActiveTabRole] = useState('AI/ML Engineer')
  const [activePipelineStep, setActivePipelineStep] = useState(0)

  const heroVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    })
  }

  const featureBadges = [
    { title: 'Evidence-Backed', desc: 'Every score has proof', icon: ShieldCheck },
    { title: 'AI-Powered', desc: 'Static code AST analysis', icon: Sparkles },
    { title: 'Personalized', desc: 'Tailored to your target role', icon: Target },
    { title: 'Actionable', desc: 'Clear execution steps', icon: Zap }
  ]

  const pipelineSteps = [
    { num: '01', title: 'Evidence Collection', subtitle: 'Resume, GitHub, and Projects', color: '#8B5CF6', icon: FileText },
    { num: '02', title: 'AI Analysis', subtitle: 'Extract skills and measure proficiency', color: '#3B82F6', icon: GitBranch },
    { num: '03', title: 'Career DNA', subtitle: 'Calculate your readiness score', color: '#A855F7', icon: Dna },
    { num: '04', title: 'Gap Analysis', subtitle: 'Compare with target role requirements', color: '#FF5500', icon: Target },
    { num: '05', title: 'Next Best Action', subtitle: 'Get personalized recommendations', color: '#10B981', icon: Zap }
  ]

  const sampleGaps = {
    'AI/ML Engineer': [
      { skill: 'FastAPI Serving', level: 58, required: 85, gap: 27, priority: 'CRITICAL', color: '#EF4444' },
      { skill: 'Docker Containerization', level: 42, required: 80, gap: 38, priority: 'CRITICAL', color: '#EF4444' },
      { skill: 'SQL & Feature Store', level: 62, required: 80, gap: 18, priority: 'HIGH', color: '#FF5500' }
    ],
    'Software Engineer': [
      { skill: 'System Design & Scalability', level: 52, required: 85, gap: 33, priority: 'CRITICAL', color: '#EF4444' },
      { skill: 'Database Design & ORMs', level: 60, required: 80, gap: 20, priority: 'HIGH', color: '#FF5500' },
      { skill: 'Automated Testing', level: 45, required: 75, gap: 30, priority: 'HIGH', color: '#FF5500' }
    ],
    'Data Scientist': [
      { skill: 'Data Pipeline Airflow', level: 45, required: 80, gap: 35, priority: 'CRITICAL', color: '#EF4444' },
      { skill: 'Model API Deployment', level: 48, required: 75, gap: 27, priority: 'HIGH', color: '#FF5500' }
    ]
  }

  const techIcons = [
    { name: 'React', icon: Code2 },
    { name: 'FastAPI', icon: Server },
    { name: 'Python', icon: Terminal },
    { name: 'AI/ML', icon: Cpu },
    { name: 'TailwindCSS', icon: Layers },
    { name: 'PostgreSQL', icon: Database }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-6) var(--space-6)',
        overflowX: 'hidden',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Header Navigation Bar */}
      <header
        style={{
          width: '100%',
          maxWidth: '1280px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-10)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div
            className="navbar-logo-icon"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #FF5500 100%)', boxShadow: '0 0 18px rgba(139, 92, 246, 0.5)' }}
          >
            <Dna size={22} style={{ color: '#FFF' }} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
            Career<span style={{ color: 'var(--color-purple-light)' }}>DNA</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 600 }}>Problem</span>
          <span onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 600 }}>How It Works</span>
          <span onClick={() => document.getElementById('evidence-proof')?.scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 600 }}>Evidence Receipts</span>
          <span onClick={() => document.getElementById('next-action-preview')?.scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 600 }}>Next Action</span>
        </div>

        <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/setup')}>
          Get Started →
        </Button>
      </header>

      {/* Main Hero with Overlapping Depth System */}
      <main style={{ width: '100%', maxWidth: '1280px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'center',
            minHeight: '75vh',
            marginBottom: 'var(--space-16)',
            position: 'relative'
          }}
        >
          {/* Hero Copy (Left Side) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative', zIndex: 3 }}>
            <motion.h1
              custom={1}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
                margin: 0
              }}
            >
              KNOW WHAT YOUR <br />
              <span className="gradient-text-purple-orange">CAREER EVIDENCE</span> <br />
              ACTUALLY PROVES.
            </motion.h1>

            <motion.p
              custom={2}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.65,
                margin: 0
              }}
            >
              Career DNA analyzes your resume, GitHub work and project evidence to measure demonstrated skills, identify career gaps and recommend your next best action.
            </motion.p>

            <motion.div
              custom={3}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}
            >
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/setup')}
              >
                BUILD MY CAREER DNA →
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('how-it-works')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                SEE HOW IT WORKS
              </Button>
            </motion.div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
              Evidence-backed. AI-powered. Future-ready.
            </div>
          </div>

          {/* Overlapping Hero Visual Composition (Right Side) */}
          <motion.div
            custom={2}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Ambient Background Glowing Aura Layer (Layer 1) */}
            <motion.div
              animate={{
                scale: [0.95, 1.15, 0.95],
                opacity: [0.35, 0.65, 0.35]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                inset: '-30px',
                background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.5) 0%, rgba(255, 85, 0, 0.25) 50%, transparent 70%)',
                filter: 'blur(45px)',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />

            {/* Central Animated Floating DNA Helix Card (Layer 2) */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotateX: [0, 5, -5, 0],
                rotateY: [-8, 8, -8],
                scale: [1, 1.03, 1]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 0 50px rgba(139, 92, 246, 0.35), 0 0 100px rgba(255, 85, 0, 0.2)',
                zIndex: 2,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <img
                src={dnaHeroHelixImg}
                alt="Futuristic Glowing DNA Helix Network"
                style={{ width: '100%', height: 'auto', display: 'block', filter: 'brightness(0.95) contrast(1.05)' }}
              />

              {/* Data Light Sweep Effect overlay */}
              <motion.div
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 2
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
                  pointerEvents: 'none'
                }}
              />
            </motion.div>

            {/* Overlapping Floating Card 1 - Top Left: Python 86/100 (Layer 4) */}
            <div
              className="animate-float"
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-15px',
                zIndex: 4,
                background: 'rgba(10, 14, 30, 0.94)',
                border: '1px solid rgba(139, 92, 246, 0.5)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.65rem 1rem',
                boxShadow: 'var(--shadow-glow-purple)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', fontWeight: 800 }}>DEMONSTRATED SKILL</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF' }}>
                PYTHON <span style={{ fontSize: '0.85rem', color: 'var(--color-purple-light)', fontFamily: 'var(--font-mono)' }}>86/100</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Evidence Confidence 91%</div>
            </div>

            {/* Overlapping Floating Card 2 - Bottom Right: Career Readiness 82/100 (Layer 4) */}
            <div
              className="animate-float"
              style={{
                animationDelay: '1.8s',
                position: 'absolute',
                bottom: '-25px',
                right: '-15px',
                zIndex: 4,
                background: 'rgba(10, 14, 30, 0.94)',
                border: '1px solid rgba(255, 85, 0, 0.5)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem 1.15rem',
                boxShadow: 'var(--shadow-glow-orange)',
                backdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
                CAREER DNA SCORE
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-mono)', lineHeight: 1, marginTop: '2px' }}>
                82 <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>/100</span>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginTop: '4px' }}>Strong Foundation</span>
            </div>

            {/* Overlapping Floating Card 3 - Bottom Left: GitHub 12 Repos (Layer 4) */}
            <div
              className="animate-float"
              style={{
                animationDelay: '3.2s',
                position: 'absolute',
                bottom: '20px',
                left: '-20px',
                zIndex: 4,
                background: 'rgba(10, 14, 30, 0.94)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '0.55rem 0.85rem',
                boxShadow: '0 0 16px rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <GitBranch size={16} style={{ color: '#38BDF8' }} />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFF' }}>12 Repositories</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-success)' }}>✓ Analyzed & Verified</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Badges Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-16)'
          }}
        >
          {featureBadges.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="glass-panel"
                style={{
                  padding: 'var(--space-5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-purple-light)'
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#FFF' }}>{f.title}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>{f.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* SECTION 01 — THE PROBLEM (SCATTERED EVIDENCE ASSEMBLY) */}
        <section id="problem" style={{ marginBottom: 'var(--space-20)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-10)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>THE PROBLEM STATEMENT</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', margin: '0.5rem 0 1rem 0' }}>
              YOUR CAREER IS MORE THAN <br />
              <span className="gradient-text-purple-orange">YOUR RESUME.</span>
            </h2>
            <p style={{ maxWidth: '680px', margin: '0 auto var(--space-8) auto', fontSize: '1rem', color: 'var(--color-text-muted)' }}>
              "Career DNA doesn't judge what students claim on a 1-page PDF; it measures what they can actually demonstrate in real codebases."
            </p>

            {/* Scattered Fragments Assembly Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
              <motion.div whileHover={{ scale: 1.03, y: -4 }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <FileText size={24} style={{ color: '#A855F7', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>Resume PDF Claims</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>Unverified bullet points & skills</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03, y: -4 }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <GitBranch size={24} style={{ color: '#38BDF8', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>GitHub Code Evidence</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>Real AST parsing & imports</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03, y: -4 }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <Activity size={24} style={{ color: '#FF7700', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>Commit Velocity</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>Consistency & recency graph</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03, y: -4 }} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <Code2 size={24} style={{ color: '#10B981', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem' }}>Project Implementations</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>Production deployment proof</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 02 & 03 — STICKY 5-STAGE PIPELINE & EVIDENCE COLLECTION */}
        <section id="how-it-works" style={{ marginBottom: 'var(--space-20)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>AI ANALYSIS PROCESS</span>
            <h2 style={{ fontSize: '2.35rem', margin: '0.5rem 0' }}>WE DON'T JUST TAKE YOUR WORD FOR IT.</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Our 5-step AI Analysis Process from raw evidence collection to personalized recommendations
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              position: 'relative'
            }}
          >
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon
              const isActive = activePipelineStep === idx

              return (
                <motion.div
                  key={step.num}
                  onClick={() => setActivePipelineStep(idx)}
                  whileHover={{ scale: 1.02 }}
                  className="glass-panel"
                  style={{
                    padding: 'var(--space-6)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.65rem',
                    cursor: 'pointer',
                    borderColor: isActive ? step.color : 'var(--color-border)',
                    boxShadow: isActive ? `0 0 20px ${step.color}44` : 'none'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: `rgba(${step.color === '#8B5CF6' ? '139, 92, 246' : step.color === '#FF5500' ? '255, 85, 0' : '59, 130, 246'}, 0.15)`,
                      border: `1px solid ${step.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: step.color,
                      boxShadow: `0 0 15px ${step.color}44`
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {step.num}
                  </span>

                  <h3 style={{ fontSize: '1rem', margin: 0, color: '#FFF' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                    {step.subtitle}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* SECTION 04 & 05 — CAREER DNA CORE & PROFICIENCY VS CONFIDENCE */}
        <section style={{ marginBottom: 'var(--space-20)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>ORBITAL INTERACTION</span>
            <h2 style={{ fontSize: '2.25rem', margin: '0.5rem 0' }}>CAREER DNA ORBITAL CORE</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Hover skill nodes to inspect demonstrated evidence, confidence scores, and code receipts
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)', alignItems: 'center' }}>
            <InteractiveDNACore readinessScore={82} targetRole={user.targetRole} />
            <ProficiencyConfidenceGauge proficiency={86} confidence={91} />
          </div>
        </section>

        {/* SECTION 06 & 07 — EVERY SCORE HAS PROOF & KNOWLEDGE GRAPH */}
        <section id="evidence-proof" style={{ marginBottom: 'var(--space-20)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>EXPLAINABLE RECEIPTS</span>
            <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>EVERY SCORE HAS PROOF.</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              We bridge claimed resume keywords with static code AST analysis and GitHub repository metrics.
            </p>
          </div>

          <EvidenceKnowledgeGraph skillName="Python" score={88} confidence={94} />
        </section>

        {/* SECTION 08 & 09 — SKILL GAPS & OVERLAPPING ROLE COMPARISON */}
        <section style={{ marginBottom: 'var(--space-20)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-8)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: 'var(--space-6)' }}>
              <div>
                <span className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>GAP MATRIX</span>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>SEE WHAT'S MISSING.</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Select target role to recalculate benchmark requirements:</p>
              </div>

              {/* Role Switcher Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['AI/ML Engineer', 'Software Engineer', 'Data Scientist'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveTabRole(role)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: activeTabRole === role ? 'linear-gradient(135deg, #8B5CF6 0%, #FF5500 100%)' : 'rgba(255,255,255,0.03)',
                      color: activeTabRole === role ? '#FFF' : 'var(--color-text-muted)',
                      border: activeTabRole === role ? 'none' : '1px solid var(--color-border)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Gaps List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(sampleGaps[activeTabRole] || sampleGaps['AI/ML Engineer']).map((g, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 70px 50px 90px',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 1.1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>{g.skill}</span>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${g.level}%`, background: g.color }} />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>Req: {g.required}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>-{g.gap}</span>
                  <span className={`badge ${g.priority === 'CRITICAL' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>{g.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10 & 11 — NEXT BEST ACTION & OVERLAPPING ROADMAP */}
        <section id="next-action-preview" style={{ marginBottom: 'var(--space-20)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-8)', borderColor: 'rgba(255, 85, 0, 0.4)', boxShadow: 'var(--shadow-glow-orange)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <span className="badge badge-orange" style={{ marginBottom: '0.35rem' }}>RECOMMENDED ACTION</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Single Highest ROI Priority Step</div>
              </div>
              <span className="badge badge-purple">High Impact →</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: 'var(--space-4)', lineHeight: 1.15 }}>
              DON'T LEARN EVERYTHING. <br />
              <span className="gradient-orange">DO THE NEXT RIGHT THING.</span>
            </h2>

            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', marginBottom: 'var(--space-6)' }}>
              Action: Build and deploy an ML API using FastAPI
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: 'var(--space-6)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 800 }}>WHY?</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0', lineHeight: 1.6 }}>
                  "Your ML proficiency is strong, but your production deployment evidence is limited."
                </p>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 800 }}>EXPECTED IMPACT</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>+18 to 22 points</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Career DNA Readiness Score</div>
              </div>
            </div>

            {/* Vertical Step Roadmap */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="badge badge-purple">01 BUILD MODEL</span><span style={{ fontSize: '0.85rem', color: '#FFF' }}>Export trained PyTorch model to ONNX format</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="badge badge-blue">02 CREATE API</span><span style={{ fontSize: '0.85rem', color: '#FFF' }}>Build FastAPI REST microservice with Pydantic schema validation</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="badge badge-orange">03 CONTAINERIZE</span><span style={{ fontSize: '0.85rem', color: '#FFF' }}>Create multi-stage Dockerfile and Docker Compose setup</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="badge badge-success">04 DEPLOY</span><span style={{ fontSize: '0.85rem', color: '#FFF' }}>Deploy container to Cloud & add GitHub Action CI/CD workflow</span></div>
            </div>
          </div>
        </section>

        {/* SECTION 12 — FINAL CTA */}
        <section style={{ marginBottom: 'var(--space-16)', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-12) var(--space-6)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(255, 85, 0, 0.15) 100%)', border: '1px solid rgba(255, 85, 0, 0.4)' }}>
            <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', margin: '0 0 1rem 0', letterSpacing: '-0.03em' }}>
              STOP GUESSING WHERE YOU STAND. <br />
              <span className="gradient-text-purple-orange">START PROVING IT.</span>
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto var(--space-6) auto', color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
              Build your verified Career DNA profile in under 2 minutes.
            </p>
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/setup')}>
              BUILD MY CAREER DNA →
            </Button>
          </div>
        </section>

        {/* Modern Technology Strip */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '1rem' }}>
            Built with Modern Technology
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {techIcons.map((t, idx) => {
              const Icon = t.icon
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Icon size={16} style={{ color: 'var(--color-purple-light)' }} />
                  <span>{t.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing
