import { motion } from 'framer-motion'

interface ImageRevealProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: string
}

export default function ImageReveal({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]',
}: ImageRevealProps) {
  return (
    <motion.div
      className={`overflow-hidden rounded-lg ${aspectRatio} ${className}`}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </motion.div>
  )
}
