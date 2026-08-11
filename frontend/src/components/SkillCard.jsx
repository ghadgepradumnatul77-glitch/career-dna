const SOURCE_LABELS = {
  resume: 'Resume',
  github: 'GitHub',
}

function displaySkill(skillId) {
  return skillId
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function SkillCard({ skill }) {
  const evidenceCount = skill.evidence_count || 0

  return (
    <article className="skill-card">
      <div className="skill-card-top">
        <div className="skill-monogram" aria-hidden="true">
          {displaySkill(skill.skill_id).slice(0, 2)}
        </div>
        <div>
          <h3>{displaySkill(skill.skill_id)}</h3>
          <p>{evidenceCount} evidence {evidenceCount === 1 ? 'item' : 'items'}</p>
        </div>
      </div>
      <div className="badge-row" aria-label="Evidence sources">
        {(skill.sources || []).map((source) => (
          <span className={`source-badge ${source}`} key={source}>
            <span className="badge-dot" /> {SOURCE_LABELS[source] || source}
          </span>
        ))}
        {!skill.sources?.length && <span className="source-badge">No source detail</span>}
      </div>
      <div className="evidence-meter" aria-label={`${evidenceCount} evidence items`}>
        <span style={{ width: `${Math.min(100, 22 + evidenceCount * 13)}%` }} />
      </div>
    </article>
  )
}
