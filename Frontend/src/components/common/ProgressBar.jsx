import React from 'react'
import { getScoreColor } from '../../utils/formatters'

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showValue = true,
  color,
  height = 8,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
  const barColor = color || getScoreColor(percentage)

  return (
    <div style={{ width: '100%' }} className={className}>
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.35rem',
            fontSize: '0.85rem'
          }}
        >
          {label && <span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>{label}</span>}
          {showValue && (
            <span style={{ color: barColor, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          height: `${height}px`,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: barColor,
            borderRadius: 'var(--radius-full)',
            transition: 'width var(--transition-slow)',
            boxShadow: `0 0 10px ${barColor}`
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
