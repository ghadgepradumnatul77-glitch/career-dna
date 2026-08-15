import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitPullRequest, Target, AlertTriangle, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import apiService from '../services/apiAdapter'
import SkillGapCard from '../components/gaps/SkillGapCard'
import RoleSelector from '../components/gaps/RoleSelector'
import LoadingSpinner from '../components/common/LoadingSpinner'

export const SkillGaps = () => {
  const { user } = useApp()
  const [gaps, setGaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [priorityFilter, setPriorityFilter] = useState('ALL')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    apiService.getSkillGaps(user.id, user.targetRole).then((data) => {
      if (isMounted) {
        setGaps(data || [])
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [user.targetRole])

  const filteredGaps =
    priorityFilter === 'ALL'
      ? gaps
      : gaps.filter((g) => (g.priority || '').toUpperCase() === priorityFilter)

  const criticalCount = gaps.filter((g) => (g.priority || '').toUpperCase() === 'CRITICAL').length
  const highCount = gaps.filter((g) => (g.priority || '').toUpperCase() === 'HIGH').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-12)' }}
    >
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>GAP EVALUATION MATRIX</span>
          <h1 style={{ fontSize: '2.25rem', margin: 0 }}>Where you're falling short.</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Comparing demonstrated skills against benchmark requirements for <strong style={{ color: '#FFF' }}>{user.targetRole}</strong>
          </p>
        </div>

        {/* Target Role Selector */}
        <RoleSelector compact={false} />
      </div>

      {/* Metrics Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Identified Gaps
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'var(--font-mono)' }}>
            {gaps.length}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', textTransform: 'uppercase', fontWeight: 700 }}>
            Critical Priorities
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-danger)', fontFamily: 'var(--font-mono)' }}>
            {criticalCount}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)', textTransform: 'uppercase', fontWeight: 700 }}>
            High Priorities
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>
            {highCount}
          </div>
        </div>
      </div>

      {/* Priority Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Filter Priority:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: priorityFilter === p ? 'rgba(255, 85, 0, 0.2)' : 'var(--color-surface)',
              color: priorityFilter === p ? 'var(--color-accent)' : 'var(--color-text-dim)',
              border: `1px solid ${priorityFilter === p ? 'rgba(255, 85, 0, 0.4)' : 'var(--color-border)'}`
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Gaps Grid */}
      {loading ? (
        <LoadingSpinner label={`Evaluating benchmark gaps for ${user.targetRole}...`} />
      ) : filteredGaps.length === 0 ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No gaps match the selected priority filter.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {filteredGaps.map((gap) => (
            <SkillGapCard key={gap.skill_id || gap.skill} gap={gap} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default SkillGaps
