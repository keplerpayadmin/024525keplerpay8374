"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    const lines: Array<{
      x1: number
      y1: number
      x2: number
      y2: number
      opacity: number
      speed: number
    }> = []

    // Create lines
    for (let i = 0; i < 50; i++) {
      lines.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      lines.forEach((line) => {
        // Update line position
        line.x1 += Math.sin(Date.now() * 0.001 * line.speed) * 0.5
        line.y1 += Math.cos(Date.now() * 0.001 * line.speed) * 0.5
        line.x2 += Math.sin(Date.now() * 0.001 * line.speed + Math.PI) * 0.3
        line.y2 += Math.cos(Date.now() * 0.001 * line.speed + Math.PI) * 0.3

        // Wrap around screen
        if (line.x1 < 0) line.x1 = canvas.width
        if (line.x1 > canvas.width) line.x1 = 0
        if (line.y1 < 0) line.y1 = canvas.height
        if (line.y1 > canvas.height) line.y1 = 0

        // Draw line
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.stroke()

        // Draw connection points
        ctx.fillStyle = `rgba(255, 255, 255, ${line.opacity * 2})`
        ctx.beginPath()
        ctx.arc(line.x1, line.y1, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ background: "black" }} />
}
