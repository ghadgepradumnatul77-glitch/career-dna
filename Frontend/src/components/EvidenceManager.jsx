import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export const EvidenceManager = () => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillName, setSkillName] = useState('Python');
  const [title, setTitle] = useState('AI Career DNA Engine');
  const [evidenceType, setEvidenceType] = useState('project_demo');
  const [url, setUrl] = useState('https://github.com/Manan274/career-dna');
  const [description, setDescription] = useState('Built RESTful APIs with FastAPI and PostgreSQL');
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchEvidence = async () => {
    try {
      const response = await api.get('/evidence');
      setEvidenceList(response.data);
    } catch (err) {
      console.error('Failed to fetch evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    setAdding(true);
    setMsg(null);
    try {
      await api.post('/evidence', {
        skill_name: skillName,
        evidence_type: evidenceType,
        title,
        description,
        url,
        confidence_score: 0.95,
        verification_status: 'verified'
      });
      setMsg('Evidence proof added successfully!');
      fetchEvidence();
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to add evidence:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>🛡️ Add Skill Proof / Evidence</h3>
        {msg && <div className="alert alert-success">{msg}</div>}
        <form onSubmit={handleAddEvidence} className="grid-2">
          <div className="form-group">
            <label>Skill Name</label>
            <input type="text" className="form-input" value={skillName} onChange={(e) => setSkillName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Evidence Type</label>
            <select className="form-select" value={evidenceType} onChange={(e) => setEvidenceType(e.target.value)}>
              <option value="project_demo">Project Demo</option>
              <option value="github_repo">GitHub Repo</option>
              <option value="commit">Git Commit</option>
              <option value="resume_bullet">Resume Experience</option>
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Project / Repository URL</label>
            <input type="url" className="form-input" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea className="form-textarea" rows="2" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary" disabled={adding}>
              {adding ? 'Submitting...' : 'Add Evidence Item'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Verified Skill Evidence Records</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading evidence records...</p>
        ) : evidenceList.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No evidence records created yet.</p>
        ) : (
          <div className="grid-2">
            {evidenceList.map((item) => (
              <div key={item.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{item.skill_name}</span>
                  <span className="badge badge-success">{item.verification_status}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', margin: '0.35rem 0' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{item.description}</p>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                    {item.url} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
