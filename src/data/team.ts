export interface TeamMember {
  name: string
  role: string
  image: string
  bio: string
}

export const team: TeamMember[] = [
  {
    name: 'Sarah Chen',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop',
    bio: 'With over a decade in brand and digital design, Sarah leads creative vision and ensures every project tells a compelling story.',
  },
  {
    name: 'Marcus Rivera',
    role: 'Lead Designer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    bio: 'Marcus brings an obsessive attention to detail and a deep love for typography, transforming concepts into pixel-perfect reality.',
  },
  {
    name: 'Ava Lindström',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop',
    bio: 'Ava architects performant, accessible front-ends that bring designs to life with clean code and smooth interactions.',
  },
]
