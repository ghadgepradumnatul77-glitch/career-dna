import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header / Brand Bar */}
      <header className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom border-secondary border-opacity-25" style={{ background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="d-flex align-items-center gap-2">
          <h2 className="gradient-text h3 mb-0">Career DNA</h2>
          <span className="badge badge-primary">AI SaaS Platform</span>
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>Get Started Free</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-5 px-3 max-w-4xl mx-auto my-5">
        <span className="badge badge-primary mb-3 px-3 py-2 fs-6">🧬 Next-Gen Engineer Intelligence</span>
        <h1 className="display-4 fw-bold gradient-text mb-3">Discover Your Career DNA with AI</h1>
        <p className="lead text-secondary max-w-2xl mx-auto mb-4" style={{ maxWidth: '700px' }}>
          Analyze your technical skills, engineering projects, resume, and GitHub repository activity to build your personalized career readiness roadmap.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
            Get Started Now →
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            Live Demo Access
          </button>
        </div>
      </section>

      {/* Problem & Solution Grid */}
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="glass-card p-4 h-100">
              <h3 className="h5 text-danger mb-3">❌ The Problem: Resume Keyword Noise</h3>
              <p className="text-secondary mb-0">
                Traditional job portals rely on rigid, keyword-stuffed static PDFs. Candidates receive no real feedback on missing competencies, and engineering leads struggle to verify actual hands-on capability.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass-card p-4 h-100" style={{ borderLeft: '4px solid var(--success)' }}>
              <h3 className="h5 text-success mb-3">✅ The Solution: Verified Career DNA</h3>
              <p className="text-secondary mb-0">
                Career DNA synthesizes multi-source data—raw text resumes and GitHub activity—into a verified readiness score, primary archetype, target role gap analysis, and interactive learning goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="container py-5">
        <h2 className="text-center gradient-text h3 mb-4">Platform Core Features</h2>
        <div className="grid-3">
          <div className="glass-card p-4">
            <span className="fs-2">📄</span>
            <h3 className="h5 mt-3 mb-2">NLP Resume Parser</h3>
            <p className="text-secondary small mb-0">Extracts technical competencies and framework proficiency directly from raw text resumes.</p>
          </div>

          <div className="glass-card p-4">
            <span className="fs-2">💻</span>
            <h3 className="h5 mt-3 mb-2">GitHub Activity Sync</h3>
            <p className="text-secondary small mb-0">Synchronizes public repositories, star counts, and language metrics via the GitHub API.</p>
          </div>

          <div className="glass-card p-4">
            <span className="fs-2">🎯</span>
            <h3 className="h5 mt-3 mb-2">Target Role Gap Analyzer</h3>
            <p className="text-secondary small mb-0">Benchmarks candidate skills against target positions like AI Engineer to compute match percentage.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Bar */}
      <section className="container py-4 my-4">
        <div className="glass-card p-4 text-center">
          <h3 className="h6 text-secondary text-uppercase tracking-wider mb-3">Built with Production Technologies</h3>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <span className="badge badge-primary">React 18</span>
            <span className="badge badge-primary">Vite</span>
            <span className="badge badge-primary">FastAPI</span>
            <span className="badge badge-primary">Python 3.11</span>
            <span className="badge badge-primary">PostgreSQL 17</span>
            <span className="badge badge-primary">SQLAlchemy</span>
            <span className="badge badge-primary">Alembic</span>
            <span className="badge badge-primary">JWT Security</span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="text-center py-5 border-top border-secondary border-opacity-25 mt-5">
        <h2 className="h4 gradient-text mb-3">Ready to Benchmark Your Engineering DNA?</h2>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
          Create Your Profile Today →
        </button>
        <p className="text-muted small mt-4 mb-0">© 2026 Career DNA Platform. Open Source MIT Licensed.</p>
      </footer>
    </div>
  );
};
