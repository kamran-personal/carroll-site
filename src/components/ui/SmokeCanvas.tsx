import { useRef, useEffect, useCallback } from 'react'

// ── Physics constants ───────────────────────────────────────────────
const PARTICLE_SIZE = 12
const PAD = 180
const EXCL_R = 62
const SOFT_R = 130
const FORCE = 12
const SPRING = 0.052
const DAMP = 0.80
const REST_EPS = 0.09
const DETECT = 120

interface Particle {
  x: number; y: number
  ox: number; oy: number
  vx: number; vy: number
  opacity: number
  targetOpacity: number
}

interface Props { src: string; alt?: string; className?: string }

export default function SmokeCanvas({ src, alt = '', className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouse = useRef({ x: 0, y: 0, inside: false })
  const raf = useRef<number | null>(null)
  const ready = useRef(false)
  const dimRef = useRef({ w: 0, h: 0 })

  const stopLoop = useCallback(() => {
    if (raf.current != null) {
      cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }, [])

  const startLoop = useCallback(() => {
    if (raf.current != null || !ready.current) return

    const tick = () => {
      const canvas = canvasRef.current
      const off = offRef.current
      if (!canvas || !off) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { x: mx, y: my, inside } = mouse.current
      const particles = particlesRef.current
      const W = canvas.width
      const H = canvas.height

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      let anyActive = inside

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // ── Spring toward origin ──────────────────────────────────────
        p.vx += (p.ox - p.x) * SPRING
        p.vy += (p.oy - p.y) * SPRING

        // ── Soft repulsion in outer ring ──────────────────────────────
        if (inside) {
          const cx = p.x + PARTICLE_SIZE * 0.5
          const cy = p.y + PARTICLE_SIZE * 0.5
          const dx = cx - mx
          const dy = cy - my
          const d2 = dx * dx + dy * dy
          const d = Math.sqrt(d2)
          if (d >= EXCL_R && d < SOFT_R && d > 0.01) {
            const mag = ((SOFT_R - d) / SOFT_R) * FORCE
            p.vx += (dx / d) * mag
            p.vy += (dy / d) * mag
          }
        }

        // ── Damping + integrate ───────────────────────────────────────
        p.vx *= DAMP
        p.vy *= DAMP
        p.x += p.vx
        p.y += p.vy

        // ── Hard exclusion AFTER integration ─────────────────────────
        if (inside) {
          const cx = p.x + PARTICLE_SIZE * 0.5
          const cy = p.y + PARTICLE_SIZE * 0.5
          const dx = cx - mx
          const dy = cy - my
          const d2 = dx * dx + dy * dy
          const d = Math.sqrt(d2)
          if (d < EXCL_R) {
            if (d > 0.01) {
              const scale = (EXCL_R + 1) / d
              p.x = mx + dx * scale - PARTICLE_SIZE * 0.5
              p.y = my + dy * scale - PARTICLE_SIZE * 0.5
              const dot = p.vx * (dx / d) + p.vy * (dy / d)
              if (dot < 0) {
                p.vx -= dot * (dx / d)
                p.vy -= dot * (dy / d)
              }
            } else {
              const angle = Math.random() * Math.PI * 2
              p.x = mx + Math.cos(angle) * EXCL_R - PARTICLE_SIZE * 0.5
              p.y = my + Math.sin(angle) * EXCL_R - PARTICLE_SIZE * 0.5
            }
          }
        }

        // ── Opacity easing toward target ──────────────────────────────
        p.targetOpacity = inside ? 0.5 : 1.0
        p.opacity += (p.targetOpacity - p.opacity) * 0.1

        // ── Draw smoke particle ──────────────────────────────────────
        const tx = Math.round(p.x)
        const ty = Math.round(p.y)
        if (tx + PARTICLE_SIZE > 0 && tx < W && ty + PARTICLE_SIZE > 0 && ty < H) {
          ctx.getImageData(tx, ty, PARTICLE_SIZE, PARTICLE_SIZE)

          // Draw from source
          ctx.drawImage(off, p.ox - PAD, p.oy - PAD, PARTICLE_SIZE, PARTICLE_SIZE, tx, ty, PARTICLE_SIZE, PARTICLE_SIZE)

          // Apply wispy smoke effect: additive blend with transparency
          ctx.save()
          ctx.globalAlpha = p.opacity * 0.6
          ctx.globalCompositeOperation = 'screen'
          ctx.drawImage(off, p.ox - PAD, p.oy - PAD, PARTICLE_SIZE, PARTICLE_SIZE, tx, ty, PARTICLE_SIZE, PARTICLE_SIZE)
          ctx.restore()
        }

        if (!anyActive) {
          const dx2 = p.x - p.ox
          const dy2 = p.y - p.oy
          if (
            Math.abs(p.vx) > REST_EPS ||
            Math.abs(p.vy) > REST_EPS ||
            Math.abs(dx2) > REST_EPS ||
            Math.abs(dy2) > REST_EPS
          ) {
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
        ctx.drawImage(off, PAD, PAD)
      }
    }

    raf.current = requestAnimationFrame(tick)
  }, [])

  const init = useCallback(() => {
    const wrap = wrapRef.current
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

    canvas.width = w + 2 * PAD
    canvas.height = h + 2 * PAD

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const oc = off.getContext('2d')!

      const imgAR = img.naturalWidth / img.naturalHeight
      const canAR = w / h
      let sx = 0
      let sy = 0
      let sw = img.naturalWidth
      let sh = img.naturalHeight
      if (imgAR > canAR) {
        sw = sh * canAR
        sx = (img.naturalWidth - sw) / 2
      } else {
        sh = sw / canAR
        sy = (img.naturalHeight - sh) / 2
      }
      oc.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
      offRef.current = off

      const cols = Math.ceil(w / PARTICLE_SIZE)
      const rows = Math.ceil(h / PARTICLE_SIZE)
      const particles: Particle[] = new Array(cols * rows)
      let idx = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * PARTICLE_SIZE + PAD
          const oy = r * PARTICLE_SIZE + PAD
          particles[idx++] = { x: ox, y: oy, ox, oy, vx: 0, vy: 0, opacity: 1, targetOpacity: 1 }
        }
      }
      particlesRef.current = particles

      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(off, PAD, PAD)
      canvas.style.opacity = '1'
      ready.current = true
    }
    img.onerror = () => {
      canvas.style.opacity = '0'
    }
    img.src = src.includes('?') ? src + '&_cv=1' : src + '?_cv=1'
  }, [src, stopLoop])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    init()
    const ro = new ResizeObserver(init)
    ro.observe(wrap)
    return () => {
      ro.disconnect()
      stopLoop()
    }
  }, [init, stopLoop])

  useEffect(() => {
    const onDocMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (!r) return

      mouse.current.x = e.clientX - r.left + PAD
      mouse.current.y = e.clientY - r.top + PAD

      const near =
        e.clientX >= r.left - DETECT &&
        e.clientX <= r.right + DETECT &&
        e.clientY >= r.top - DETECT &&
        e.clientY <= r.bottom + DETECT

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
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Fallback img — behind the canvas */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      {/* Smoke canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: `-${PAD}px`,
          left: `-${PAD}px`,
          width: `calc(100% + ${2 * PAD}px)`,
          height: `calc(100% + ${2 * PAD}px)`,
          opacity: 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
