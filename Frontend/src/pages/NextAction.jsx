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

  // Generate roadmap steps from actions array if needed
  const roadmapSteps = React.useMemo(() => {
    if (!nextActionData) return []
    if (nextActionData.roadmap) return nextActionData.roadmap
    if (Array.isArray(nextActionData)) {
      return nextActionData.map((act, i) => ({
        step: i + 1,
        title: act.title || `Priority Action: ${act.skill}`,
        description: act.description || `Address skill gap in ${act.skill}`,
        estimatedHours: act.estimated_effort_hours || 25,
        resources: act.evidence_to_collect || ['GitHub repository', 'Source code']
      }))
    }
    return []
  }, [nextActionData])

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
            <Sparkles size={13} /> ACTIONABLE INTELLIGENCE SYNTHESIS
          </span>
          <h1 style={{ fontSize: '2.25rem', margin: 0 }}>
            Don't learn everything. <br />
            <span className="gradient-orange">Do the next right thing.</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Highest ROI project recommendations for <strong style={{ color: '#FFF' }}>{user.targetRole}</strong>
          </p>
        </div>

        <RoleSelector compact={false} />
      </div>

      {loading ? (
        <LoadingSpinner label={`Synthesizing Next Best Action for ${user.targetRole}...`} />
      ) : !nextActionData ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No recommendation available.</div>
      ) : (
        <>
          {/* Main Action Highlight Card */}
          <ActionCard nextAction={nextActionData} />

          {/* Interactive Step-by-Step Implementation Roadmap */}
          {roadmapSteps.length > 0 && <Roadmap steps={roadmapSteps} />}
        </>
      )}
    </motion.div>
  )
}

export default NextAction
