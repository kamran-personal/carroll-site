import { useRef, useState, useEffect } from 'react'

export default function DraggableCube({ size = 110 }: { size?: number }) {
  const [rotX, setRotX] = useState(20)
  const [rotY, setRotY] = useState(-30)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef<number | null>(null)
  const targetRot = useRef({ x: 20, y: -30 })
  const dragStart = useRef({ x: 0, y: 0 })
  const dragRotStart = useRef({ x: 0, y: 0 })
  const cubeRef = useRef<HTMLDivElement>(null)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Dragging for mobile
  useEffect(() => {
    if (!isMobile || !cubeRef.current) return

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      setIsDragging(true)
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      dragStart.current = { x: clientX, y: clientY }
      dragRotStart.current = { x: targetRot.current.x, y: targetRot.current.y }
    }

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      const deltaX = clientX - dragStart.current.x
      const deltaY = clientY - dragStart.current.y

      targetRot.current = {
        x: dragRotStart.current.x + deltaY * 0.5,
        y: dragRotStart.current.y + deltaX * 0.5,
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const cube = cubeRef.current
    cube.addEventListener('mousedown', handleMouseDown as EventListener)
    cube.addEventListener('touchstart', handleMouseDown as EventListener)
    document.addEventListener('mousemove', handleMouseMove as EventListener)
    document.addEventListener('touchmove', handleMouseMove as EventListener)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      cube.removeEventListener('mousedown', handleMouseDown as EventListener)
      cube.removeEventListener('touchstart', handleMouseDown as EventListener)
      document.removeEventListener('mousemove', handleMouseMove as EventListener)
      document.removeEventListener('touchmove', handleMouseMove as EventListener)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [isMobile, isDragging])

  // Desktop mouse tracking or mobile animation loop
  useEffect(() => {
    let onMouseMove: ((e: MouseEvent) => void) | null = null

    if (!isMobile) {
      onMouseMove = (e: MouseEvent) => {
        // Map cursor position to rotation: center of screen = 0,0
        const nx = (e.clientX / window.innerWidth) * 2 - 1
        const ny = (e.clientY / window.innerHeight) * 2 - 1

        // Rotate up to ±70deg based on cursor position
        targetRot.current = {
          x: -ny * 70,
          y: nx * 70,
        }
      }
      window.addEventListener('mousemove', onMouseMove)
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

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

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
    <div
      ref={cubeRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: `${size * 5}px`,
        cursor: isMobile ? (isDragging ? 'grabbing' : 'grab') : 'auto',
        userSelect: 'none',
      }}
    >
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
