import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { PORTALS } from './nodes'
import { Frame, Rig } from './components/Frame'
import { Dragonfly } from './components/Dragonfly'
import { PORTAL_SCENES } from './scenes/portal-scenes'
import { HubProvider } from './context/HubContext'
import './styles.css'

function HubOverlay() {
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  const active = PORTALS.find((p) => p.id === params?.id)

  return (
    <div className="hub-overlay">
      <header className="hub-header">
        <p className="hub-eyebrow">projectdragonf.ly</p>
        <h1 className="hub-title">
          something <em>is forming.</em>
        </h1>
        <p className="hub-sub">The OS awakens beneath the surface.</p>
        {!active && <p className="hub-hint-pill">hover a portal · double-click to enter</p>}
      </header>

      {active && (
        <div className="hub-hint">
          <button type="button" className="hub-back" onClick={() => setLocation('/')}>
            ← back to lake
          </button>
          <p className="hub-active">
            <span className={`status-dot status-${active.status}`} />
            {active.tagline}
            <a href={active.url} target="_blank" rel="noreferrer">
              {active.url.replace('https://', '')}
            </a>
          </p>
        </div>
      )}

      <footer className="hub-footer">
        <span>@0xbik · Madrid · design · facilitation · Madrid</span>
        <span className="hub-df-hint">the dragonfly connects the nodes</span>
      </footer>
    </div>
  )
}

export function App() {
  return (
    <HubProvider>
      <HubOverlay />
      <Canvas camera={{ fov: 70, position: [0, 0.2, 6.5] }} eventSource={document.getElementById('root')!} eventPrefix="client">
        <color attach="background" args={['#0a0e12']} />
        <fog attach="fog" args={['#0a0e12', 12, 30]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} color="#cfeaea" />
        <directionalLight position={[-4, 2, 2]} intensity={0.25} color="#7ecfcf" />
        {PORTALS.map((portal) => {
          const Scene = PORTAL_SCENES[portal.id]
          return (
            <Frame
              key={portal.id}
              id={portal.id}
              name={portal.name}
              author={portal.author}
              bg={portal.bg}
              width={portal.width}
              position={portal.position}
              rotation={portal.rotation}
            >
              {Scene ? <Scene /> : null}
            </Frame>
          )
        })}
        <Dragonfly />
        <Rig />
        <Preload all />
      </Canvas>
    </HubProvider>
  )
}
