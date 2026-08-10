import React, { useEffect, useRef } from 'react'

export const NeuralBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Generate low-opacity nodes
    const nodeCount = Math.min(Math.floor((width * height) / 22000), 50)
    const nodes = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.3,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 1,
        color: i % 3 === 0 ? 'rgba(139, 92, 246, ' : i % 3 === 1 ? 'rgba(59, 130, 246, ' : 'rgba(255, 85, 0, '
      })
    }

    const maxDistance = 140

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw faint connections
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i]

        if (!prefersReducedMotion) {
          nodeA.x += nodeA.vx
          nodeA.y += nodeA.vy

          if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1
          if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2)
        ctx.fillStyle = nodeA.color + '0.4)'
        ctx.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j]
          const dx = nodeA.x - nodeB.x
          const dy = nodeA.y - nodeB.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
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
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

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
