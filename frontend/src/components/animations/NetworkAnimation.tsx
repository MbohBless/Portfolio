'use client'

import { useEffect, useRef } from 'react'

export function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Network nodes
    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      connections: number[]
    }

    const nodes: Node[] = []
    const nodeCount = 30

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 2 + Math.random() * 3,
        connections: [],
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Check for dark mode
      const isDark = document.documentElement.classList.contains('dark')
      const nodeColor = isDark ? '160, 160, 180' : '80, 80, 100'
      const lineColor = isDark ? '120, 120, 140' : '100, 100, 120'
      const pulseColor = isDark ? '99, 102, 241' : '79, 70, 229'

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Keep within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))

        // Find nearby nodes for connections
        node.connections = []
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x
            const dy = node.y - otherNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 150) {
              node.connections.push(j)
            }
          }
        })
      })

      // Draw connections
      ctx.strokeStyle = `rgba(${lineColor}, 1)`
      ctx.lineWidth = 1.5
      nodes.forEach((node, i) => {
        node.connections.forEach((connIdx) => {
          const other = nodes[connIdx]
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const opacity = Math.max(0, 1 - distance / 150)

          ctx.save()
          ctx.globalAlpha = opacity * 0.3
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
          ctx.restore()
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Node circle
        ctx.save()
        ctx.globalAlpha = 0.5
        ctx.fillStyle = `rgba(${nodeColor}, 1)`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Pulse effect on highly connected nodes
        if (node.connections.length > 3) {
          const pulseRadius = node.radius + Math.sin(Date.now() * 0.003) * 2
          ctx.save()
          ctx.globalAlpha = 0.3
          ctx.strokeStyle = `rgba(${pulseColor}, 1)`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
      })

      // Draw data packets traveling along connections (occasionally)
      if (Math.random() < 0.05) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)]
        if (randomNode.connections.length > 0) {
          const targetIdx =
            randomNode.connections[
              Math.floor(Math.random() * randomNode.connections.length)
            ]
          const target = nodes[targetIdx]

          ctx.save()
          ctx.globalAlpha = 0.6
          ctx.fillStyle = `rgba(${pulseColor}, 1)`
          const t = Math.random()
          const packetX = randomNode.x + (target.x - randomNode.x) * t
          const packetY = randomNode.y + (target.y - randomNode.y) * t
          ctx.beginPath()
          ctx.arc(packetX, packetY, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[5] pointer-events-none"
      style={{ opacity: 1 }}
    />
  )
}
