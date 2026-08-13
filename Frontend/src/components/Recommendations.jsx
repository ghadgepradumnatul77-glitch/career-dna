import React, { useState, useEffect } from 'react';
import { recommendationService } from '../api/services/recommendationService';

export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState('AI Engineer');

  const fetchRecommendations = async () => {
    try {
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await recommendationService.generateRecommendations(targetRole);
      fetchRecommendations();
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await recommendationService.toggleRecommendation(id);
      setRecommendations((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      console.error('Failed to toggle completion status:', err);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      <div className="glass-card p-4">
        <h3 className="h5 mb-3">💡 AI Actionable Learning Roadmap Generator</h3>
        <form onSubmit={handleGenerate} className="d-flex gap-3 align-items-end flex-wrap">
          <div className="form-group flex-grow-1 mb-0" style={{ minWidth: '260px' }}>
            <label className="form-label text-secondary small fw-semibold">Target Role for Action Plan</label>
            <input
              type="text"
              className="form-control form-input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. AI Engineer, Senior Backend Engineer"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={generating}>
            {generating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Generating Action Items...
              </>
            ) : (
              'Generate Recommendations'
            )}
          </button>
        </form>
      </div>

      <div className="glass-card p-4">
        <h3 className="h5 mb-3">Personalized Actionable Learning Roadmap</h3>

        {loading ? (
          <p className="text-muted mb-0">Loading roadmap goals...</p>
        ) : recommendations.length === 0 ? (
          <p className="text-muted mb-0">No learning tasks generated yet. Click above to generate your roadmap!</p>
        ) : (
          <div className="grid-2">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded d-flex flex-column justify-content-between animate-fade-in"
                style={{
                  background: rec.is_completed ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                  border: rec.is_completed ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-color)',
                  opacity: rec.is_completed ? 0.85 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge badge-primary">{rec.category || 'Skill Goal'}</span>
                    <span className={`badge ${rec.is_completed ? 'badge-success' : 'badge-warning'}`}>
                      {rec.is_completed ? '✓ Completed' : 'Pending Task'}
                    </span>
                  </div>
                  <h4 className="h6 fw-bold mb-2 text-light" style={{ textDecoration: rec.is_completed ? 'line-through' : 'none' }}>
                    {rec.title}
                  </h4>
                  <p className="text-secondary small mb-3">{rec.description}</p>
                </div>

                <button
                  className={`btn ${rec.is_completed ? 'btn-secondary' : 'btn-primary'} w-100 btn-sm mt-2`}
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
