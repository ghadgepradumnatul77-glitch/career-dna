import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award,
  Sparkles,
  Zap,
  GitPullRequest,
  FileCheck,
  Target,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import ReadinessScore from '../components/dashboard/ReadinessScore'
import SkillOverview from '../components/dashboard/SkillOverview'
import Strengths from '../components/dashboard/Strengths'
import Weaknesses from '../components/dashboard/Weaknesses'
import CareerSummary from '../components/dashboard/CareerSummary'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'

export const Dashboard = () => {
  const navigate = useNavigate()
  const { user, analysis, runAnalysis } = useApp()

  const dnaData = analysis.careerDNA

  // Auto-run analysis if page accessed directly before setup
  useEffect(() => {
    if (!dnaData && analysis.status === 'idle') {
      runAnalysis()
    }
  }, [dnaData, analysis.status])

  if (analysis.status === 'processing' || (!dnaData && analysis.status !== 'error')) {
    return <LoadingSpinner label="Computing Career DNA from verified repository evidence..." />
  }

  if (!dnaData) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
        <h2>No Career DNA Found</h2>
        <p>Please complete your candidate setup first to generate intelligence.</p>
        <Button variant="primary" onClick={() => navigate('/setup')}>
          Go to Setup
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-12)' }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
            CAREER INTELLIGENCE DASHBOARD
          </span>
          <h1 style={{ fontSize: '2.25rem', margin: 0 }}>Career DNA Overview</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Evidence-backed intelligence analysis for <strong style={{ color: '#FFF' }}>{user.name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link
            to="/gaps"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.95rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-main)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <GitPullRequest size={16} /> Skill Gaps
          </Link>
          <Link
            to="/next-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.95rem',
              background: 'var(--color-accent)',
              color: '#FFF',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(255, 85, 0, 0.35)'
            }}
          >
            <Zap size={16} /> Next Best Action
          </Link>
        </div>
      </div>

      {/* AI Synthesis Summary Card */}
      <CareerSummary summary={dnaData.summary} role={dnaData.target_role || dnaData.role || user.targetRole} />

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Left Column: Readiness Score */}
        <ReadinessScore
          score={dnaData.readiness_score}
          status={dnaData.readiness_status}
          targetRole={dnaData.target_role || user.targetRole}
        />

        {/* Strengths Card */}
        <Strengths strengths={dnaData.strengths} />

        {/* Skill Development Areas / Weaknesses Card */}
        <Weaknesses weaknesses={dnaData.development_areas || dnaData.weaknesses || []} />
      </div>

      {/* Demonstrated Skill Matrix */}
      <SkillOverview skills={dnaData.skills} />
    </motion.div>
  )
}

export default Dashboard
