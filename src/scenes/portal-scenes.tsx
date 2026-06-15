import { ReactNode, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'

// ── Shared helpers ─────────────────────────────────────────

function Spin({ speed = 0.3, children }: { speed?: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed
  })
  return <group ref={ref}>{children}</group>
}

/** A drifting particle field — motes rise and wrap, with a slow lateral sway. */
function Particles({
  count = 90,
  color = '#7ecfcf',
  spread = 3,
  depth = -2.6,
  rise = 0.18,
  size = 0.028,
  opacity = 0.6,
}: {
  count?: number
  color?: string
  spread?: number
  depth?: number
  rise?: number
  size?: number
  opacity?: number
}) {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.9
      arr[i * 3 + 2] = depth + (Math.random() - 0.5) * 2
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [count, spread, depth])

  useFrame((state, dt) => {
    const pos = geo.attributes.position as THREE.BufferAttribute
    const lim = spread * 0.5
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + dt * rise
      if (y > lim) y = -lim
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    if (ref.current) ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.15
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ── Portal scenes ──────────────────────────────────────────

// Sacred Lake — the OS awakens beneath the surface.
export function SacredLakeScene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 6, 1]} intensity={1.1} color="#9fe3e3" />
      <pointLight position={[0, -0.3, -1.6]} intensity={2.2} distance={5} color="#3fd0d0" />

      {/* the OS core, glowing beneath */}
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.5}>
        <mesh position={[0, -0.25, -2.6]}>
          <icosahedronGeometry args={[0.62, 4]} />
          <MeshDistortMaterial
            color="#2fb6c4"
            emissive="#0a3a44"
            emissiveIntensity={0.6}
            distort={0.42}
            speed={1.4}
            roughness={0.15}
            metalness={0.5}
          />
        </mesh>
      </Float>

      {/* ripple rings on the surface */}
      {[0.9, 1.4, 1.95].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05 + i * 0.002, -2.2]}>
          <ringGeometry args={[r, r + 0.03, 64]} />
          <meshBasicMaterial color="#5fcccc" transparent opacity={0.25 - i * 0.06} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* dark water surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, -2.2]}>
        <circleGeometry args={[2.8, 64]} />
        <meshStandardMaterial color="#08222e" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* rising bubbles */}
      <Particles count={70} color="#7ecfcf" spread={3} depth={-2.4} rise={0.22} opacity={0.55} />
    </>
  )
}

// Evolve — reclaiming the game.
export function EvolveScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 8, 4]} intensity={1.1} color="#d8ffce" />
      <pointLight position={[0, 1.5, -1.5]} intensity={1.4} distance={5} color="#a3e040" />

      {/* pitch grid */}
      <gridHelper
        args={[5, 12, '#5a8c3a', '#2d5a27']}
        position={[0, -0.95, -2.6]}
        rotation={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.97, -2.6]}>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#16361a" roughness={0.9} />
      </mesh>

      {/* the ball */}
      <Float speed={2.2} floatIntensity={0.5}>
        <mesh position={[0, 0.1, -2.1]}>
          <icosahedronGeometry args={[0.4, 1]} />
          <meshStandardMaterial color="#eaffd8" emissive="#a3e040" emissiveIntensity={0.4} flatShading />
        </mesh>
      </Float>

      <Particles count={60} color="#a3e040" spread={3} depth={-2.5} rise={0.1} opacity={0.45} />
    </>
  )
}

// Miro Coach — facilitation, distilled. (Miro palette: yellow / navy / white)
export function MiroCoachScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[-2, 3, 1]} intensity={1.8} color="#ffd049" />
      <pointLight position={[2, 1, -1]} intensity={0.7} color="#7ecfcf" />

      {/* board */}
      <mesh position={[0, -0.55, -2.5]} rotation={[-Math.PI / 2.3, 0, 0]}>
        <boxGeometry args={[2.1, 1.5, 0.06]} />
        <meshStandardMaterial color="#f4f0e8" roughness={0.5} />
      </mesh>

      {/* floating sticky notes */}
      {[
        { p: [-0.55, 0.2, -2.1], c: '#ffd049', r: 0.18 },
        { p: [0.1, 0.45, -2.0], c: '#f4f0e8', r: -0.12 },
        { p: [0.6, 0.05, -2.2], c: '#7ecfcf', r: 0.22 },
        { p: [-0.2, -0.1, -1.9], c: '#050038', r: -0.2 },
      ].map((n, i) => (
        <Float key={i} speed={1.5 + i * 0.2} floatIntensity={0.4} rotationIntensity={0.3}>
          <mesh position={n.p as [number, number, number]} rotation={[0, 0, n.r]}>
            <boxGeometry args={[0.34, 0.34, 0.015]} />
            <meshStandardMaterial color={n.c} roughness={0.6} />
          </mesh>
        </Float>
      ))}

      <Particles count={50} color="#ffd049" spread={2.6} depth={-2.3} rise={0.12} opacity={0.4} />
    </>
  )
}

// Aqmen — intelligence, operational. (deep violet / gold)
export function AqmenScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0.5, 1.2, -1.4]} intensity={2.4} distance={5} color="#e7c466" />
      <pointLight position={[-1.2, -0.8, -1.2]} intensity={1.2} distance={5} color="#7a5cff" />

      {/* operational core + orbiting nodes */}
      <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0.4}>
        <mesh position={[0, 0.05, -2.3]}>
          <octahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial color="#d4b25a" emissive="#8a6a20" emissiveIntensity={0.55} metalness={0.65} roughness={0.2} flatShading />
        </mesh>
      </Float>
      <Spin speed={0.5}>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.78, Math.sin(a) * 0.32, -2.3 + Math.sin(a) * 0.25]}>
              <sphereGeometry args={[0.075, 14, 14]} />
              <meshStandardMaterial color="#f1e3b0" emissive="#d4b25a" emissiveIntensity={0.8} />
            </mesh>
          )
        })}
      </Spin>

      <Particles count={70} color="#c9a84c" spread={3} depth={-2.6} rise={0.06} opacity={0.45} />
    </>
  )
}

// Facilitación — design thinking, live. (multi-color canvas)
export function FacilitacionScene() {
  const colors = ['#7ecfcf', '#c9a84c', '#d4e8e8', '#e0795c', '#7a5cff']
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={1} color="#f4f0e8" />
      <pointLight position={[0, 1, -1.5]} intensity={1} color="#e0795c" />

      {/* a fan of facilitation cards, facing the viewer */}
      {colors.map((c, i) => {
        const t = (i - (colors.length - 1) / 2) / colors.length
        return (
          <Float key={i} speed={1.4 + i * 0.15} floatIntensity={0.5} rotationIntensity={0.25}>
            <mesh position={[t * 1.5, 0.15 + Math.sin(i * 1.7) * 0.15, -2.3 - Math.abs(t) * 0.4]} rotation={[0, -t * 0.7, t * 0.5]}>
              <boxGeometry args={[0.34, 0.46, 0.02]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.22} roughness={0.5} />
            </mesh>
          </Float>
        )
      })}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, -2.4]}>
        <circleGeometry args={[1.6, 48]} />
        <meshStandardMaterial color="#262420" roughness={0.8} />
      </mesh>

      <Particles count={60} color="#d4e8e8" spread={2.8} depth={-2.4} rise={0.14} opacity={0.4} />
    </>
  )
}

export const PORTAL_SCENES: Record<string, () => ReactNode> = {
  '01': SacredLakeScene,
  '02': EvolveScene,
  '03': MiroCoachScene,
  '04': AqmenScene,
  '05': FacilitacionScene,
}
