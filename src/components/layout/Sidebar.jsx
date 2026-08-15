import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileCheck,
  GitPullRequest,
  Zap,
  User,
  ShieldCheck,
  RefreshCw
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const Sidebar = ({ isOpen, onCloseMobile }) => {
  const { user, resetAll } = useApp()

  const navItems = [
    { path: '/dashboard', label: 'Career DNA', icon: LayoutDashboard },
    { path: '/evidence/python', label: 'Skill Evidence', icon: FileCheck },
    { path: '/gaps', label: 'Skill Gaps', icon: GitPullRequest },
    { path: '/next-action', label: 'Next Best Action', icon: Zap },
    { path: '/setup', label: 'Profile & Inputs', icon: User }
  ]

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-overlay ${isOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 0.5rem' }}>
          <p
            style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              color: 'var(--color-text-dim)',
              letterSpacing: '0.08em',
              wordSpacing: 'var(--word-spacing-nav, 0.03em)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}
          >
            Intelligence Navigation
          </p>
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onCloseMobile}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div
            style={{
              background: 'rgba(255, 85, 0, 0.08)',
              border: '1px solid rgba(255, 85, 0, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Evidence Verified
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)', margin: 0 }}>
              AI analysis backed strictly by code & artifact proofs.
            </p>
          </div>

          <button
            onClick={resetAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)',
              color: 'var(--color-text-dim)',
              fontSize: '0.8rem',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          >
            <RefreshCw size={14} />
            <span>Reset Demo Session</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
