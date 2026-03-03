import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../../data/projects'

export default function MobilePortfolioPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="portfolio-grain" aria-hidden="true" />

      {/* Header */}
      <div className="bg-black py-12 px-6 text-center pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl font-bold text-white"
        >
          Our Work
        </motion.h1>
      </div>

      {/* Projects Grid */}
      <div className="px-4 py-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group bg-surface rounded-lg overflow-hidden border border-white/5 hover:border-accent-green/30 transition-colors"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden bg-black aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-text-muted mb-4 leading-relaxed">
                  {project.description || 'A showcase of our design and development work.'}
                </p>

                <Link
                  to={`/portfolio/${project.id}`}
                  className="inline-block bg-accent-green text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
                >
                  View Project →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Confidentiality notice banner */}
      <div className="px-4 py-8 max-w-2xl mx-auto flex justify-end">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 w-full sm:w-auto">
          <p className="text-sm text-white/70 text-center sm:text-right">
            <span className="text-accent-green font-semibold">Note:</span> Client names, logos, and personal details have been modified to protect confidentiality.
          </p>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-accent-green py-12 px-6 text-center mt-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold text-black mb-4"
        >
          Like what you see?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-sm text-black mb-6"
        >
          Let&apos;s create something remarkable for your business.
        </motion.p>
        <Link
          to="/contact"
          className="inline-block bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
        >
          Contact Us
        </Link>
      </section>
    </div>
  )
}
