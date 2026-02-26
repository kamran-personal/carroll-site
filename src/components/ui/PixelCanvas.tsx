import { useRef, useEffect, useCallback } from 'react'

// ── Physics constants ───────────────────────────────────────────────
const BLOCK    = 8
const PAD      = 180    // canvas bleeds this far outside the image on every side
const EXCL_R   = 62     // hard-black exclusion radius
const SOFT_R   = 130    // outer repulsion falloff radius
const FORCE    = 12
const SPRING   = 0.052
const DAMP     = 0.80
const REST_EPS = 0.09
const DETECT   = 120    // px outside image frame where repulsion begins

// Tile coords (x, y, ox, oy) are in canvas space — the image starts at (PAD, PAD)
interface Tile {
  x: number; y: number
  ox: number; oy: number
  vx: number; vy: number
}

interface Props { src: string; alt?: string; className?: string }

export default function PixelCanvas({ src, alt = '', className = '' }: Props) {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offRef    = useRef<HTMLCanvasElement | null>(null)
  const tilesRef  = useRef<Tile[]>([])
  const mouse     = useRef({ x: 0, y: 0, inside: false })
  const raf       = useRef<number | null>(null)
  const ready     = useRef(false)
  const dimRef    = useRef({ w: 0, h: 0 })

  const stopLoop = useCallback(() => {
    if (raf.current != null) { cancelAnimationFrame(raf.current); raf.current = null }
  }, [])

  const startLoop = useCallback(() => {
    if (raf.current != null || !ready.current) return

    const tick = () => {
      const canvas = canvasRef.current
      const off    = offRef.current
      if (!canvas || !off) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { x: mx, y: my, inside } = mouse.current
      const tiles = tilesRef.current
      const W = canvas.width, H = canvas.height

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      let anyActive = inside

      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i]

        // ── Spring toward origin ──────────────────────────────────────
        t.vx += (t.ox - t.x) * SPRING
        t.vy += (t.oy - t.y) * SPRING

        // ── Soft repulsion in outer ring ──────────────────────────────
        if (inside) {
          const cx = t.x + BLOCK * 0.5
          const cy = t.y + BLOCK * 0.5
          const dx = cx - mx
          const dy = cy - my
          const d2 = dx * dx + dy * dy
          const d  = Math.sqrt(d2)
          if (d >= EXCL_R && d < SOFT_R && d > 0.01) {
            const mag = ((SOFT_R - d) / SOFT_R) * FORCE
            t.vx += (dx / d) * mag
            t.vy += (dy / d) * mag
          }
        }

        // ── Damping + integrate ───────────────────────────────────────
        t.vx *= DAMP
        t.vy *= DAMP
        t.x  += t.vx
        t.y  += t.vy

        // ── Hard exclusion AFTER integration ─────────────────────────
        if (inside) {
          const cx = t.x + BLOCK * 0.5
          const cy = t.y + BLOCK * 0.5
          const dx = cx - mx
          const dy = cy - my
          const d2 = dx * dx + dy * dy
          const d  = Math.sqrt(d2)
          if (d < EXCL_R) {
            if (d > 0.01) {
              const scale = (EXCL_R + 1) / d
              t.x = mx + dx * scale - BLOCK * 0.5
              t.y = my + dy * scale - BLOCK * 0.5
              const dot = t.vx * (dx / d) + t.vy * (dy / d)
              if (dot < 0) {
                t.vx -= dot * (dx / d)
                t.vy -= dot * (dy / d)
              }
            } else {
              const angle = Math.random() * Math.PI * 2
              t.x = mx + Math.cos(angle) * EXCL_R - BLOCK * 0.5
              t.y = my + Math.sin(angle) * EXCL_R - BLOCK * 0.5
            }
          }
        }

        // ── Draw — source in offscreen = canvas pos minus PAD ────────
        //    Tiles that slide into the PAD zone are drawn there (spill
        //    out past the image edge into the black surround).
        const tx = Math.round(t.x)
        const ty = Math.round(t.y)
        if (tx + BLOCK > 0 && tx < W && ty + BLOCK > 0 && ty < H) {
          ctx.drawImage(off, t.ox - PAD, t.oy - PAD, BLOCK, BLOCK, tx, ty, BLOCK, BLOCK)
        }

        if (!anyActive) {
          const dx2 = t.x - t.ox, dy2 = t.y - t.oy
          if (Math.abs(t.vx) > REST_EPS || Math.abs(t.vy) > REST_EPS ||
              Math.abs(dx2) > REST_EPS   || Math.abs(dy2) > REST_EPS) {
            anyActive = true
          }
        }
      }

      if (anyActive) {
        raf.current = requestAnimationFrame(tick)
      } else {
        raf.current = null
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, W, H)
        // Image sits at canvas offset (PAD, PAD)
        ctx.drawImage(off, PAD, PAD)
      }
    }

    raf.current = requestAnimationFrame(tick)
  }, [])

  const init = useCallback(() => {
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const rect = wrap.getBoundingClientRect()
    const w = Math.round(rect.width)
    const h = Math.round(rect.height)
    if (w < 4 || h < 4) return
    if (w === dimRef.current.w && h === dimRef.current.h && offRef.current) return

    dimRef.current = { w, h }
    stopLoop()
    ready.current = false

    // Canvas is PAD pixels larger on every side so tiles can spill out
    canvas.width  = w + 2 * PAD
    canvas.height = h + 2 * PAD

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const off = document.createElement('canvas')
      off.width  = w
      off.height = h
      const oc = off.getContext('2d')!

      const imgAR = img.naturalWidth / img.naturalHeight
      const canAR = w / h
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
      if (imgAR > canAR) { sw = sh * canAR;  sx = (img.naturalWidth  - sw) / 2 }
      else               { sh = sw / canAR;  sy = (img.naturalHeight - sh) / 2 }
      oc.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
      offRef.current = off

      // Tile origins are in canvas coords (PAD offset from image top-left)
      const cols = Math.ceil(w / BLOCK)
      const rows = Math.ceil(h / BLOCK)
      const tiles: Tile[] = new Array(cols * rows)
      let idx = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * BLOCK + PAD
          const oy = r * BLOCK + PAD
          tiles[idx++] = { x: ox, y: oy, ox, oy, vx: 0, vy: 0 }
        }
      }
      tilesRef.current = tiles

      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(off, PAD, PAD)
      canvas.style.opacity = '1'
      ready.current = true
    }
    img.onerror = () => { canvas.style.opacity = '0' }
    img.src = src.includes('?') ? src + '&_cv=1' : src + '?_cv=1'
  }, [src, stopLoop])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    init()
    const ro = new ResizeObserver(init)
    ro.observe(wrap)
    return () => { ro.disconnect(); stopLoop() }
  }, [init, stopLoop])

  // ── Document-level mouse tracking — effect starts DETECT px before cursor
  //    reaches the image, avoiding React event capture / z-index issues
  useEffect(() => {
    const onDocMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (!r) return

      mouse.current.x = e.clientX - r.left + PAD
      mouse.current.y = e.clientY - r.top  + PAD

      const near = e.clientX >= r.left - DETECT && e.clientX <= r.right  + DETECT
                && e.clientY >= r.top  - DETECT && e.clientY <= r.bottom + DETECT

      const wasInside = mouse.current.inside
      mouse.current.inside = near

      if (near || wasInside) startLoop()
    }

    const onDocLeave = () => {
      if (!mouse.current.inside) return
      mouse.current.inside = false
      startLoop()
    }

    document.addEventListener('mousemove', onDocMove)
    document.addEventListener('mouseleave', onDocLeave)
    return () => {
      document.removeEventListener('mousemove', onDocMove)
      document.removeEventListener('mouseleave', onDocLeave)
    }
  }, [startLoop])

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
    >
      {/* Fallback img — behind the canvas, shows on CORS failure */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      {/* Canvas extends PAD px beyond the wrapper on all sides so
          tiles can spill out into the black surround when pushed */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top:    `-${PAD}px`,
          left:   `-${PAD}px`,
          width:  `calc(100% + ${2 * PAD}px)`,
          height: `calc(100% + ${2 * PAD}px)`,
          opacity: 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
