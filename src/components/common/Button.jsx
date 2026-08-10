import React, { useState } from 'react'
import { motion } from 'framer-motion'

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  magnetic = true,
  ...props
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!magnetic || disabled || loading) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.15
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.15
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    if (!magnetic) return
    setPosition({ x: 0, y: 0 })
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #FF5500 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 22px rgba(139, 92, 246, 0.38)'
        }
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--color-text-main)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          backdropFilter: 'blur(8px)'
        }
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--color-purple-light)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: 'none'
        }
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--color-text-muted)',
          border: 'none',
          boxShadow: 'none'
        }
      case 'danger':
        return {
          background: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          border: '1px solid var(--color-danger-border)',
          boxShadow: 'none'
        }
      default:
        return {}
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.4rem 0.95rem', fontSize: '0.825rem', borderRadius: 'var(--radius-md)' }
      case 'lg':
        return { padding: '0.85rem 1.85rem', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }
      case 'md':
      default:
        return { padding: '0.65rem 1.35rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)' }
    }
  }

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '800',
    letterSpacing: '-0.01em',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    outline: 'none',
    userSelect: 'none',
    ...getVariantStyles(),
    ...getSizeStyles()
  }

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      whileHover={disabled || loading ? {} : { scale: 1.03 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      type={type}
      style={style}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn ${className}`}
      {...props}
    >
      {loading && (
        <svg
          style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="32" strokeDashoffset="10" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 15 : 18} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 15 : 18} />}
    </motion.button>
  )
}

export default Button
