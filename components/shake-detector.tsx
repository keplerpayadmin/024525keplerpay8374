"use client"

import { useEffect, useRef } from "react"

interface ShakeDetectorProps {
  onShake: () => void
  threshold?: number
  enabled?: boolean
}

export function ShakeDetector({ onShake, threshold = 15, enabled = true }: ShakeDetectorProps) {
  const lastUpdate = useRef(0)
  const lastX = useRef(0)
  const lastY = useRef(0)
  const lastZ = useRef(0)

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const current = Date.now()

      if (current - lastUpdate.current > 100) {
        const diffTime = current - lastUpdate.current
        lastUpdate.current = current

        const acceleration = event.accelerationIncludingGravity
        if (!acceleration) return

        const x = acceleration.x || 0
        const y = acceleration.y || 0
        const z = acceleration.z || 0

        const speed = (Math.abs(x + y + z - lastX.current - lastY.current - lastZ.current) / diffTime) * 10000

        if (speed > threshold) {
          onShake()
        }

        lastX.current = x
        lastY.current = y
        lastZ.current = z
      }
    }

    // Request permission for iOS devices
    const requestPermission = async () => {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission()
          if (permission === "granted") {
            window.addEventListener("devicemotion", handleDeviceMotion)
          }
        } catch (error) {
          console.error("Error requesting device motion permission:", error)
        }
      } else {
        // For non-iOS devices
        window.addEventListener("devicemotion", handleDeviceMotion)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion)
    }
  }, [onShake, threshold, enabled])

  return null
}
