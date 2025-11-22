'use client'

import { useEffect, useRef } from 'react'

export function CodeAnimation() {
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

    // Code snippets to display
    const codeSnippets = [
      'const',
      'function',
      '=>',
      '{}',
      '[]',
      'async',
      'await',
      'import',
      'export',
      'class',
      'if',
      'return',
      '()',
      ';',
      '//',
      '/*',
      '*/',
      '<>',
      '&&',
      '||',
    ]

    // Floating code elements
    const codeElements: Array<{
      text: string
      x: number
      y: number
      opacity: number
      speed: number
      phase: number
      drift: number
    }> = []

    // Create initial elements
    for (let i = 0; i < 25; i++) {
      codeElements.push({
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: 0,
        speed: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.5 - 0.25,
      })
    }

    // Binary rain effect
    const binaryColumns: Array<{
      x: number
      y: number
      speed: number
      chars: string[]
    }> = []

    for (let i = 0; i < 15; i++) {
      binaryColumns.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        speed: 1 + Math.random() * 2,
        chars: Array(8)
          .fill(0)
          .map(() => (Math.random() > 0.5 ? '1' : '0')),
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Check for dark mode
      const isDark = document.documentElement.classList.contains('dark')
      const baseColor = isDark ? '180, 180, 200' : '60, 60, 80'
      const accentColor = isDark ? '99, 102, 241' : '79, 70, 229'

      // Draw floating code elements
      codeElements.forEach((element) => {
        // Update opacity with sine wave
        element.phase += element.speed * 0.02
        element.opacity = 0.03 + Math.sin(element.phase) * 0.03

        // Draw code text
        ctx.save()
        ctx.globalAlpha = element.opacity
        ctx.font = '16px "SF Mono", "Monaco", "Inconsolata", monospace'
        ctx.fillStyle = `rgba(${accentColor}, 0.6)`
        ctx.fillText(element.text, element.x, element.y)
        ctx.restore()

        // Slow vertical drift
        element.y += element.drift
        element.x += Math.sin(element.phase * 0.5) * 0.2

        // Wrap around
        if (element.y < -20) element.y = canvas.height + 20
        if (element.y > canvas.height + 20) element.y = -20
        if (element.x < -50) element.x = canvas.width + 50
        if (element.x > canvas.width + 50) element.x = -50
      })

      // Draw binary rain (very subtle)
      binaryColumns.forEach((column) => {
        ctx.save()
        ctx.globalAlpha = 0.02
        ctx.font = '12px "SF Mono", "Monaco", "Inconsolata", monospace'
        ctx.fillStyle = `rgba(${baseColor}, 0.5)`

        column.chars.forEach((char, i) => {
          ctx.fillText(char, column.x, column.y + i * 20)
        })

        ctx.restore()

        // Move down
        column.y += column.speed

        // Reset when off screen
        if (column.y > canvas.height + 200) {
          column.y = -200
          column.x = Math.random() * canvas.width
          column.chars = Array(8)
            .fill(0)
            .map(() => (Math.random() > 0.5 ? '1' : '0'))
        }

        // Occasionally change binary values
        if (Math.random() < 0.01) {
          const idx = Math.floor(Math.random() * column.chars.length)
          column.chars[idx] = Math.random() > 0.5 ? '1' : '0'
        }
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
      style={{ opacity: 0.6 }}
    />
  )
}
