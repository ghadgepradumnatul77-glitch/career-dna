import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Target, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import apiService from '../services/apiAdapter'
import ActionCard from '../components/nextAction/ActionCard'
import Roadmap from '../components/nextAction/Roadmap'
import RoleSelector from '../components/gaps/RoleSelector'
import LoadingSpinner from '../components/common/LoadingSpinner'

export const NextAction = () => {
  const { user } = useApp()
  const [nextActionData, setNextActionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    apiService.getNextAction(user.id, user.targetRole).then((data) => {
      if (isMounted) {
        setNextActionData(data)
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [user.targetRole])

  const primaryAction = Array.isArray(nextActionData)
    ? nextActionData[0]
    : (nextActionData?.actions ? nextActionData.actions[0] : nextActionData)

  const roadmapSteps = primaryAction?.roadmap || (
    primaryAction ? [
      ...(primaryAction.evidence_to_collect || []).map((ev, i) => ({
        step: i + 1,
        title: `Artifact: ${ev}`,
        description: `Build and verify candidate evidence artifact for ${primaryAction.skill || 'target skill'}: ${ev}.`,
        estimatedHours: Math.round((primaryAction.estimated_effort_hours || 20) / maxSteps((primaryAction.evidence_to_collect?.length || 1), (primaryAction.success_criteria?.length || 1))),
        resources: ['Documentation', 'GitHub']
      })),
      ...(primaryAction.success_criteria || []).map((sc, i) => ({
        step: (primaryAction.evidence_to_collect?.length || 0) + i + 1,
        title: `Validation: ${sc}`,
        description: `Confirm candidate milestone criterion is satisfied: ${sc}.`,
        estimatedHours: Math.round((primaryAction.estimated_effort_hours || 20) / maxSteps((primaryAction.evidence_to_collect?.length || 1), (primaryAction.success_criteria?.length || 1))),
        resources: ['Testing', 'Code Review']
      }))
    ] : []
  )

  function maxSteps(a, b) {
    return (a + b) || 1
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-12)' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-orange" style={{ marginBottom: '0.4rem' }}>
            <Sparkles size={13} /> CLAUDE ACTIONABLE SYNTHESIS
          </span>
          <h1 style={{ fontSize: '2.25rem', margin: 0 }}>
            Don't learn everything. <br />
            <span className="gradient-orange">Do the next right thing.</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Single highest ROI project recommendation for <strong style={{ color: '#FFF' }}>{user.targetRole}</strong>
          </p>
        </div>

        <RoleSelector compact={false} />
      </div>

      {loading ? (
        <LoadingSpinner label={`Synthesizing Next Best Action for ${user.targetRole}...`} />
      ) : !primaryAction ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No recommendation available.</div>
      ) : (
        <>
          {/* Main Action Highlight Card */}
          <ActionCard nextAction={primaryAction} />

          {/* Interactive Step-by-Step Implementation Roadmap */}
          <Roadmap steps={roadmapSteps} />
        </>
      )}
    </motion.div>
  )
}

export default NextAction
