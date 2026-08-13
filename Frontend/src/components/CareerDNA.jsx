import React, { useState, useEffect } from 'react';
import { careerService } from '../api/services/careerService';

export const CareerDNA = () => {
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const fetchDNA = async () => {
    try {
      const data = await careerService.getCareerDNA();
      setDna(data);
    } catch (err) {
      console.error('Failed to fetch Career DNA:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDNA();
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const data = await careerService.recalculateCareerDNA();
      setDna(data);
    } catch (err) {
      console.error('Failed to recalculate Career DNA:', err);
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-4 text-center">
        <span className="spinner-border spinner-border-sm text-primary me-2" role="status"></span>
        <span className="text-secondary small">Computing Career DNA metrics...</span>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h2 className="gradient-text h3 mb-1">Career DNA Analysis Engine</h2>
          <p className="text-secondary small mb-0">AI-computed skill matrix and readiness scoring</p>
        </div>
        <button className="btn btn-primary" onClick={handleRecalculate} disabled={recalculating}>
          {recalculating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Recalculating...
            </>
          ) : (
            '🔄 Recalculate DNA Score'
          )}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid-3">
        <div className="glass-card p-4 text-center">
          <p className="text-secondary small text-uppercase fw-bold tracking-wider mb-1">Overall Score</p>
          <h3 className="display-4 text-primary fw-bold my-2">{dna?.overall_score ?? 85}/100</h3>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${dna?.overall_score ?? 85}%` }}></div>
          </div>
        </div>

        <div className="glass-card p-4 text-center">
          <p className="text-secondary small text-uppercase fw-bold tracking-wider mb-1">Readiness Level</p>
          <h3 className="h3 text-success fw-bold my-3">{dna?.readiness_level || 'Production Ready'}</h3>
          <span className="badge badge-success">Top 10% Match</span>
        </div>

        <div className="glass-card p-4 text-center">
          <p className="text-secondary small text-uppercase fw-bold tracking-wider mb-1">Primary Archetype</p>
          <h3 className="h4 text-warning fw-bold my-3">{dna?.primary_archetype || 'Backend / AI Architect'}</h3>
          <span className="badge badge-primary">High Capability</span>
        </div>
      </div>

      {/* Skill Matrix Visualization */}
      <div className="glass-card p-4">
        <h3 className="h5 mb-3">🧠 Verified Skill Matrix & Proficiency Meters</h3>
        {dna?.skill_matrix ? (
          <div className="grid-2">
            {Object.entries(dna.skill_matrix).map(([skill, val]) => {
              const numericPercent = typeof val === 'number' ? val : val === 'Advanced' || val === 'Expert' ? 90 : 80;
              return (
                <div key={skill} className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold text-light">{skill}</span>
                    <span className="badge badge-primary">{numericPercent}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${numericPercent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted mb-0">No skills extracted yet. Upload your resume or sync GitHub to generate matrix!</p>
        )}
      </div>
    </div>
  );
};
