import * as THREE from 'three'
import { useEffect, useRef, useState, ReactNode } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, MeshPortalMaterial, Text, useCursor, type PortalMaterialType } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'

extend(geometry)

const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

import { useHub } from '../context/HubContext'

type FrameProps = {
  id: string
  name: string
  author: string
  bg?: string
  width?: number
  height?: number
  children?: ReactNode
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Frame({
  id,
  name,
  author,
  bg = '#1a3a4a',
  width = 1,
  height = 1.61803398875,
  children,
  ...props
}: FrameProps) {
  const portal = useRef<PortalMaterialType>(null)
  const { setHoveredPortalId } = useHub()
  const [, setLocation] = useLocation()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((_, dt) => {
    if (portal.current) {
      easing.damp(portal.current, 'blend', params?.id === id ? 1 : 0, 0.2, dt)
    }
  })

  return (
    <group {...props}>
      <Text
        font={(suspend(medium) as { default: string }).default}
        fontSize={0.28}
        anchorY="top"
        anchorX="left"
        lineHeight={0.8}
        position={[-0.375, 0.715, 0.01]}
        material-toneMapped={false}
        color="#d4e8e8"
      >
        {name}
      </Text>
      <Text
        font={(suspend(regular) as { default: string }).default}
        fontSize={0.1}
        anchorX="right"
        position={[0.4, -0.659, 0.01]}
        material-toneMapped={false}
        color="#7ecfcf"
      >
        /{id}
      </Text>
      <Text
        font={(suspend(regular) as { default: string }).default}
        fontSize={0.04}
        anchorX="right"
        position={[0.0, -0.677, 0.01]}
        material-toneMapped={false}
        color="rgba(212,232,232,0.5)"
      >
        {author}
      </Text>
      <mesh
        name={id}
        onDoubleClick={(e) => {
          e.stopPropagation()
          setLocation('/item/' + e.object.name)
        }}
        onPointerOver={() => {
          hover(true)
          setHoveredPortalId(id)
        }}
        onPointerOut={() => {
          hover(false)
          setHoveredPortalId(null)
        }}
      >
        {/* @ts-expect-error extended via maath geometry */}
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={params?.id === id} side={THREE.DoubleSide}>
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

export function Rig({
  position = new THREE.Vector3(0, 0, 2),
  focus = new THREE.Vector3(0, 0, 0),
}) {
  const { controls, scene } = useThree()
  const [, params] = useRoute('/item/:id')
  const cameraControls = controls as CameraControls | null

  useEffect(() => {
    const active = params?.id ? scene.getObjectByName(params.id) : null
    if (active?.parent) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25))
      active.parent.localToWorld(focus.set(0, 0, -2))
      cameraControls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
    } else {
      cameraControls?.setLookAt(0, 0.2, 6.5, 0, 0, 0, true)
    }
  }, [params?.id, cameraControls, scene, position, focus])

  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
