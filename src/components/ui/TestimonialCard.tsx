import FadeInSection from './FadeInSection'

interface TestimonialCardProps {
  quote: string
  author: string
  company: string
}

export default function TestimonialCard({ quote, author, company }: TestimonialCardProps) {
  return (
    <FadeInSection>
      <div className="max-w-4xl mx-auto text-center">
        <span className="font-display text-8xl text-surface-light leading-none block mb-4">&ldquo;</span>
        <blockquote className="font-display text-2xl md:text-3xl leading-relaxed font-medium text-text -mt-12">
          {quote}
        </blockquote>
        <div className="mt-8">
          <span className="text-sm font-semibold text-accent-green block">{author}</span>
          <span className="text-sm text-text-muted">{company}</span>
        </div>
      </div>
    </FadeInSection>
  )
}
