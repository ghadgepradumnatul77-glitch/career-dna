import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ResumeUpload } from '../components/ResumeUpload';
import { GithubSync } from '../components/GithubSync';
import { CareerDNA } from '../components/CareerDNA';
import { SkillGap } from '../components/SkillGap';
import { Recommendations } from '../components/Recommendations';
import { AIInsight } from '../components/AIInsight';
import { GithubAnalytics } from '../components/GithubAnalytics';
import { SkeletonDashboard } from '../components/SkeletonCard';
import { useAuth } from '../context/AuthContext';
import { ingestionService } from '../api/services/ingestionService';
import { careerService } from '../api/services/careerService';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [sources, setSources] = useState([]);
  const [dnaProfile, setDnaProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [srcData, dnaData] = await Promise.all([
        ingestionService.getSources(),
        careerService.getCareerDNA()
      ]);
      setSources(srcData);
      setDnaProfile(dnaData);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      toast.error('Failed to fetch profile data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleResumeSuccess = () => {
    toast.success('Resume analyzed successfully!');
    fetchDashboardData();
  };

  const handleGithubSuccess = () => {
    toast.success('GitHub profile connected!');
    fetchDashboardData();
  };

  const githubSource = sources.find((s) => s.source_type === 'github');

  return (
    <div className="app-container">
      <Toaster position="top-right" toastOptions={{ style: { background: '#111827', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main className="main-content">
          {loading ? (
            <SkeletonDashboard />
          ) : (
            <>
              {activeTab === 'profile' && (
                <div className="d-flex flex-column gap-4">
                  <div>
                    <h1 className="gradient-text h2 mb-1">Engineer Profile & Intelligence Summary</h1>
                    <p className="text-secondary small mb-0">Overview of authenticated user session, AI insights, and connected data sources</p>
                  </div>

                  {/* AI Insights Component */}
                  <AIInsight dnaProfile={dnaProfile} />

                  {/* User Profile Details */}
                  <div className="glass-card p-4">
                    <h3 className="h5 mb-3">👤 Authenticated User Details</h3>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <p className="text-secondary small mb-1">Full Name</p>
                        <p className="fw-bold mb-0 text-light">{user?.full_name || 'Engineer'}</p>
                      </div>
                      <div className="col-md-4">
                        <p className="text-secondary small mb-1">Email Address</p>
                        <p className="fw-bold mb-0 text-light">{user?.email}</p>
                      </div>
                      <div className="col-md-4">
                        <p className="text-secondary small mb-1">Account Status</p>
                        <span className="badge badge-success">Active / Authenticated</span>
                      </div>
                    </div>
                  </div>

                  {/* GitHub Analytics Dashboard Component */}
                  <GithubAnalytics githubSource={githubSource} />

                  {/* Connected Data Sources List */}
                  <div className="glass-card p-4">
                    <h3 className="h5 mb-3">🔗 Ingested Data Sources</h3>
                    {sources.length === 0 ? (
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

                  {/* Quick Career DNA Section */}
                  <CareerDNA />
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="d-flex flex-column gap-4">
                  <div>
                    <h1 className="gradient-text h2 mb-1">Resume Skill Ingestion Engine</h1>
                    <p className="text-secondary small mb-0">Parse raw text resume and extract verifiable skills</p>
                  </div>
                  <ResumeUpload onIngestSuccess={handleResumeSuccess} />
                </div>
              )}

              {activeTab === 'github' && (
                <div className="d-flex flex-column gap-4">
                  <div>
                    <h1 className="gradient-text h2 mb-1">GitHub Integration & Analytics</h1>
                    <p className="text-secondary small mb-0">Sync repositories, star counts, and language distributions</p>
                  </div>
                  <GithubSync onSyncSuccess={handleGithubSuccess} />
                  <GithubAnalytics githubSource={githubSource} />
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
                    <h1 className="gradient-text h2 mb-1">Skill Gap Analysis Engine</h1>
                    <p className="text-secondary small mb-0">Benchmark competencies against target industry roles</p>
                  </div>
                  <SkillGap />
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="d-flex flex-column gap-4">
                  <div>
                    <h1 className="gradient-text h2 mb-1">Actionable Learning Roadmap</h1>
                    <p className="text-secondary small mb-0">Personalized AI learning roadmap and completion tracker</p>
                  </div>
                  <Recommendations />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
