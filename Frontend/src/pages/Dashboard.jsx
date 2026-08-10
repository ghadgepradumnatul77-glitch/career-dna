import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ResumeUpload } from '../components/ResumeUpload';
import { GithubSync } from '../components/GithubSync';
import { CareerDNA } from '../components/CareerDNA';
import { SkillGap } from '../components/SkillGap';
import { Recommendations } from '../components/Recommendations';
import { useAuth } from '../context/AuthContext';
import { ingestionService } from '../api/services/ingestionService';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);

  const fetchSources = async () => {
    try {
      const data = await ingestionService.getSources();
      setSources(data);
    } catch (err) {
      console.error('Failed to fetch data sources:', err);
    } finally {
      setLoadingSources(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main className="main-content">
          {activeTab === 'profile' && (
            <div className="d-flex flex-column gap-4">
              <div>
                <h1 className="gradient-text h2 mb-1">Engineer Profile & Status</h1>
                <p className="text-secondary small mb-0">Overview of authenticated user session and data sources</p>
              </div>

              {/* User Profile Card */}
              <div className="glass-card p-4">
                <h3 className="h5 mb-3">👤 Authenticated User Details</h3>
                <div className="row g-3">
                  <div className="col-md-4">
                    <p className="text-secondary small mb-1">Full Name</p>
                    <p className="fw-bold mb-0">{user?.full_name || 'Engineer'}</p>
                  </div>
                  <div className="col-md-4">
                    <p className="text-secondary small mb-1">Email Address</p>
                    <p className="fw-bold mb-0">{user?.email}</p>
                  </div>
                  <div className="col-md-4">
                    <p className="text-secondary small mb-1">Account Status</p>
                    <span className="badge badge-success">Active / Authenticated</span>
                  </div>
                </div>
              </div>

              {/* Connected Sources List */}
              <div className="glass-card p-4">
                <h3 className="h5 mb-3">🔗 Ingested Data Sources</h3>
                {loadingSources ? (
                  <p className="text-muted mb-0">Loading data sources...</p>
                ) : sources.length === 0 ? (
                  <p className="text-muted mb-0">No data sources ingested yet. Select 'Resume Upload' or 'GitHub Sync' to import skills!</p>
                ) : (
                  <div className="grid-3">
                    {sources.map((src) => (
                      <div key={src.id} className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                        <span className="badge badge-primary mb-2">{src.source_type}</span>
                        {src.github_username && <p className="fw-bold mb-1">@{src.github_username}</p>}
                        {src.file_name && <p className="fw-bold mb-1">{src.file_name}</p>}
                        <p className="text-secondary small mb-0 mt-2">
                          Skills: {src.extracted_skills?.join(', ') || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Jump to DNA */}
              <CareerDNA />
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="d-flex flex-column gap-4">
              <div>
                <h1 className="gradient-text h2 mb-1">Resume Skill Ingestion</h1>
                <p className="text-secondary small mb-0">Parse raw text resume and extract verifiable skills</p>
              </div>
              <ResumeUpload onIngestSuccess={fetchSources} />
            </div>
          )}

          {activeTab === 'github' && (
            <div className="d-flex flex-column gap-4">
              <div>
                <h1 className="gradient-text h2 mb-1">GitHub Account Integration</h1>
                <p className="text-secondary small mb-0">Sync repositories and programming language metrics</p>
              </div>
              <GithubSync onSyncSuccess={fetchSources} />
            </div>
          )}

          {activeTab === 'career-dna' && (
            <div className="d-flex flex-column gap-4">
              <CareerDNA />
            </div>
          )}

          {activeTab === 'skill-gap' && (
            <div className="d-flex flex-column gap-4">
              <div>
                <h1 className="gradient-text h2 mb-1">Skill Gap Analysis</h1>
                <p className="text-secondary small mb-0">Benchmark competencies against target industry roles</p>
              </div>
              <SkillGap />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="d-flex flex-column gap-4">
              <div>
                <h1 className="gradient-text h2 mb-1">Actionable Recommendations</h1>
                <p className="text-secondary small mb-0">Personalized AI learning roadmap and completion tracker</p>
              </div>
              <Recommendations />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
