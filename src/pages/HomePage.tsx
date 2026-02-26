import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import FadeInSection from '../components/ui/FadeInSection'
import ServiceCard from '../components/ui/ServiceCard'
import DraggableCube from '../components/ui/DraggableCube'
import EarthSphere from '../components/ui/EarthSphere'
import PixelCanvas from '../components/ui/PixelCanvas'
import { services } from '../data/services'
import { projects } from '../data/projects'

function WorkProject({ project, index }: { project: typeof projects[0]; index: number }) {
  const glowRef = useRef<HTMLDivElement>(null)

  const onFrameMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!glowRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const mask = `radial-gradient(ellipse 120px 80px at ${x}px ${y}px, black 0%, transparent 100%)`
    glowRef.current.style.maskImage = mask
    glowRef.current.style.webkitMaskImage = mask
    glowRef.current.style.opacity = '1'
  }

  const onFrameMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }

  return (
    <FadeInSection delay={index * 0.05}>
      <div style={{ width: '70vw', margin: '0 auto' }}>
        {/* Labels row */}
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[11px] font-medium text-white/35 tracking-[0.25em] uppercase">
            {String(index + 1).padStart(2, '0')} — {String(projects.length).padStart(2, '0')}
          </span>
          <span className="text-[11px] font-medium text-white/35 tracking-[0.25em] uppercase">
            {project.title}
          </span>
        </div>

        {/* Image frame */}
        <motion.div
          layoutId={`project-image-${project.id}`}
          className="relative w-full"
          style={{ aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: '0.5rem' }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={onFrameMouseMove}
          onMouseLeave={onFrameMouseLeave}
        >
          {/* Pixel displacement canvas */}
          <PixelCanvas
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full"
          />

          {/* Overlays */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                'linear-gradient(to top,    rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.12) 40%, transparent 65%)',
                'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 40%)',
                'linear-gradient(to right,  rgba(0,0,0,0.40) 0%, transparent 40%)',
                'linear-gradient(to left,   rgba(0,0,0,0.40) 0%, transparent 40%)',
              ].join(', '),
            }}
          />
          <div className="photo-grain pointer-events-none" aria-hidden="true" />

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 pb-8 z-10 flex justify-center px-4 pointer-events-none">
            <h3
              className="text-white uppercase text-center leading-[0.88]"
              style={{
                fontFamily: 'var(--font-impact)',
                fontWeight: 900,
                fontSize: 'clamp(1.2rem, 3.5vw, 4rem)',
                letterSpacing: '0.08em',
              }}
            >
              {project.title}
            </h3>
          </div>

          {/* Glow layer */}
          <div
            ref={glowRef}
            className="absolute bottom-0 left-0 right-0 pb-8 z-20 flex justify-center px-4 pointer-events-none"
            style={{ opacity: 0, transition: 'opacity 0.15s' }}
          >
            <h3
              className="uppercase text-center leading-[0.88]"
              style={{
                fontFamily: 'var(--font-impact)',
                fontWeight: 900,
                fontSize: 'clamp(1.2rem, 3.5vw, 4rem)',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,1)',
                textShadow: '0 0 8px rgba(255,255,255,1), 0 0 24px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.5)',
                filter: 'brightness(1.4)',
              }}
            >
              {project.title}
            </h3>
          </div>
        </motion.div>

        {/* View Project button */}
        <div className="flex justify-center relative z-10" style={{ marginTop: '-1.4rem' }}>
          <Link
            to={`/portfolio/${project.id}`}
            className="group/btn relative inline-flex items-center gap-3 border-2 border-white/65 rounded-full px-14 py-[1.1rem] text-sm font-medium uppercase tracking-[0.2em] text-white overflow-hidden transition-colors duration-300 hover:border-transparent"
          >
            <span className="absolute inset-0 bg-accent-green rounded-full translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
            <span className="relative z-10 group-hover/btn:text-bg transition-colors duration-300">
              View Project
            </span>
            <span className="relative z-10 group-hover/btn:text-bg transition-colors duration-300 text-base leading-none">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </FadeInSection>
  )
}

function CheckOutOurWork() {
  const [distance, setDistance] = useState(Infinity)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dist = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        )
        setDistance(dist)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const vibrationIntensity = Math.max(0, 1 - distance / 300)
  const vibrationAmount = vibrationIntensity * vibrationIntensity * 12

  return (
    <div ref={containerRef} className="relative mt-48 mb-8">
      <motion.div
        animate={{
          x: (Math.random() - 0.5) * vibrationAmount,
          y: (Math.random() - 0.5) * vibrationAmount,
        }}
        transition={{ duration: 0.05, repeat: Infinity }}
      >
        <Link
          to="/portfolio"
          className="block group"
        >
          <h2 className="font-display text-5xl md:text-6xl font-bold text-center text-text group-hover:text-accent-green transition-colors duration-500 whitespace-nowrap">
            Check out our work
          </h2>
        </Link>
      </motion.div>
    </div>
  )
}

export default function HomePage() {
  const sunDirRef = useRef(new THREE.Vector3(1.5, 0.5, 1.0).normalize())

  return (
    <>
      {/* ===== HERO: Full-bleed cinematic dark ===== */}
      <section className="relative h-screen overflow-hidden bg-black">
        {/* Texture overlay - matches work page */}
        <div className="portfolio-grain" aria-hidden="true" />

        {/* Gold 3D cube — centered above headline */}
        <div className="absolute bottom-[48%] left-1/2 -translate-x-1/2 z-10">
          <DraggableCube size={300} />
        </div>

        {/* Headline text — split layout */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-10 pb-8 md:pb-14">
          <div className="max-w-[100rem] mx-auto">
            {/* Line 1: BUILT left, TO BE right */}
            <div className="flex justify-between items-end leading-[0.85]">
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="block font-display text-[10vw] md:text-[8vw] font-extrabold text-white tracking-[-0.02em]"
                >
                  BUILT
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block font-display text-[10vw] md:text-[8vw] font-extrabold text-white tracking-[-0.02em]"
                >
                  TO BE
                </motion.span>
              </div>
            </div>
            {/* Line 2: NOTICED centered */}
            <div className="flex justify-center leading-[0.85] -mt-[1vw]">
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block font-display text-[10vw] md:text-[8vw] font-extrabold text-white tracking-[-0.02em]"
                >
                  NOTICED
                </motion.span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ===== Services ===== */}
      <section className="py-32 px-6 md:px-10">
        <div>
          <FadeInSection>
            <span className="text-xs uppercase tracking-[0.3em] text-accent-green font-semibold block text-center">
              What We Do
            </span>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <h2 className="font-display text-7xl md:text-8xl font-bold mt-4 mb-20 text-center">
              We straddle two worlds
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-12 gap-12 items-start min-h-[700px]">
            {/* Left column — Services 1-2 */}
            <div className="col-span-4">
              <FadeInSection delay={0.2}>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-accent-green mb-8">
                  Brand & Design
                </h3>
              </FadeInSection>
              <div className="space-y-8">
                {services.slice(0, 2).map((service, i) => (
                  <ServiceCard
                    key={service.title}
                    title={service.title}
                    description={service.description}
                    index={i}
                    sunDirRef={sunDirRef}
                  />
                ))}
              </div>
            </div>

            {/* Center — Earth sphere */}
            <div className="col-span-4 flex flex-col items-center pt-4">
              <div>
                <EarthSphere size={420} sunDirRef={sunDirRef} />
              </div>
              <FadeInSection delay={0.3}>
                <CheckOutOurWork />
              </FadeInSection>
            </div>

            {/* Right column — Services 3-4 */}
            <div className="col-span-4">
              <FadeInSection delay={0.2}>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-accent-green mb-8">
                  Web Dev & AI Automation
                </h3>
              </FadeInSection>
              <div className="space-y-8">
                {services.slice(2).map((service, i) => (
                  <ServiceCard
                    key={service.title}
                    title={service.title}
                    description={service.description}
                    index={i + 2}
                    sunDirRef={sunDirRef}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Work ===== */}
      <section id="work" className="py-32 px-6 md:px-10 bg-black">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <span className="text-xs uppercase tracking-[0.3em] text-accent-green font-semibold">
              Our Work
            </span>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <h2 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-20">
              Selected projects
            </h2>
          </FadeInSection>

          <div className="flex flex-col gap-24">
            {projects.map((project, i) => (
              <WorkProject key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
