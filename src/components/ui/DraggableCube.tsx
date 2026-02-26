import { useRef, useState, useEffect } from 'react'

export default function DraggableCube({ size = 110 }: { size?: number }) {
  const [rotX, setRotX] = useState(20)
  const [rotY, setRotY] = useState(-30)
  const rafRef = useRef<number | null>(null)
  const targetRot = useRef({ x: 20, y: -30 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Map cursor position to rotation: center of screen = 0,0
      const nx = (e.clientX / window.innerWidth) * 2 - 1   // -1 to 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1  // -1 to 1

      // Rotate up to ±70deg based on cursor position
      targetRot.current = {
        x: -ny * 70,
        y: nx * 70,
      }
    }

    // Smooth lerp loop
    const animate = () => {
      setRotX(prev => {
        const diff = targetRot.current.x - prev
        return Math.abs(diff) < 0.01 ? targetRot.current.x : prev + diff * 0.14
      })
      setRotY(prev => {
        const diff = targetRot.current.y - prev
        return Math.abs(diff) < 0.01 ? targetRot.current.y : prev + diff * 0.14
      })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const half = size / 2

  const face = (transform: string, brightness = 1) => ({
    position: 'absolute' as const,
    width: `${size}px`,
    height: `${size}px`,
    transform,
    background: `linear-gradient(135deg,
      rgb(${Math.round(255 * brightness)},${Math.round(220 * brightness)},${Math.round(60 * brightness)}) 0%,
      rgb(${Math.round(212 * brightness)},${Math.round(175 * brightness)},${Math.round(55 * brightness)}) 40%,
      rgb(${Math.round(160 * brightness)},${Math.round(120 * brightness)},${Math.round(20 * brightness)}) 70%,
      rgb(${Math.round(220 * brightness)},${Math.round(180 * brightness)},${Math.round(40 * brightness)}) 100%
    )`,
    border: `1px solid rgba(255,215,0,0.6)`,
    boxShadow: `inset 0 0 ${size * 0.25}px rgba(255,240,100,0.3)`,
  })

  return (
    <div style={{ width: `${size}px`, height: `${size}px`, perspective: `${size * 5}px` }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        <div style={face(`translateZ(${half}px)`, 1.0)} />
        <div style={face(`rotateY(180deg) translateZ(${half}px)`, 0.6)} />
        <div style={face(`rotateY(-90deg) translateZ(${half}px)`, 0.75)} />
        <div style={face(`rotateY(90deg) translateZ(${half}px)`, 0.85)} />
        <div style={face(`rotateX(90deg) translateZ(${half}px)`, 0.65)} />
        <div style={face(`rotateX(-90deg) translateZ(${half}px)`, 0.55)} />
      </div>
    </div>
  )
}
