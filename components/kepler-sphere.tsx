"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Environment, Text } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import type { Mesh } from "three"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

interface KeplerSphereProps {
  isLoaded: boolean
}

function AnimatedKeplerElements({ isLoaded }: { isLoaded: boolean }) {
  const sphereRef = useRef<Mesh>(null)
  const wireframeRef = useRef<Mesh>(null)

  const fullText = "KeplerPay"
  const [displayedText, setDisplayedText] = useState("")
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[textIndex])
        setTextIndex((prev) => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [textIndex, fullText])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const rotationSpeed = isLoaded ? 5.0 : 0.1

    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * rotationSpeed
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = t * (rotationSpeed * 0.5)
      wireframeRef.current.rotation.x = t * (rotationSpeed * 0.2)
    }
  })

  return (
    <>
      <Text position={[0, 2.0, 0]} fontSize={0.6} letterSpacing={-0.05} color="white" anchorX="center" anchorY="middle">
        {displayedText}
      </Text>

      <pointLight position={[0, 2.5, 1]} intensity={2.5} color="white" />

      <Sphere args={[0.4, 64, 64]} ref={sphereRef}>
        <meshStandardMaterial color="gold" metalness={0.9} roughness={0.2} />
      </Sphere>

      <Sphere args={[1.2, 32, 32]} ref={wireframeRef}>
        <meshBasicMaterial color="white" wireframe={true} />
      </Sphere>
    </>
  )
}

export function KeplerSphere({ isLoaded }: KeplerSphereProps) {
  return (
    <Canvas className="w-full h-screen bg-black" camera={{ position: [0, 0, 5], fov: 75 }}>
      <Environment preset="sunset" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} />
        <AnimatedKeplerElements isLoaded={isLoaded} />
      </EffectComposer>
      <OrbitControls enableZoom={true} enablePan={true} enabled={true} />
    </Canvas>
  )
}
