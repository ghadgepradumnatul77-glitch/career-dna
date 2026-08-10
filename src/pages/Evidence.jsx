import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileCheck,
  ChevronLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import apiService from '../services/apiAdapter'
import ConfidenceBadge from '../components/evidence/ConfidenceBadge'
import EvidenceList from '../components/evidence/EvidenceList'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Card from '../components/common/Card'

export const Evidence = () => {
  const { skill } = useParams()
  const navigate = useNavigate()
  const { user } = useApp()

  const [evidenceData, setEvidenceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [explainOpen, setExplainOpen] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    apiService.getSkillEvidence(skill || 'python').then((data) => {
      if (isMounted) {
        setEvidenceData(data)
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [skill])

  if (loading) {
    return <LoadingSpinner label={`Fetching verified code evidence for ${skill}...`} />
  }

  if (!evidenceData) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-12)', maxWidth: '1000px', margin: '0 auto' }}
    >
      {/* Back Button */}
      <Link
        to="/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          fontWeight: 700
        }}
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header Card */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6) var(--space-8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div>
          <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>
            {evidenceData.category || 'Technical Skill'} RECEIPT PROOFS
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{evidenceData.name}</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Verified technical evidence calculated for {user.targetRole}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Score Circle */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {evidenceData.proficiency}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 700 }}>/ 100 Proficient</div>
          </div>

          <ConfidenceBadge confidence={evidenceData.confidence} />
        </div>
      </div>

      {/* Why This Score? Explainability Collapsible Box */}
      <div
        style={{
          background: 'rgba(255, 85, 0, 0.08)',
          border: '1px solid rgba(255, 85, 0, 0.3)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          transition: 'all var(--transition-fast)'
        }}
      >
        <button
          onClick={() => setExplainOpen(!explainOpen)}
          style={{
            width: '100%',
            padding: 'var(--space-4) var(--space-6)',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--color-text-main)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} style={{ color: 'var(--color-accent)' }} />
            <span>Why this score? (Explainable AI Score Rationale)</span>
          </div>
          {explainOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {explainOpen && (
          <div style={{ padding: '0 var(--space-6) var(--space-6) var(--space-6)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--color-text-main)', lineHeight: '1.65' }}>
              {evidenceData.whyThisScore}
            </p>
          </div>
        )}
      </div>

      {/* Evidence Sources List */}
      <Card title={`Verified Evidence Receipts (${evidenceData.sources?.length || 0})`} icon={FileCheck}>
        <EvidenceList sources={evidenceData.sources} />
      </Card>
    </motion.div>
  )
}

export default Evidence
