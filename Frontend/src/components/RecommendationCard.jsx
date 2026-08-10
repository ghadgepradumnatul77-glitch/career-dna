import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export const RecommendationCard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState('AI Engineer');

  const fetchRecs = async () => {
    try {
      const res = await api.get('/recommendations');
      setRecommendations(res.data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await api.post(`/recommendations/generate?target_role=${encodeURIComponent(targetRole)}`);
      fetchRecs();
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/recommendations/${id}/toggle`);
      setRecommendations((prev) =>
        prev.map((rec) => (rec.id === id ? res.data : rec))
      );
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>💡 AI Actionable Learning Roadmap</h3>
        <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '240px', marginBottom: 0 }}>
            <label>Target Role for Recommendations</label>
            <input
              type="text"
              className="form-input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={generating}>
            {generating ? 'Generating Action Items...' : 'Generate Learning Roadmap'}
          </button>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Recommended Learning Tasks</h3>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading recommendations...</p>
        ) : recommendations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No recommendations generated yet. Click above to generate!</p>
        ) : (
          <div className="grid-2">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: rec.is_completed ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: rec.is_completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                  opacity: rec.is_completed ? 0.85 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary">{rec.category || 'Skill Goal'}</span>
                    <span className={`badge ${rec.is_completed ? 'badge-success' : 'badge-warning'}`}>
                      {rec.is_completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', margin: '0.4rem 0', textDecoration: rec.is_completed ? 'line-through' : 'none' }}>
                    {rec.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {rec.description}
                  </p>
                </div>

                <button
                  className={`btn ${rec.is_completed ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  onClick={() => handleToggle(rec.id)}
                >
                  {rec.is_completed ? 'Mark as Pending' : 'Mark Completed ✓'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
