import { MutableRefObject, Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

const MODEL = '/assets/dragonfly-rig.glb'
const ACCENT = '#7ecfcf'

export type FlapState = { intensity: number; speed: number }

type WingBone = { bone: THREE.Bone; isFore: boolean; side: number }
type Rig = { wingBones: WingBone[]; rest: Map<string, THREE.Quaternion>; skins: THREE.SkinnedMesh[] }

// Wing bones identified via skin-weight analysis on the canonical Meshy rig.
// Same mapping the OS and evolve.football use — this is "our" dragonfly.
const WING_ROOTS: { name: string; isFore: boolean; side: number }[] = [
  { name: 'Bone_037', isFore: true, side: 1 },
  { name: 'Bone_040', isFore: true, side: -1 },
  { name: 'Bone_028', isFore: false, side: 1 },
  { name: 'Bone_030', isFore: false, side: -1 },
  { name: 'Bone_032', isFore: false, side: 1 },
  { name: 'Bone_034', isFore: false, side: -1 },
]

function buildWingRig(clone: THREE.Object3D): Rig {
  const skins: THREE.SkinnedMesh[] = []
  clone.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh) skins.push(child as THREE.SkinnedMesh)
  })
  const skeleton = skins[0]?.skeleton
  const wingBones: WingBone[] = []
  const rest = new Map<string, THREE.Quaternion>()
  if (!skeleton) return { wingBones, rest, skins }

  WING_ROOTS.forEach((cfg) => {
    const bone = skeleton.bones.find((b) => b.name === cfg.name)
    if (bone) {
      wingBones.push({ bone, isFore: cfg.isFore, side: cfg.side })
      rest.set(bone.uuid, bone.quaternion.clone())
    }
  })
  return { wingBones, rest, skins }
}

function applyWingFlap(rig: Rig, intensity: number, time: number, speed: number) {
  const { wingBones, rest, skins } = rig
  if (!wingBones.length) return
  wingBones.forEach(({ bone, isFore, side }) => {
    const base = rest.get(bone.uuid)
    if (!base) return
    bone.quaternion.copy(base)
    const phase = isFore ? 0 : Math.PI * 0.45
    const amp = isFore ? 0.38 : 0.32
    bone.rotateX(Math.sin(time * speed + phase) * intensity * amp * side)
  })
  skins.forEach((mesh) => mesh.skeleton.update())
}

function RiggedDragonfly({
  flapRef,
  scale = 0.24,
}: {
  flapRef: MutableRefObject<FlapState>
  scale?: number
}) {
  const { scene } = useGLTF(MODEL)
  const rigRef = useRef<Rig>({ wingBones: [], rest: new Map(), skins: [] })

  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene)
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh && mesh.material) {
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
        mat.side = THREE.DoubleSide
        if (mat.emissive) {
          mat.emissive = new THREE.Color(ACCENT)
          mat.emissiveIntensity = 0.15
        }
        mesh.material = mat
      }
    })
    rigRef.current = buildWingRig(clone)
    return clone
  }, [scene])

  useFrame(({ clock }) => {
    const f = flapRef.current
    applyWingFlap(rigRef.current, f.intensity, clock.elapsedTime, f.speed)
  })

  return (
    <group scale={scale}>
      <primitive object={model} rotation={[-0.1, 0, 0]} />
      <pointLight color={ACCENT} intensity={1.6} distance={4} decay={1.6} />
    </group>
  )
}

// Lightweight fallback while the rigged GLB streams in (or if it fails).
function ProceduralDragonfly() {
  const wings = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (wings.current) wings.current.rotation.z = Math.sin(state.clock.elapsedTime * 18) * 0.35
  })
  return (
    <group scale={0.55}>
      <pointLight color={ACCENT} intensity={1.4} distance={3} decay={1.6} />
      <mesh>
        <capsuleGeometry args={[0.06, 0.4, 4, 8]} />
        <meshStandardMaterial color="#6fc6c6" emissive="#1f4a52" emissiveIntensity={0.6} />
      </mesh>
      <group ref={wings}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.22, 0.05, 0]} rotation={[0, 0, s * 0.35]}>
            <planeGeometry args={[0.5, 0.14]} />
            <meshStandardMaterial color="#9fe0e0" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function DragonflyModel({ flapRef }: { flapRef: MutableRefObject<FlapState> }) {
  return (
    <Suspense fallback={<ProceduralDragonfly />}>
      <RiggedDragonfly flapRef={flapRef} />
    </Suspense>
  )
}

useGLTF.preload(MODEL)

export { DragonflyModel, ProceduralDragonfly }
