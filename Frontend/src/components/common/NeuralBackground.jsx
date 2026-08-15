import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export const NeuralBackground = () => {
  const canvasRef = useRef(null)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    if (isHomePage) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let mouseX = width / 2
    let mouseY = height / 2

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e) => {
      // 1-3% subtle mouse parallax offset
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('resize', handleResize)
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Generate low-opacity nodes
    const nodeCount = Math.min(Math.floor((width * height) / 22000), 50)
    const nodes = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.3,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 1,
        color: i % 3 === 0 ? 'rgba(139, 92, 246, ' : i % 3 === 1 ? 'rgba(59, 130, 246, ' : 'rgba(255, 85, 0, '
      })
    }

    const maxDistance = 140
    const maxDistanceSq = maxDistance * maxDistance

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Calculate subtle parallax offset from center
      const offsetX = (mouseX - width / 2) * 0.015
      const offsetY = (mouseY - height / 2) * 0.015

      // Draw faint connections
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i]

        if (!prefersReducedMotion) {
          nodeA.x += nodeA.vx
          nodeA.y += nodeA.vy

          if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1
          if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1
        }

        const renderX = nodeA.x + offsetX
        const renderY = nodeA.y + offsetY

        // Draw node
        ctx.beginPath()
        ctx.arc(renderX, renderY, nodeA.radius, 0, Math.PI * 2)
        ctx.fillStyle = nodeA.color + '0.4)'
        ctx.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j]
          const renderBX = nodeB.x + offsetX
          const renderBY = nodeB.y + offsetY

          const dx = renderX - renderBX
          const dy = renderY - renderBY
          const distSq = dx * dx + dy * dy

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq)
            const alpha = (1 - dist / maxDistance) * 0.12
            ctx.beginPath()
            ctx.moveTo(renderX, renderY)
            ctx.lineTo(renderBX, renderBY)
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (!isTouch) window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isHomePage])

  if (isHomePage) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7
      }}
    />
  )
}

export default NeuralBackground
