import { useEffect, useState } from 'react'
import * as THREE from 'three'
import FadeInSection from './FadeInSection'

interface ServiceCardProps {
  title: string
  description: string
  index: number
  sunDirRef?: React.MutableRefObject<THREE.Vector3>
}

export default function ServiceCard({
  title,
  description,
  index,
  sunDirRef,
}: ServiceCardProps) {
  const [shadowOpacity, setShadowOpacity] = useState(1)

  useEffect(() => {
    if (!sunDirRef) return

    const updateShadowOpacity = () => {
      const sunDir = sunDirRef.current
      // Index 0-1 are left side, 2-3 are right side
      const isLeftSide = index < 2
      const sunPointingRight = sunDir.x > 0

      // If sun is pointing right and this is left side (or vice versa), apply shadow
      const isInShadow = isLeftSide === sunPointingRight
      const opacity = isInShadow ? 0.15 : 1

      setShadowOpacity(opacity)
    }

    const animationFrame = setInterval(updateShadowOpacity, 16) // ~60fps
    return () => clearInterval(animationFrame)
  }, [index, sunDirRef])

  return (
    <FadeInSection delay={index * 0.1}>
      <div
        className="group py-10 flex items-start gap-8 md:gap-16 transition-opacity duration-300"
        style={{ opacity: shadowOpacity }}
      >
        <span className="font-display text-5xl md:text-6xl font-bold text-surface-light group-hover:text-accent-green transition-colors duration-500 leading-none shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-display font-bold text-text">
            {title}
          </h3>
          <p className="text-text-muted mt-2 max-w-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </FadeInSection>
  )
}
