import React from 'react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'profile', label: 'Engineer Profile', icon: '👤' },
    { id: 'resume', label: 'Resume Upload', icon: '📄' },
    { id: 'github', label: 'GitHub Sync', icon: '💻' },
    { id: 'career-dna', label: 'Career DNA', icon: '🧬' },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: '🎯' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
  ];

  return (
    <aside className="sidebar">
      <div className="mb-4 px-2">
        <h3 className="h6 text-secondary text-uppercase tracking-wider">Dashboard Navigation</h3>
      </div>
      <nav className="flex-grow-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
            style={{ width: '100%', cursor: 'pointer', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <span className="fs-5">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
        <p className="small text-muted mb-1">Career DNA System</p>
        <p className="small text-success mb-0">● Connected to PostgreSQL</p>
      </div>
    </aside>
  );
};
