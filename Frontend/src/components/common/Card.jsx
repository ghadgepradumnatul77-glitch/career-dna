import React from 'react'
import { motion } from 'framer-motion'

export const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  glow = false,
  className = '',
  style = {},
  ...props
}) => {
  const cardStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    boxShadow: glow ? 'var(--shadow-glow-orange)' : 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    ...style
  }

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'rgba(255, 85, 0, 0.35)' }}
      transition={{ duration: 0.2 }}
      style={cardStyle}
      className={`card ${className}`}
      {...props}
    >
      {(title || Icon || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: subtitle || children ? 'var(--space-4)' : '0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {Icon && (
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 85, 0, 0.12)',
                  border: '1px solid rgba(255, 85, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)'
                }}
              >
                <Icon size={18} />
              </div>
            )}
            <div>
              {title && (
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    margin: 0,
                    color: 'var(--color-text-main)'
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: '0.825rem',
                    color: 'var(--color-text-muted)',
                    margin: 0,
                    marginTop: '2px'
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ flex: 1 }}>{children}</div>
    </motion.div>
  )
}

export default Card
