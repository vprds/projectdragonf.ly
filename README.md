# projectdragonf.ly

Meta-portal público de [[Dragonfly Overview|Project Dragonfly]] — hub de identidad + proyectos con portales 3D.

## Stack

- Vite + React 18 + TypeScript
- @react-three/fiber + @react-three/drei (`MeshPortalMaterial`)
- wouter (routing `/item/:id`)
- maath (rounded planes + easing.damp)

## Dev

```bash
npm install
npm run dev
```

## Deploy

Vercel — `dist/` output. Push to `main` redeploys.

- Preview: https://projectdragonfly.vercel.app
- Production: https://projectdragonf.ly

## Portals v0.2

| ID | Proyecto | URL |
|----|----------|-----|
| 01 | Sacred Lake (dragonf.ly) | https://dragonf.ly |
| 02 | Evolve Football | https://evolve.football |
| 03 | Miro Coach | https://miro.coach |

Double-click portal to enter. Camera animates via `CameraControls.setLookAt`.

## Docs

- `docs/cursor-brief.md` — visión y nodos v1
- Vault: `Domains/projectdragonf.ly.md`

## Legacy

v0 static HTML (lake canvas + SVG dragonfly) superseded by enter-portals R3F build.
