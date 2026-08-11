import GapCard from './GapCard'
import SkillCard from './SkillCard'

function displaySkill(skillId) {
  return skillId
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function AnalysisResult({ data }) {
  const report = data.report || {}
  const summary = report.candidate_summary || {}
  const skills = report.skills || []
  const presentSkills = report.present_skills || data.skill_gaps?.present_skills || []
  const missingSkills = report.missing_skills || data.skill_gaps?.missing_skills || []
  const evidence = data.evidence_summary || report.evidence_summary || {}
  const totalEvidence = (evidence.resume_evidence || 0) + (evidence.github_evidence || 0)

  return (
    <div className="results-stack" aria-live="polite">
      <section className="profile-summary result-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Profile summary</span>
            <h2>Your evidence map</h2>
          </div>
          <span className="complete-badge"><span /> Analysis complete</span>
        </div>
        <div className="metric-grid">
          <div className="metric"><strong>{summary.total_skills_detected ?? skills.length}</strong><span>Skills detected</span></div>
          <div className="metric"><strong>{totalEvidence}</strong><span>Evidence items</span></div>
          <div className="metric"><strong>{summary.project_count || 0}</strong><span>Projects found</span></div>
          <div className="metric"><strong>{summary.experience_count || 0}</strong><span>Experience entries</span></div>
        </div>
        <div className="detected-strip">
          <span>Detected skills</span>
          <div>{skills.map((skill) => <span key={skill.skill_id}>{displaySkill(skill.skill_id)}</span>)}</div>
        </div>
      </section>

      <section className="result-section">
        <div className="section-heading">
          <div><span className="eyebrow">Skill evidence</span><h2>What your work demonstrates</h2></div>
          <span className="section-count">{skills.length} canonical skills</span>
        </div>
        <div className="skill-grid">
          {skills.map((skill) => <SkillCard key={skill.skill_id} skill={skill} />)}
        </div>
      </section>

      <section className="result-section gap-section">
        <div className="section-heading">
          <div><span className="eyebrow">Skill gaps</span><h2>Role requirements without evidence</h2></div>
          <span className="section-count">{missingSkills.length} missing</span>
        </div>
        {missingSkills.length ? (
          <div className="gap-list">{missingSkills.map((gap) => <GapCard key={gap.skill_id} gap={gap} />)}</div>
        ) : (
          <p className="empty-state">Every skill in the selected role has supporting evidence.</p>
        )}
      </section>

      <section className="result-section career-report">
        <div className="section-heading">
          <div><span className="eyebrow">Career report</span><h2>Evidence-backed direction</h2></div>
        </div>
        <div className="report-grid">
          <article className="report-panel direction-panel">
            <span className="report-index">01</span>
            <h3>Recommended direction</h3>
            <p>The MVP reports evidence and gaps without generating recommendations or rankings.</p>
          </article>
          <article className="report-panel">
            <span className="report-index">02</span>
            <h3>Demonstrated strengths</h3>
            <ul>{presentSkills.slice(0, 6).map((skill) => <li key={skill.skill_id}>{displaySkill(skill.skill_id)}</li>)}</ul>
          </article>
          <article className="report-panel">
            <span className="report-index">03</span>
            <h3>Improvement areas</h3>
            <ul>{missingSkills.slice(0, 6).map((skill) => <li key={skill.skill_id}>{displaySkill(skill.skill_id)}</li>)}</ul>
          </article>
        </div>
      </section>
    </div>
  )
}
