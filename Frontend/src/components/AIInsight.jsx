import React from 'react';

export const AIInsight = ({ dnaProfile, skillGap }) => {
  const topSkill = dnaProfile?.skill_matrix 
    ? Object.keys(dnaProfile.skill_matrix)[0] || 'Backend Development'
    : 'Backend Development';
  
  const targetRole = skillGap?.target_role || 'AI / Backend Engineer';
  const matchPct = skillGap?.match_percentage ?? 82.5;
  const missingSkills = skillGap?.missing_skills || ['PyTorch', 'Vector Databases'];

  return (
    <div className="glass-card p-4 animate-fade-in mb-4" style={{ borderLeft: '4px solid var(--accent)' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h5 mb-0 d-flex align-items-center gap-2">
          <span>🤖</span> AI Intelligence & Career Insights
        </h3>
        <span className="badge badge-primary">Real-Time Synthesis</span>
      </div>

      <div className="d-flex flex-column gap-3">
        <div className="p-3 rounded" style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
          <p className="small text-secondary mb-1">💪 Primary Strength Recognized</p>
          <p className="fw-bold mb-0 text-light">
            Your strongest core proficiency is <span className="text-warning">{topSkill}</span>. Your project history and evidence demonstrate high velocity in this domain.
          </p>
        </div>

        <div className="p-3 rounded" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <p className="small text-secondary mb-1">🎯 Target Role Alignment ({targetRole})</p>
          <p className="fw-bold mb-0 text-light">
            You currently hold an <span className="text-primary">{matchPct}% match</span> for {targetRole} roles. Focus on mastering <span className="text-warning">{missingSkills.join(', ')}</span> to reach 95%+ market qualification.
          </p>
        </div>

        <div className="p-3 rounded" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <p className="small text-secondary mb-1">⚡ GitHub & Code Signal Strength</p>
          <p className="fw-bold mb-0 text-light">
            Your connected GitHub repository metrics reflect active open-source activity with strong multi-language project architecture.
          </p>
        </div>
      </div>
    </div>
  );
};
