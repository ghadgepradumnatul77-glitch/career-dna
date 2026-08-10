import React, { useState } from 'react';
import { ingestionService } from '../api/services/ingestionService';

export const GithubSync = ({ onSyncSuccess }) => {
  const [username, setUsername] = useState('Manan274');
  const [loading, setLoading] = useState(false);
  const [syncedData, setSyncedData] = useState(null);
  const [error, setError] = useState(null);

  const handleSync = async (e) => {
    e.preventDefault();
    const cleanUser = username.trim();
    if (!cleanUser) {
      setError('Please enter a valid GitHub username.');
      return;
    }

    setLoading(true);
    setError(null);
    setSyncedData(null);

    try {
      const data = await ingestionService.syncGithub(cleanUser);
      setSyncedData(data);
      if (onSyncSuccess) onSyncSuccess();
    } catch (err) {
      console.error('GitHub sync failed:', err);
      setError(err.response?.data?.detail || 'Failed to sync GitHub account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 animate-fade-in mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h5 mb-0 d-flex align-items-center gap-2">
          <span>💻</span> GitHub Repository & Language Integration
        </h3>
        <span className="badge badge-primary">GitHub API</span>
      </div>

      {error && <div className="alert alert-error mb-3">{error}</div>}

      <form onSubmit={handleSync}>
        <div className="form-group mb-3">
          <label className="form-label text-secondary small fw-semibold">GitHub Username</label>
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary text-secondary">@</span>
            <input
              type="text"
              className="form-control form-input"
              placeholder="e.g. Manan274"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Fetching GitHub Repositories...
            </>
          ) : (
            'Sync GitHub Profile & Metrics'
          )}
        </button>
      </form>

      {syncedData && (
        <div className="mt-4 p-3 rounded animate-fade-in" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="h6 text-primary fw-bold mb-1">🎉 Connected to @{syncedData.github_username}</h4>
              <p className="small text-secondary mb-0">Repositories & top programming language metrics synced</p>
            </div>
            <span className="badge badge-success">Active Sync</span>
          </div>
        </div>
      )}
    </div>
  );
};
