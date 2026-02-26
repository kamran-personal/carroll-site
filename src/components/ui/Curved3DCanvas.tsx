import { useEffect, useRef } from 'react'

interface Curved3DCanvasProps {
  src: string
  alt: string
  className?: string
  curvatureRadius?: number
}

export default function Curved3DCanvas({
  src,
  alt,
  className = '',
  curvatureRadius = 1500,
}: Curved3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const elementOffsetRef = useRef(0)

  // Load image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      imageRef.current = img
      draw()
    }
    img.onerror = () => {
      console.error('Failed to load image:', src)
    }
  }, [src])

  // Calculate element's position in viewport
  useEffect(() => {
    const updateOffset = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        elementOffsetRef.current = rect.top + window.scrollY
      }
    }
    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [])

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas || !imageRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    const width = canvas.width
    const height = canvas.height

    // Calculate rotation angle based on scroll position
    const elementCenter = elementOffsetRef.current + height / 2
    const viewportCenter = window.scrollY + window.innerHeight / 2
    const distanceFromCenter = viewportCenter - elementCenter

    // Convert distance to rotation angle (max ±20 degrees)
    const rotationX = (distanceFromCenter / curvatureRadius) * 20
    const angleRad = (rotationX * Math.PI) / 180

    ctx.clearRect(0, 0, width, height)
    ctx.save()

    // Apply perspective via horizontal strips with scaling
    const stripHeight = 3
    const cosA = Math.cos(angleRad)
    const sinA = Math.sin(angleRad)
    const fov = 1200

    for (let y = 0; y < height; y += stripHeight) {
      // Normalized y position (-0.5 to 0.5)
      const normalizedY = y / height - 0.5

      // Perspective calculation - distance from camera
      const depth = 1 + (sinA * normalizedY * height) / fov
      if (depth <= 0) continue

      // Scale based on depth
      const scaleY = cosA / depth

      // Source rectangle from image
      const sourceY = (y / height) * img.height
      const sourceHeight = (stripHeight / height) * img.height

      // Destination with perspective
      const destY = y - normalizedY * height * sinA * 50
      const destHeight = stripHeight * scaleY

      // Opacity based on rotation
      ctx.globalAlpha = Math.max(0.4, 1 - Math.abs(sinA) * 0.5)

      // Draw the strip
      ctx.drawImage(img, 0, sourceY, img.width, sourceHeight, 0, destY, width, destHeight)
    }

    ctx.globalAlpha = 1
    ctx.restore()
  }

  // Handle scroll
  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        draw()
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  // Set canvas size to match container
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas || !canvas.parentElement) return

      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)

      draw()
    }

    resizeCanvas()

    const resizeObserver = new ResizeObserver(resizeCanvas)
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement)
    }

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      style={{ display: 'block' }}
    />
  )
}
