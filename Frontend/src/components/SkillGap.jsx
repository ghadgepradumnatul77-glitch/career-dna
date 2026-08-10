import React, { useState, useEffect } from 'react';
import { skillGapService } from '../api/services/skillGapService';

export const SkillGap = () => {
  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await skillGapService.getSkillGapHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch skill gap history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await skillGapService.analyzeSkillGap(targetRole);
      setAnalysis(data);
      fetchHistory();
    } catch (err) {
      console.error('Skill gap analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      <div className="glass-card p-4">
        <h3 className="h5 mb-3">🎯 Target Role Skill Gap Analysis Engine</h3>
        <form onSubmit={handleAnalyze} className="d-flex gap-3 align-items-end flex-wrap">
          <div className="form-group flex-grow-1 mb-0" style={{ minWidth: '260px' }}>
            <label className="form-label text-secondary small fw-semibold">Target Job Role</label>
            <input
              type="text"
              className="form-control form-input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. AI Engineer, Senior Backend Engineer"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Analyzing Gap...
              </>
            ) : (
              'Analyze Match & Missing Skills'
            )}
          </button>
        </form>
      </div>

      {analysis && (
        <div className="glass-card p-4 animate-fade-in" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h5 mb-0">Role Target: {analysis.target_role}</h3>
            <span className="badge badge-primary fs-6 px-3 py-2">{analysis.match_percentage}% Match Score</span>
          </div>

          <div className="progress-bar-bg mb-4" style={{ height: '14px' }}>
            <div className="progress-bar-fill" style={{ width: `${analysis.match_percentage}%` }}></div>
          </div>

          <div className="grid-2">
            <div className="p-3 rounded" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <h4 className="h6 text-success mb-3 fw-bold">✅ Existing Matched Competencies</h4>
              <div className="d-flex flex-wrap gap-2">
                {analysis.existing_skills?.map((s) => (
                  <span key={s} className="badge badge-success">{s}</span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <h4 className="h6 text-danger mb-3 fw-bold">⚠️ Missing Target Skills to Develop</h4>
              <div className="d-flex flex-wrap gap-2">
                {analysis.missing_skills?.map((s) => (
                  <span key={s} className="badge badge-warning">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="h5 mb-3">Skill Gap History Reports</h3>
          <div className="grid-2">
            {history.map((item) => (
              <div key={item.id} className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">{item.target_role}</span>
                  <span className="badge badge-primary">{item.match_percentage}% Match</span>
                </div>
                <p className="text-secondary small mb-0">
                  Missing: {item.missing_skills?.join(', ') || 'None'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
