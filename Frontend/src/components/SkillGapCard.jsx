import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export const SkillGapCard = () => {
  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/skill-gap/history');
      setHistory(res.data);
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
      const res = await api.post('/skill-gap/analyze', {
        target_role: targetRole
      });
      setAnalysis(res.data);
      fetchHistory();
    } catch (err) {
      console.error('Skill gap analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>🎯 Skill Gap Analysis Engine</h3>
        <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '240px', marginBottom: 0 }}>
            <label>Target Role</label>
            <input
              type="text"
              className="form-input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. AI Engineer, Senior Backend Engineer"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Analyzing Gap...' : 'Analyze Match & Gaps'}
          </button>
        </form>
      </div>

      {analysis && (
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Analysis for: {analysis.target_role}</h3>
            <span className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {analysis.match_percentage}% Match
            </span>
          </div>

          <div className="progress-bar-bg" style={{ height: '12px', marginBottom: '1.5rem' }}>
            <div className="progress-bar-fill" style={{ width: `${analysis.match_percentage}%` }}></div>
          </div>

          <div className="grid-2">
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h4 style={{ color: '#6ee7b7', marginBottom: '0.75rem' }}>✅ Existing Matched Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.existing_skills?.map((s) => (
                  <span key={s} className="badge badge-success">{s}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h4 style={{ color: '#fca5a5', marginBottom: '0.75rem' }}>⚠️ Missing / Target Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.missing_skills?.map((s) => (
                  <span key={s} className="badge badge-warning">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Skill Gap Historical Reports</h3>
          <div className="grid-2">
            {history.map((item) => (
              <div key={item.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600' }}>{item.target_role}</span>
                  <span className="badge badge-primary">{item.match_percentage}% Match</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
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
