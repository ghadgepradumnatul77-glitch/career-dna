import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || prefersReducedMotion) return

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)

      const target = e.target
      const isInteractive = target.closest('button, a, select, input, .card, [role="button"], .interactive-node')
      setIsHovered(!!isInteractive)
    }

    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: isHovered ? '36px' : '20px',
        height: isHovered ? '36px' : '20px',
        borderRadius: '50%',
        background: isHovered ? 'rgba(255, 85, 0, 0.15)' : 'rgba(139, 92, 246, 0.25)',
        border: `1px solid ${isHovered ? '#FF5500' : '#A855F7'}`,
        boxShadow: isHovered ? '0 0 15px rgba(255, 85, 0, 0.4)' : '0 0 10px rgba(139, 92, 246, 0.3)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border-color 0.2s ease'
      }}
      animate={{
        x: position.x,
        y: position.y
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 400,
        mass: 0.1
      }}
    />
  )
}

export default CustomCursor
