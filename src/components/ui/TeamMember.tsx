import FadeInSection from './FadeInSection'

interface TeamMemberCardProps {
  name: string
  role: string
  image: string
  index: number
}

export default function TeamMemberCard({ name, role, image, index }: TeamMemberCardProps) {
  return (
    <FadeInSection delay={index * 0.15}>
      <div className="group">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-surface">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h4 className="font-display text-xl font-bold mt-5 text-text">{name}</h4>
        <p className="text-sm text-text-muted mt-1">{role}</p>
      </div>
    </FadeInSection>
  )
}
