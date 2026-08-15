import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Dna, Menu, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import RoleSelector from '../gaps/RoleSelector'

export const Navbar = ({ onToggleMobileMenu }) => {
  const { user, isMockMode } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works', path: '/' },
    { label: 'Features', href: '#features', path: '/' },
    { label: 'Demo', href: '#demo', path: '/' },
    { label: 'About', href: '#about', path: '/' }
  ]

  const handleNavClick = (link) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(link.href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      const el = document.querySelector(link.href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="navbar" style={{ background: 'rgba(5, 8, 22, 0.85)', backdropFilter: 'blur(16px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-brand" onClick={() => navigate('/')} style={{ flexShrink: 0 }}>
          <div
            className="navbar-logo-icon"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #FF5500 100%)',
              boxShadow: '0 0 18px rgba(139, 92, 246, 0.5)'
            }}
          >
            <Dna size={22} style={{ color: '#FFF' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="navbar-brand-text" style={{ fontSize: '1.2rem', fontWeight: 800, whiteSpace: 'nowrap', wordSpacing: 'var(--word-spacing-nav, 0.03em)' }}>
              Career<span style={{ color: 'var(--color-purple-light)' }}>DNA</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links - ALWAYS ONE LINE */}
        <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexShrink: 0 }} className="user-role-badge-text">
          {navLinks.map((link) => (
            <span
              key={link.label}
              onClick={() => handleNavClick(link)}
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                wordSpacing: 'var(--word-spacing-nav, 0.03em)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              {link.label}
            </span>
          ))}
        </nav>
      </div>

      <div className="navbar-actions">
        {/* Role Quick Selector */}
        <RoleSelector compact={true} />

        {/* Backend Status Pill */}
        <div className="backend-status-pill">
          <span className={`status-dot ${isMockMode ? 'mock' : 'online'}`} />
          <span className="backend-status-text" style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap', wordSpacing: 'var(--word-spacing-body, 0.015em)' }}>
            {isMockMode ? 'Mock Mode' : 'FastAPI Live'}
          </span>
        </div>

        {/* CTA Button matching reference image */}
        <button
          onClick={() => navigate('/setup')}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(255, 85, 0, 0.15) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            color: '#FFFFFF',
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.825rem',
            whiteSpace: 'nowrap',
            wordSpacing: 'var(--word-spacing-btn, 0.03em)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.25)',
            transition: 'all var(--transition-fast)',
            flexShrink: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#FF5500'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 85, 0, 0.4)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.25)'
          }}
        >
          <span>Get My Career DNA</span>
          <ArrowRight size={14} style={{ color: 'var(--color-orange-light)', flexShrink: 0 }} />
        </button>
      </div>
    </header>
  )
}

export default Navbar
