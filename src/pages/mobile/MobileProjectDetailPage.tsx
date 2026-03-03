import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../../data/projects'
import FadeInSection from '../../components/ui/FadeInSection'

export default function MobileProjectDetailPage() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-white/50 text-center">Project not found.</p>
        <Link
          to="/portfolio"
          className="text-sm uppercase tracking-[0.2em] text-white border-b border-white/40 hover:border-accent-green hover:text-accent-green transition-colors duration-300"
        >
          ← Back to Work
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <div className="px-6 py-12">
        <FadeInSection>
          <p className="text-white/35 text-[11px] tracking-[0.3em] uppercase mb-4">
            {project.category}&nbsp;&nbsp;·&nbsp;&nbsp;{project.year}
          </p>
          <h1 className="font-display text-3xl font-bold mb-4 text-white">
            {project.title}
          </h1>
          <p className="text-white/65 text-sm leading-relaxed mb-6">
            {project.description}
          </p>
          <Link
            to="/portfolio"
            className="inline-block text-xs uppercase tracking-[0.2em] text-white border-b border-white/40 hover:border-accent-green hover:text-accent-green transition-colors duration-300"
          >
            ← Back to Work
          </Link>
        </FadeInSection>
      </div>

      {/* Project Image */}
      <div className="px-6 mb-12">
        <FadeInSection delay={0.1}>
          <div className="rounded-lg overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </FadeInSection>
      </div>

      {/* Client Description */}
      {project.clientDescription && (
        <div className="px-6 py-8 border-t border-white/10">
          <FadeInSection delay={0.15}>
            <h2 className="font-display text-xl font-bold mb-4 text-white">
              About the Client
            </h2>
            <p className="text-white/65 text-sm leading-relaxed">
              {project.clientDescription}
            </p>
          </FadeInSection>
        </div>
      )}

      {/* Challenges */}
      {project.challenges && project.challenges.length > 0 && (
        <div className="px-6 py-8 border-t border-white/10">
          <FadeInSection delay={0.2}>
            <h2 className="font-display text-xl font-bold mb-6 text-white">
              The Challenges
            </h2>
            <div className="space-y-4">
              {project.challenges.map((challenge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="p-4 border-l-4 border-accent-green bg-white/2 rounded text-sm text-white/65 leading-relaxed"
                >
                  {challenge}
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        </div>
      )}

      {/* Insights */}
      {project.insights && project.insights.length > 0 && (
        <div className="px-6 py-8 border-t border-white/10">
          <FadeInSection delay={0.25}>
            <h2 className="font-display text-xl font-bold mb-6 text-white">
              Our Insights
            </h2>
            <div className="space-y-4">
              {project.insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex gap-3 p-4 border border-white/10 rounded hover:border-accent-green/30 transition-colors text-sm"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center">
                      <span className="text-accent-green font-bold text-xs">{i + 1}</span>
                    </div>
                  </div>
                  <p className="text-white/65 leading-relaxed pt-0.5">{insight}</p>
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="px-6 py-12 text-center border-t border-white/10">
        <FadeInSection>
          <p className="text-white/65 text-sm mb-4">
            Interested in a project like this?
          </p>
          <Link
            to="/contact"
            className="inline-block bg-accent-green text-black font-bold px-6 py-2 rounded-full hover:bg-opacity-90 transition-all text-sm"
          >
            Let's Talk
          </Link>
        </FadeInSection>
      </div>
    </div>
  )
}
