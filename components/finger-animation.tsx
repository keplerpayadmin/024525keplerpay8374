"use client"

import { useRef, Suspense, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import * as THREE from "three"

function TechnologicalBackgroundScene() {
  const groupRef = useRef<THREE.Group>(null!)

  // Central Core
  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "yellow",
        emissive: "yellow",
        emissiveIntensity: 1.5, // More brightness
      }),
    [],
  )

  // Wireframe Geometry (re-added)
  const wireframeGeometry = useMemo(() => new THREE.SphereGeometry(0.8, 64, 64), []) // Sphere for the wireframe, slightly larger than the core
  const wireframeEdges = useMemo(() => new THREE.EdgesGeometry(wireframeGeometry), [wireframeGeometry])
  const wireframeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "white", linewidth: 1 }), [])

  // Network Nodes and Lines
  const numNodes = 50 // Number of points in the network
  const nodes = useMemo(() => {
    const positions = new Float32Array(numNodes * 3)
    for (let i = 0; i < numNodes; i++) {
      // Distribute nodes in a spherical volume
      const radius = 1.5 + Math.random() * 1.0 // Radius between 1.5 and 2.5
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(theta)
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    return positions
  }, [])

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const maxConnections = 3 // Each node connects to at most 3 others
    const connectionDistance = 1.5 // Maximum distance for connection

    for (let i = 0; i < numNodes; i++) {
      const p1 = new THREE.Vector3(nodes[i * 3], nodes[i * 3 + 1], nodes[i * 3 + 2])
      let connections = 0
      for (let j = i + 1; j < numNodes; j++) {
        if (connections >= maxConnections) break

        const p2 = new THREE.Vector3(nodes[j * 3], nodes[j * 3 + 1], nodes[j * 3 + 2])
        if (p1.distanceTo(p2) < connectionDistance) {
          positions.push(p1.x, p1.y, p1.z)
          positions.push(p2.x, p2.y, p2.z)
          connections++
        }
      }
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [nodes])

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "cyan", // Line color
        transparent: true,
        opacity: 0.2, // More subtle
        blending: THREE.AdditiveBlending, // Glow effect
      }),
    [],
  )

  const nodeMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "white", // Node color
        size: 0.08, // Node size
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003 // Slower overall rotation
      groupRef.current.rotation.x += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} /> {/* Slightly smaller core */}
        <primitive object={coreMaterial} attach="material" />
      </mesh>

      {/* White Wireframe (re-added) */}
      <lineSegments geometry={wireframeEdges}>
        <primitive object={wireframeMaterial} attach="material" />
      </lineSegments>

      {/* Network Lines */}
      <lineSegments geometry={lineGeometry}>
        <primitive object={lineMaterial} attach="material" />
      </lineSegments>

      {/* Network Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={nodes} count={nodes.length / 3} itemSize={3} />
        </bufferGeometry>
        <primitive object={nodeMaterial} attach="material" />
      </points>
    </group>
  )
}

export function FingerAnimation() {
  // Keeping the name for consistency in imports
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={1.5} color="yellow" />
          <Environment preset="warehouse" /> {/* An environment preset that gives good reflections */}
          <TechnologicalBackgroundScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
