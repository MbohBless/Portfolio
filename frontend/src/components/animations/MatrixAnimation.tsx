'use client'

import { useEffect, useRef } from 'react'

export function MatrixAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix multiplication elements
    const matrices: Array<{
      x: number
      y: number
      opacity: number
      speed: number
      phase: number
      size: number
    }> = []

    // Create initial matrices
    for (let i = 0; i < 8; i++) {
      matrices.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: 0,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        size: 40 + Math.random() * 60,
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Check for dark mode
      const isDark = document.documentElement.classList.contains('dark')
      const baseColor = isDark ? '200, 200, 220' : '40, 40, 60'

      matrices.forEach((matrix) => {
        // Update opacity with sine wave
        matrix.phase += matrix.speed * 0.02
        matrix.opacity = 0.3 + Math.sin(matrix.phase) * 0.2

        // Draw matrix notation
        ctx.save()
        ctx.translate(matrix.x, matrix.y)
        ctx.globalAlpha = matrix.opacity

        const fontSize = matrix.size * 0.2
        ctx.font = `${fontSize}px "SF Mono", "Monaco", "Inconsolata", monospace`
        ctx.fillStyle = `rgba(${baseColor}, 1)`

        // Draw bracket and matrix elements
        const spacing = matrix.size * 0.3

        // Left bracket
        ctx.strokeStyle = `rgba(${baseColor}, 1)`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-spacing * 1.2, -spacing * 1.2)
        ctx.lineTo(-spacing * 1.5, -spacing * 1.2)
        ctx.lineTo(-spacing * 1.5, spacing * 1.2)
        ctx.lineTo(-spacing * 1.2, spacing * 1.2)
        ctx.stroke()

        // Matrix elements (2x2)
        const elements = [
          [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
          [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
        ]

        elements.forEach((row, i) => {
          row.forEach((val, j) => {
            ctx.fillText(
              val.toString(),
              -spacing + j * spacing,
              -spacing / 2 + i * spacing
            )
          })
        })

        // Right bracket
        ctx.beginPath()
        ctx.moveTo(spacing * 0.7, -spacing * 1.2)
        ctx.lineTo(spacing, -spacing * 1.2)
        ctx.lineTo(spacing, spacing * 1.2)
        ctx.lineTo(spacing * 0.7, spacing * 1.2)
        ctx.stroke()

        // Draw × symbol
        ctx.fillStyle = `rgba(${baseColor}, 1)`
        ctx.fillText('×', spacing * 1.3, 0)

        ctx.restore()

        // Slow drift
        matrix.y += Math.sin(matrix.phase * 0.5) * 0.1
        matrix.x += Math.cos(matrix.phase * 0.3) * 0.1

        // Wrap around
        if (matrix.y < -100) matrix.y = canvas.height + 100
        if (matrix.y > canvas.height + 100) matrix.y = -100
        if (matrix.x < -100) matrix.x = canvas.width + 100
        if (matrix.x > canvas.width + 100) matrix.x = -100
      })

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
