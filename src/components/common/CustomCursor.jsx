import React, { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isHoveredRef = useRef(false)
  const isVisibleRef = useRef(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 30, stiffness: 400, mass: 0.1 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || prefersReducedMotion) return

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      if (!isVisibleRef.current) {
        isVisibleRef.current = true
        setIsVisible(true)
      }

      const target = e.target
      const isInteractive = Boolean(
        target &&
        typeof target.closest === 'function' &&
        target.closest('button, a, select, input, .card, [role="button"], .interactive-node, .glass-panel')
      )

      if (isInteractive !== isHoveredRef.current) {
        isHoveredRef.current = isInteractive
        setIsHovered(isInteractive)
      }
    }

    const handleMouseLeave = () => {
      isVisibleRef.current = false
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY])

  if (!isVisible) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x,
        y,
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
    />
  )
}

export default CustomCursor
