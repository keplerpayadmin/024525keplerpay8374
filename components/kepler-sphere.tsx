"use client"

import { useEffect, useRef } from "react"

interface KeplerSphereProps {
  isSphereAnimatingFast?: boolean
}

export function KeplerSphere({ isSphereAnimatingFast = false }: KeplerSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

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

    // Sphere parameters - made smaller
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2 - 50 // Move sphere up a bit
    const radius = 120 // Reduced from 150
    const innerSphereRadius = 50 // Reduced from 60
    let rotation = 0
    let wireframeRotation = 0

    // Create more detailed sphere points
    const createSpherePoints = () => {
      const points = []
      const latitudeBands = 40 // Increased from 20
      const longitudeBands = 40 // Increased from 20

      for (let lat = 0; lat <= latitudeBands; lat++) {
        const theta = (lat * Math.PI) / latitudeBands
        const sinTheta = Math.sin(theta)
        const cosTheta = Math.cos(theta)

        for (let lon = 0; lon <= longitudeBands; lon++) {
          const phi = (lon * 2 * Math.PI) / longitudeBands
          const sinPhi = Math.sin(phi)
          const cosPhi = Math.cos(phi)

          const x = cosPhi * sinTheta
          const y = cosTheta
          const z = sinPhi * sinTheta

          points.push({ x, y, z })
        }
      }
      return points
    }

    const spherePoints = createSpherePoints()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Slower rotation speeds when fast - reduced from 0.05 to 0.03
      const sphereRotationSpeed = isSphereAnimatingFast ? 0.03 : 0.01
      const wireframeRotationSpeed = isSphereAnimatingFast ? 0.015 : 0.01 // Also reduced proportionally

      rotation += sphereRotationSpeed
      wireframeRotation += wireframeRotationSpeed

      // Draw more detailed wireframe
      ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`
      ctx.lineWidth = 0.8

      // Draw latitude lines (more lines) - using wireframe rotation
      for (let lat = 0; lat < 30; lat++) {
        ctx.beginPath()
        for (let lon = 0; lon <= 60; lon++) {
          const theta = (lat * Math.PI) / 30
          const phi = (lon * 2 * Math.PI) / 60

          const x = Math.cos(phi) * Math.sin(theta)
          const y = Math.cos(theta)
          const z = Math.sin(phi) * Math.sin(theta)

          // Rotate using wireframe rotation
          const rotatedX = x * Math.cos(wireframeRotation) - z * Math.sin(wireframeRotation)
          const rotatedZ = x * Math.sin(wireframeRotation) + z * Math.cos(wireframeRotation)

          // Project
          const projectedX = centerX + rotatedX * radius
          const projectedY = centerY + y * radius

          if (lon === 0) {
            ctx.moveTo(projectedX, projectedY)
          } else {
            ctx.lineTo(projectedX, projectedY)
          }
        }
        ctx.stroke()
      }

      // Draw longitude lines (more lines) - using wireframe rotation
      for (let lon = 0; lon < 30; lon++) {
        ctx.beginPath()
        for (let lat = 0; lat <= 60; lat++) {
          const theta = (lat * Math.PI) / 60
          const phi = (lon * 2 * Math.PI) / 30

          const x = Math.cos(phi) * Math.sin(theta)
          const y = Math.cos(theta)
          const z = Math.sin(phi) * Math.sin(theta)

          // Rotate using wireframe rotation
          const rotatedX = x * Math.cos(wireframeRotation) - z * Math.sin(wireframeRotation)
          const rotatedZ = x * Math.sin(wireframeRotation) + z * Math.cos(wireframeRotation)

          // Project
          const projectedX = centerX + rotatedX * radius
          const projectedY = centerY + y * radius

          if (lat === 0) {
            ctx.moveTo(projectedX, projectedY)
          } else {
            ctx.lineTo(projectedX, projectedY)
          }
        }
        ctx.stroke()
      }

      // Draw more detailed sphere points - using sphere rotation
      spherePoints.forEach((point) => {
        // Rotate point using sphere rotation
        const rotatedX = point.x * Math.cos(rotation) - point.z * Math.sin(rotation)
        const rotatedZ = point.x * Math.sin(rotation) + point.z * Math.cos(rotation)

        // Project to 2D
        const projectedX = centerX + rotatedX * radius
        const projectedY = centerY + point.y * radius

        // Calculate depth for opacity and size variation
        const depth = (rotatedZ + 1) / 2
        const opacity = Math.max(0.2, depth * 0.8)
        const pointSize = 1 + depth * 2 // Variable point size based on depth

        // Draw point with variable size
        ctx.beginPath()
        ctx.arc(projectedX, projectedY, pointSize, 0, 2 * Math.PI)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        // Add small glow to brighter points
        if (depth > 0.7) {
          ctx.beginPath()
          ctx.arc(projectedX, projectedY, pointSize * 1.5, 0, 2 * Math.PI)
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`
          ctx.fill()
        }
      })

      // Draw more detailed inner yellow sphere with enhanced yellow glow
      // Enhanced outer glow layer with more yellow
      const outerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerSphereRadius * 2)
      outerGlow.addColorStop(0, "rgba(255, 215, 0, 0.3)") // Increased intensity
      outerGlow.addColorStop(0.3, "rgba(255, 193, 7, 0.2)") // More yellow glow
      outerGlow.addColorStop(0.6, "rgba(255, 193, 7, 0.1)")
      outerGlow.addColorStop(1, "rgba(255, 193, 7, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, innerSphereRadius * 2, 0, 2 * Math.PI)
      ctx.fillStyle = outerGlow
      ctx.fill()

      // Main sphere gradient with more yellow intensity
      const mainGradient = ctx.createRadialGradient(centerX - 15, centerY - 15, 0, centerX, centerY, innerSphereRadius)
      mainGradient.addColorStop(0, "rgba(255, 255, 150, 1)") // More yellow center
      mainGradient.addColorStop(0.2, "rgba(255, 235, 0, 0.98)") // Bright yellow
      mainGradient.addColorStop(0.4, "rgba(255, 215, 0, 0.95)") // Gold
      mainGradient.addColorStop(0.6, "rgba(255, 193, 7, 0.8)") // Yellow
      mainGradient.addColorStop(0.8, "rgba(255, 165, 0, 0.6)") // Orange edge
      mainGradient.addColorStop(1, "rgba(255, 140, 0, 0.3)") // Transparent edge

      ctx.beginPath()
      ctx.arc(centerX, centerY, innerSphereRadius, 0, 2 * Math.PI)
      ctx.fillStyle = mainGradient
      ctx.fill()

      // Enhanced inner highlight with more yellow
      const highlight = ctx.createRadialGradient(
        centerX - 12,
        centerY - 12,
        0,
        centerX - 12,
        centerY - 12,
        innerSphereRadius * 0.5,
      )
      highlight.addColorStop(0, "rgba(255, 255, 200, 0.9)") // More yellow highlight
      highlight.addColorStop(0.3, "rgba(255, 255, 150, 0.6)")
      highlight.addColorStop(0.6, "rgba(255, 255, 100, 0.3)")
      highlight.addColorStop(1, "rgba(255, 255, 100, 0)")

      ctx.beginPath()
      ctx.arc(centerX - 12, centerY - 12, innerSphereRadius * 0.5, 0, 2 * Math.PI)
      ctx.fillStyle = highlight
      ctx.fill()

      // Enhanced animated pulse effect with more yellow glow
      const pulseIntensity = 0.6 + 0.4 * Math.sin(rotation * 3) // Increased pulse intensity
      ctx.shadowColor = `rgba(255, 215, 0, ${pulseIntensity})`
      ctx.shadowBlur = 40 // Increased blur for more glow
      ctx.beginPath()
      ctx.arc(centerX, centerY, innerSphereRadius * 0.9, 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * pulseIntensity})` // More intense yellow
      ctx.fill()
      ctx.shadowBlur = 0

      // Additional yellow glow ring
      const glowRing = ctx.createRadialGradient(
        centerX,
        centerY,
        innerSphereRadius * 0.8,
        centerX,
        centerY,
        innerSphereRadius * 1.3,
      )
      glowRing.addColorStop(0, "rgba(255, 215, 0, 0)")
      glowRing.addColorStop(0.5, `rgba(255, 215, 0, ${0.2 * pulseIntensity})`)
      glowRing.addColorStop(1, "rgba(255, 215, 0, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, innerSphereRadius * 1.3, 0, 2 * Math.PI)
      ctx.fillStyle = glowRing
      ctx.fill()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isSphereAnimatingFast])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "transparent" }} />
}
