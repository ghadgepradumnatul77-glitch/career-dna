import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '1.4rem' }}>Career DNA</h2>
        <span className="badge badge-primary">AI Engine v1.0</span>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user.full_name || 'Engineer'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};
