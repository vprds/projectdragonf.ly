# Cursor Brief — projectdragonf.ly
*Generado: 2026-06-15 · por Claude DF*

---

## Qué es este proyecto

`projectdragonf.ly` es el **meta-portal público de Project Dragonfly** — no el OS 3D (`dragonf.ly`), no una landing genérica. Es el lugar donde el sistema DF existe como entidad visible: identidad de Victor, proyectos activos como nodos vivos, y la libélula como protagonista.

**La diferencia clave:**

| URL | Qué es | Stack |
|-----|--------|-------|
| `dragonf.ly` | El OS 3D. Sacred Lake. Experiencia inmersiva R3F. | React Three Fiber |
| `projectdragonf.ly` | El hub del sistema. Portal de identidad + proyectos. | HTML/CSS/JS (actualmente) |

---

## Estado actual del repo

**Repo:** `github.com/vprds/projectdragonf.ly`
**Deploy:** Vercel — `projectdragonfly.vercel.app` → `projectdragonf.ly`
**Stack actual:** HTML/CSS/JS puro. Sin framework ni build step.
**Contenido actual:** Landing estática v0 — canvas 2D lago animado, libélula SVG, ripples al click, tipografía Cormorant + Space Mono, copy "something is forming."

El estado del repo es **desconocido** — revisar antes de tocar:
```bash
git log --oneline -10
git status
```

---

## Visión del redesign

### El elemento central: la libélula volando

El mismo DF que ya existe como elemento vivo en la landing de `evolve.football` (click → despliega status del proyecto) **vuela aquí en su hábitat natural** — `projectdragonf.ly` es su casa.

La libélula no es decoración. Es el **cursor del sistema**. Vuela, se posa, conecta nodos.

### Los tres roles simultáneos

**1. Hub del ecosistema DF**
Los proyectos activos aparecen como nodos. No un listado. Cada proyecto es un punto de presencia con estado en tiempo real (o semi-real). Al interactuar con la libélula o con un nodo, se despliega info del proyecto.

Proyectos a incluir en v1:
- `dragonf.ly` — el OS (Sacred Lake, 3D)
- `evolve.football` — Evolve Football
- `miro.coach` — Miro Coach
- `aqmen.ai` — Aqmen (cliente activo)
- `facilitacion.es` — Facilitación

Estados posibles por nodo: `running` · `seed` · `incubating` · `live`

**2. Portal de identidad de Victor**
@0xbik · Diseñador · Miro MVP · Framer Partner · Bartender · Madrid.
No un portfolio. Una presencia. Densa, precisa, sin floritura.

**3. Antesala del OS**
Conexión explícita hacia `dragonf.ly` cuando esté listo para abrir al público. `projectdragonf.ly` actúa como umbral consciente.

---

## Referencia de patrón existente — Evolve

En `evolve.football/landing` ya existe el patrón:
- Libélula DF como elemento vivo en la página
- Al hacer click: se despliega el status del proyecto Dragonfly
- Estados que ya existen en el ecosistema: `dragonfly running` · `dragonfly seed`

**Este patrón se invierte en `projectdragonf.ly`:** aquí la libélula no es un cameo — es el protagonista. Los proyectos son los que orbitan alrededor de ella.

---

## Dirección técnica

### Stack recomendado

Mantener sin framework pesado. La landing actual demuestra que HTML/CSS/JS puro funciona y despliega limpio en Vercel. Opciones:

- **Opción A (mínima):** Vanilla JS + CSS animations. La libélula como SVG animado con GSAP o CSS keyframes. Nodos como divs interactivos.
- **Opción B (upgrade):** Añadir un bundler ligero (Vite) para poder modularizar sin framework. Permite escalar a Web Components si se quiere.
- **Opción C (máxima coherencia con el OS):** Three.js para la libélula — misma tecnología que `dragonf.ly`, pero mucho más ligero que R3F completo. La libélula como mesh 3D simple sobre fondo minimal.

**Recomendación:** Opción A para v1. Velocidad sobre arquitectura. La libélula SVG animada ya existe en el HTML actual — partir de ahí.

### Estructura de archivos propuesta

```
projectdragonf.ly/
├── index.html          ← shell + estructura semántica
├── style.css           ← tokens visuales + layout
├── dragonfly.js        ← lógica de vuelo + interacción
├── nodes.js            ← data de proyectos + estados
├── assets/
│   ├── df-logo.svg     ← libélula SVG (existente, mejorar)
│   └── fonts/          ← Cormorant + Space Mono (ya usadas)
└── vercel.json         ← routing (si se necesita)
```

### La libélula — comportamiento

```
Estado idle:     vuela en loop suave por el canvas
Hover nodo:      la libélula se dirige hacia él
Click nodo:      se posa + despliega card con status
Scroll/tiempo:   cambia de zona (identidad → proyectos → umbral OS)
```

### Nodos — data structure

```js
const nodes = [
  {
    id: 'dragonfly-os',
    label: 'Sacred Lake',
    url: 'https://dragonf.ly',
    status: 'running', // running | seed | incubating | live
    tagline: 'the OS awakens beneath the surface',
  },
  {
    id: 'evolve',
    label: 'Evolve Football',
    url: 'https://evolve.football',
    status: 'live',
    tagline: 'reclaiming the game',
  },
  // ...
]
```

---

## Estética y tono

**Paleta:** Heredar de la landing actual. Fondos oscuros. Tipografía Cormorant (display) + Space Mono (código/datos).

**Movimiento:** Fluido, nunca brusco. La libélula tiene inercia — no teleporta, vuela.

**Densidad:** Alta en información, baja en decoración. Cada elemento tiene función.

**Tono del copy:** Como la landing actual — poético, preciso, sin explicar demasiado.
- "something is forming." ✅
- "Project Dragonfly is a connector system." ❌ (demasiado explicativo)

---

## Lo que NO es

- ❌ Un portfolio de diseño con thumbnails de proyectos
- ❌ Una página About con foto de Victor
- ❌ Una réplica de `dragonf.ly` (el OS es otra cosa)
- ❌ Una landing de marketing con CTA "Contact me"

---

## Checklist pre-inicio para Cursor

```
[ ] git log --oneline -10  (ver estado actual del repo)
[ ] git status             (cambios sin commitear)
[ ] Revisar index.html actual — extraer: libélula SVG, paleta, fuentes
[ ] Identificar qué de la landing actual se conserva vs se reemplaza
[ ] Confirmar con Victor: ¿stack permanece HTML puro o subimos a Vite?
[ ] Confirmar: ¿nodos como data hardcodeada en v1 o se conecta a algo?
```

---

## Conexiones vault

- `Domains/projectdragonf.ly.md` — historial del dominio
- `Projects/dragonfly-os/dragonfly-os — HUB.md` — el OS (no confundir)
- `Projects/Evolve/Overview.md` — patrón DF embed existente
- `Projects/dragonfly-os/Status.md` — estado técnico del OS

---

*Brief generado por Claude (Project Dragonfly vault). Para sesiones Cursor: leer este archivo + `CURSOR/README.md` antes de tocar código.*
