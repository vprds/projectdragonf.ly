import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { easing } from 'maath'
import { useRoute } from 'wouter'
import { PORTALS } from '../nodes'
import { useHub } from '../context/HubContext'
import { DragonflyModel, type FlapState } from './DragonflyModel'

export function Dragonfly() {
  const group = useRef<THREE.Group>(null)
  const { hoveredPortalId } = useHub()
  const [, params] = useRoute('/item/:id')

  const u = useRef(Math.random())
  const prevPos = useRef(new THREE.Vector3(0, 1.2, 1.2))
  const bank = useRef(0)
  const flap = useRef<FlapState>({ intensity: 1, speed: 26 })

  // Reusable scratch objects (avoid per-frame allocation).
  const scratch = useMemo(
    () => ({
      aim: new THREE.Object3D(),
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      look: new THREE.Vector3(),
      targetQ: new THREE.Quaternion(),
      rollQ: new THREE.Quaternion(),
      fwdAxis: new THREE.Vector3(0, 0, 1),
      camBias: new THREE.Vector3(0, 0.06, 0.5),
    }),
    []
  )

  // A smooth closed flight path that arcs over the portals, with gentle
  // elevation + depth variation so the motion reads as 3D, not a flat shuttle.
  const curve = useMemo(() => {
    const pts = PORTALS.map((p, i) => {
      const lift = i % 2 === 0 ? 0.95 : 1.22
      const depth = i % 2 === 0 ? 0.55 : 0.85
      return new THREE.Vector3(p.position[0] * 1.15, p.position[1] + lift, p.position[2] + depth)
    })
    return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
  }, [])

  const hoverAnchor = useMemo(() => {
    if (!hoveredPortalId) return null
    const portal = PORTALS.find((p) => p.id === hoveredPortalId)
    if (!portal) return null
    return new THREE.Vector3(portal.position[0], portal.position[1] + 0.7, portal.position[2] + 0.5)
  }, [hoveredPortalId])

  useFrame((state, dt) => {
    if (!group.current) return
    group.current.visible = !params?.id
    if (params?.id) return

    const t = state.clock.elapsedTime
    const s = scratch
    const g = group.current

    // Target position: glide along the curve, or break off toward a hovered portal.
    if (hoverAnchor) {
      s.pos.copy(hoverAnchor)
      s.pos.y += Math.sin(t * 2.2) * 0.04
    } else {
      u.current = (u.current + dt * 0.045) % 1
      curve.getPointAt(u.current, s.pos)
      // Organic drift — layered low-frequency sines (never lands on zero velocity).
      s.pos.x += Math.sin(t * 0.7) * 0.07 + Math.sin(t * 1.9) * 0.02
      s.pos.y += Math.sin(t * 1.3) * 0.05 + Math.sin(t * 0.5) * 0.04
      s.pos.z += Math.cos(t * 0.9) * 0.05
    }

    // Float toward the target (longer time constant = more weightless glide).
    easing.damp3(g.position, s.pos, hoverAnchor ? 0.28 : 0.5, dt)

    // Velocity from actual displacement.
    s.vel.copy(g.position).sub(prevPos.current)
    prevPos.current.copy(g.position)
    const speed = s.vel.length()

    // Heading: smooth. Build the desired orientation from travel direction
    // (biased gently toward the camera so the wings stay readable), then slerp.
    if (speed > 1e-5) {
      s.dir.copy(s.vel).normalize().multiplyScalar(0.55).add(s.camBias).normalize()
      s.aim.position.copy(g.position)
      s.aim.up.set(0, 1, 0)
      s.look.copy(g.position).add(s.dir)
      s.aim.lookAt(s.look)
      s.targetQ.copy(s.aim.quaternion)

      // Banking: roll into horizontal turns, smoothed.
      const targetBank = THREE.MathUtils.clamp(-s.vel.x * 70, -0.55, 0.55)
      bank.current = THREE.MathUtils.damp(bank.current, targetBank, 5, dt)
      s.rollQ.setFromAxisAngle(s.fwdAxis, bank.current + Math.sin(t * 1.6) * 0.05)
      s.targetQ.multiply(s.rollQ)

      // Slerp current → target (frame-rate independent).
      g.quaternion.slerp(s.targetQ, 1 - Math.exp(-dt * 7))
    }

    // Wing beat: a touch faster/harder when darting toward a hovered portal.
    flap.current.speed = hoverAnchor ? 32 : 24 + Math.sin(t * 0.8) * 2
    flap.current.intensity = hoverAnchor ? 1.15 : 1
  })

  return (
    <group ref={group} position={[0, 1.2, 1.2]}>
      <Float speed={1.6} rotationIntensity={0.08} floatIntensity={0.12}>
        <DragonflyModel flapRef={flap} />
      </Float>
    </group>
  )
}
