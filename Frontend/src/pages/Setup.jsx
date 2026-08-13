import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  Github,
  CheckCircle,
  X,
  Target,
  ArrowRight,
  ArrowLeft,
  Shield,
  Code2,
  GitCommit,
  FolderGit2,
  Brain,
  Terminal,
  Database,
  Check,
  Sparkles
} from 'lucide-react'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { validateResumeFile, validateGithubInput } from '../utils/validators'
import { formatBytes } from '../utils/formatters'
import dnaHeroHelixImg from '../assets/dna_hero_helix.jpg'

export const Setup = () => {
  const navigate = useNavigate()
  const { user, updateUser, updateTargetRole, resume, updateResume, github, updateGithub } = useApp()

  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState('')
  const [githubError, setGithubError] = useState('')
  const [activeStep, setActiveStep] = useState(1) // Step progress tracker

  const careerRoles = [
    {
      id: 'AI/ML Engineer',
      title: 'AI/ML Engineer',
      desc: 'Build intelligent systems, neural networks & ML models',
      icon: Brain,
      color: '#A855F7'
    },
    {
      id: 'Software Engineer',
      title: 'Software Engineer',
      desc: 'Build scalable full-stack applications & microservices',
      icon: Terminal,
      color: '#38BDF8'
    },
    {
      id: 'Data Scientist',
      title: 'Data Scientist',
      desc: 'Discover insights, build statistical models & data pipelines',
      icon: Database,
      color: '#FF7700'
    }
  ]

  const handleFileSelect = (file) => {
    const check = validateResumeFile(file)
    if (!check.valid) {
      setFileError(check.message)
      return
    }
    setFileError('')
    updateResume({
      file,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'ready'
    })
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleGithubChange = (val) => {
    updateGithub({ username: val })
    const check = validateGithubInput(val)
    if (val && !check.valid) {
      setGithubError(check.message)
    } else {
      setGithubError('')
      if (val) {
        updateGithub({ username: check.username, status: 'ready' })
      }
    }
  }

  const handleStartAnalysis = (e) => {
    e.preventDefault()
    if (!user.name) {
      updateUser({ name: 'Alex Morgan' })
    }
    if (!github.username) {
      updateGithub({ username: 'candidate-dev', status: 'ready' })
    }
    navigate('/processing')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text-main)',
        padding: 'var(--space-6) var(--space-6)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        {/* Top Header Bar with Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#FFFFFF'
              e.currentTarget.children[0].style.transform = 'translateX(-3px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)'
              e.currentTarget.children[0].style.transform = 'translateX(0px)'
            }}
          >
            <ArrowLeft size={16} style={{ transition: 'transform 0.2s ease' }} />
            <span>Back to Home</span>
          </button>

          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
            CAREER DNA / HACKNEXUS'26
          </span>
        </div>

        {/* Step Progress Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: 'var(--space-8)',
            padding: '0.75rem 1.5rem',
            background: 'rgba(10, 14, 30, 0.78)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            maxWidth: '650px',
            margin: '0 auto var(--space-8) auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', fontWeight: 800, color: '#FFF' }}>
            <span style={{ color: 'var(--color-purple-light)' }}>01</span> PROFILE
          </div>
          <div style={{ width: '30px', height: '1px', background: 'var(--color-purple-light)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', fontWeight: 800, color: '#FFF' }}>
            <span style={{ color: 'var(--color-blue-light)' }}>02</span> CAREER
          </div>
          <div style={{ width: '30px', height: '1px', background: 'var(--color-blue-light)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', fontWeight: 800, color: '#FFF' }}>
            <span style={{ color: 'var(--color-orange-light)' }}>03</span> EVIDENCE
          </div>
          <div style={{ width: '30px', height: '1px', background: 'var(--color-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', fontWeight: 800, color: 'var(--color-text-dim)' }}>
            <span>04</span> ANALYSIS
          </div>
        </div>

        {/* Hero Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}
        >
          <h1 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.035em' }}>
            BUILD YOUR <span className="gradient-text-purple-orange">CAREER DNA.</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            "Give us the evidence behind your career. We'll show you where you stand."
          </p>
        </motion.div>

        {/* Main Form Portal Layered Composition */}
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Background Layer DNA Asset (Layer 2) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '750px',
              height: '500px',
              opacity: 0.22,
              pointerEvents: 'none',
              zIndex: 1,
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              filter: 'blur(4px)'
            }}
          >
            <img src={dnaHeroHelixImg} alt="Background DNA Visual" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Floating Overlapping Information Cards (Layer 4) */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '-25px',
              right: '-15px',
              zIndex: 4,
              background: 'rgba(10, 14, 30, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.65rem 1rem',
              boxShadow: 'var(--shadow-glow-purple)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', fontWeight: 800 }}>EVIDENCE CONFIDENCE</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-purple-light)', fontFamily: 'var(--font-mono)' }}>
              91% <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>✓ High Proof</span>
            </div>
          </div>

          <div
            className="animate-float"
            style={{
              animationDelay: '2s',
              position: 'absolute',
              bottom: '-20px',
              left: '-15px',
              zIndex: 4,
              background: 'rgba(10, 14, 30, 0.95)',
              border: '1px solid rgba(255, 85, 0, 0.5)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.65rem 1rem',
              boxShadow: 'var(--shadow-glow-orange)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', fontWeight: 800 }}>TARGET CAREER</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>{user.targetRole}</div>
          </div>

          {/* Main Translucent Glass Portal Panel (Layer 3) */}
          <motion.form
            onSubmit={handleStartAnalysis}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              zIndex: 3,
              background: 'rgba(10, 15, 35, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)'
            }}
          >
            {/* Section 1: Candidate Profile Info */}
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem', fontSize: '0.675rem' }}>01 PROFILE DETAILS</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#FFF' }}>Who are you?</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => updateUser({ name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: '#FFF',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => updateUser({ email: e.target.value })}
                    placeholder="alex@hacknexus.io"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: '#FFF',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Interactive Target Career Selection Cards */}
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '0.5rem', fontSize: '0.675rem' }}>02 TARGET ROLE</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#FFF' }}>Select your target career path</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {careerRoles.map((role) => {
                  const Icon = role.icon
                  const isSelected = user.targetRole === role.id

                  return (
                    <motion.div
                      key={role.id}
                      onClick={() => updateTargetRole(role.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? `2px solid ${role.color}` : '1px solid var(--color-border)',
                        boxShadow: isSelected ? `0 0 20px ${role.color}44` : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        position: 'relative',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '22px', height: '22px', borderRadius: '50%', background: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                          <Check size={14} />
                        </div>
                      )}

                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: `rgba(${role.color === '#A855F7' ? '168, 85, 247' : role.color === '#38BDF8' ? '56, 189, 248' : '255, 119, 0'}, 0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: role.color }}>
                        <Icon size={20} />
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFF' }}>{role.title}</div>
                      <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{role.desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Section 3: Evidence Inputs (GitHub + Resume) */}
            <div>
              <span className="badge badge-orange" style={{ marginBottom: '0.5rem', fontSize: '0.675rem' }}>03 EVIDENCE SOURCES</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#FFF' }}>Provide your technical proof</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* GitHub Input */}
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Github size={18} style={{ color: 'var(--color-blue-light)' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFF' }}>GitHub Profile Link</span>
                  </div>

                  <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={github.username}
                      onChange={(e) => handleGithubChange(e.target.value)}
                      placeholder="github.com/username"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        color: '#FFF',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <Github size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                  </div>

                  {githubError && <p style={{ color: 'var(--color-danger)', fontSize: '0.775rem', margin: '0 0 0.5rem 0' }}>{githubError}</p>}

                  <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={13} /> GitHub Profile Ready (12 Repositories Analyzed)
                  </div>
                </div>

                {/* Resume Upload Dropzone */}
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <FileText size={18} style={{ color: 'var(--color-purple-light)' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFF' }}>Resume PDF Upload</span>
                  </div>

                  {!resume.file && !resume.fileName ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      style={{
                        border: `2px dashed ${dragActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        textAlign: 'center',
                        background: dragActive ? 'rgba(255, 85, 0, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="file"
                        id="resumeInputSetup"
                        accept="application/pdf"
                        onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="resumeInputSetup" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                        <Upload size={24} style={{ color: 'var(--color-accent)' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FFF' }}>Drop PDF Resume here</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>PDF Max 10MB</span>
                      </label>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={20} style={{ color: 'var(--color-success)' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FFF' }}>
                            {resume.fileName || 'candidate_resume.pdf'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>
                            {resume.fileSize ? formatBytes(resume.fileSize) : 'Uploaded'} • Ready for parsing
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateResume({ file: null, fileName: '', fileSize: 0, status: 'idle' })}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {fileError && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.35rem' }}>{fileError}</p>}
                </div>
              </div>
            </div>

            {/* Primary Submit CTA */}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              <Button type="submit" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                BUILD MY CAREER DNA →
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
}

export default Setup
