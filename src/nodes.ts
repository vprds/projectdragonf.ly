export type NodeStatus = 'running' | 'seed' | 'incubating' | 'live'

export type PortalNode = {
  id: string
  name: string
  author: string
  tagline: string
  url: string
  status: NodeStatus
  bg: string
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
}

// Order left → right (also defines the dragonfly patrol path).
// Sacred Lake / the OS sits at center; Miro + Facilitación to the right.
export const PORTALS: PortalNode[] = [
  {
    id: '02',
    name: 'evolve',
    author: 'evolve.football',
    tagline: 'reclaiming the game',
    url: 'https://evolve.football',
    status: 'live',
    bg: '#1a3a2a',
    position: [-2.15, 0, 0],
    rotation: [0, 0.62, 0],
    width: 0.82,
  },
  {
    id: '04',
    name: 'aqmen',
    author: 'aqmen.ai',
    tagline: 'intelligence, operational',
    url: 'https://aqmen.ai',
    status: 'running',
    bg: '#1f1a2e',
    position: [-1.05, 0.04, 0],
    rotation: [0, 0.28, 0],
    width: 0.88,
  },
  {
    id: '01',
    name: 'sacred\nlake',
    author: 'dragonf.ly · the OS',
    tagline: 'the OS awakens beneath the surface',
    url: 'https://dragonf.ly',
    status: 'running',
    bg: '#0d2535',
    position: [0, 0.08, 0],
    width: 0.98,
  },
  {
    id: '03',
    name: 'miro\ncoach',
    author: 'miro.coach',
    tagline: 'facilitation, distilled',
    url: 'https://miro.coach',
    status: 'live',
    bg: '#1a2a4a',
    position: [1.05, 0.04, 0],
    rotation: [0, -0.28, 0],
    width: 0.88,
  },
  {
    id: '05',
    name: 'facili\ntación',
    author: 'facilitacion.es',
    tagline: 'design thinking, live',
    url: 'https://facilitacion.es',
    status: 'live',
    bg: '#2a2a24',
    position: [2.15, 0, 0],
    rotation: [0, -0.62, 0],
    width: 0.82,
  },
]
