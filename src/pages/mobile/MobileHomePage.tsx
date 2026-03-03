import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import FadeInSection from '../../components/ui/FadeInSection'
import DraggableCube from '../../components/ui/DraggableCube'
import { services } from '../../data/services'

export default function MobileHomePage() {
  const [scrollRotation, setScrollRotation] = useState(0)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      const scrollDelta = currentScroll - lastScrollRef.current
      lastScrollRef.current = currentScroll

      // Scroll down = negative rotation (left), scroll up = positive (right)
      setScrollRotation(prev => prev - scrollDelta * 0.5)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* ===== HERO: With gold cube ===== */}
      <section className="relative min-h-[75vh] overflow-hidden bg-black">
        <div className="portfolio-grain" aria-hidden="true" />

        {/* Gold 3D cube */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ bottom: '45%' }}>
          <DraggableCube size={150} scrollRotY={scrollRotation} />
        </div>

        {/* Headline text */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-24 h-full flex flex-col items-center justify-end">
          <div className="w-full text-center">
            {/* BUILT at top */}
            <div className="justify-center mb-1 leading-[0.85]">
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="block font-display text-[10vw] font-extrabold text-white tracking-[-0.02em]"
                >
                  BUILT
                </motion.span>
              </div>
            </div>

            {/* TO BE NOTICED below cube */}
            <div className="flex flex-col items-center gap-1 leading-[0.85] mt-1">
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block font-display text-[10vw] font-extrabold text-white tracking-[-0.02em]"
                >
                  TO BE
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block font-display text-[10vw] font-extrabold text-white tracking-[-0.02em]"
                >
                  NOTICED
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES: Compact grid ===== */}
      <section className="py-12 px-6 bg-bg">
        <FadeInSection>
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            What We Do
          </h2>
        </FadeInSection>

        <div className="max-w-md mx-auto space-y-6">
          {services.map((service, i) => (
            <FadeInSection key={service.title} delay={i * 0.05}>
              <div className="bg-surface rounded-lg p-6 border border-white/5 hover:border-accent-green/30 transition-colors">
                <h3 className="font-display text-xl font-bold text-accent-green mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 px-6 bg-black text-center">
        <FadeInSection>
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to stand out?
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">
            Let&apos;s create something remarkable.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <Link
            to="/contact"
            className="inline-block bg-accent-green text-black font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
          >
            Start a Project
          </Link>
        </FadeInSection>
      </section>
    </>
  )
}
