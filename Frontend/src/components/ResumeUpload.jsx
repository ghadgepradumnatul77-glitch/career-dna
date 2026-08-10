import React, { useState } from 'react';
import { ingestionService } from '../api/services/ingestionService';

export const ResumeUpload = ({ onIngestSuccess }) => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setLoading(true);
    setError(null);
    setExtractedSkills(null);

    try {
      const data = await ingestionService.ingestResume(rawText, 'resume.pdf');
      setExtractedSkills(data.extracted_skills || []);
      setRawText('');
      if (onIngestSuccess) onIngestSuccess();
    } catch (err) {
      console.error('Resume ingestion failed:', err);
      setError(err.response?.data?.detail || 'Failed to ingest resume text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 animate-fade-in mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h5 mb-0 d-flex align-items-center gap-2">
          <span>📄</span> Resume Skill Ingestion Engine
        </h3>
        <span className="badge badge-primary">NLP Parser</span>
      </div>

      {error && <div className="alert alert-error mb-3">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="drag-drop-box mb-3">
          <label className="d-block mb-2 text-secondary small fw-semibold">
            Paste raw text resume or drag skill summary here
          </label>
          <textarea
            className="form-control form-textarea border-0 bg-transparent text-light"
            rows="6"
            placeholder="Paste resume details (e.g. Senior Software Engineer skilled in Python, FastAPI, PostgreSQL, React, Machine Learning, Docker...)"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            required
          />
          <div className="d-flex justify-content-between align-items-center mt-2 px-1">
            <small className="text-muted">Character count: {rawText.length}</small>
            <small className="text-primary font-monospace">Auto-Extracts Technical Skills</small>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Parsing & Extracting Skills...
            </>
          ) : (
            'Parse & Save Resume Skills'
          )}
        </button>
      </form>

      {extractedSkills && (
        <div className="mt-4 p-3 rounded animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h4 className="h6 text-success mb-2 fw-bold">✅ Ingested Successfully! Extracted {extractedSkills.length} Skills:</h4>
          <div className="d-flex flex-wrap gap-2">
            {extractedSkills.map((skill, index) => (
              <span key={index} className="badge badge-success">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
