import type { Project } from '../../data/projects'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-surface">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Info */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-text group-hover:text-accent-green transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-text-muted mt-1">{project.description}</p>
        </div>
        <span className="text-xs text-text-dim font-medium uppercase tracking-wider shrink-0 mt-1">
          {project.category}
        </span>
      </div>
    </div>
  )
}
