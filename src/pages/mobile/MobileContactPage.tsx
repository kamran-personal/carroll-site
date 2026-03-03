import FadeInSection from '../../components/ui/FadeInSection'
import ContactForm from '../../components/ui/ContactForm'

export default function MobileContactPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-6">
        <FadeInSection>
          <span className="text-xs uppercase tracking-[0.3em] text-accent-green font-semibold block mb-4">
            Contact
          </span>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <h1 className="font-display text-3xl font-bold leading-[1.05] text-white">
            Let's build something remarkable.
          </h1>
        </FadeInSection>
      </section>

      {/* Form + Info */}
      <section className="px-6 pb-16">
        {/* Form */}
        <FadeInSection delay={0.2}>
          <div className="mb-12">
            <ContactForm />
          </div>
        </FadeInSection>

        {/* Info */}
        <FadeInSection delay={0.25}>
          <div>
            <h3 className="font-display text-xl font-bold mb-6 text-white">Get in Touch</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-1">
                  Email
                </h4>
                <a
                  href="mailto:ripley@cohesium.co"
                  className="text-text hover:text-accent-green transition-colors duration-300 text-sm"
                >
                  ripley@cohesium.co
                </a>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-1">
                  Phone
                </h4>
                <span className="text-text text-sm">202-805-4287</span>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-1">
                  Location
                </h4>
                <span className="text-text text-sm">Richmond, VA</span>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>
    </>
  )
}
