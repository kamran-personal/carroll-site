export interface Project {
  id: string
  title: string
  category: string
  categorySlug: string
  description: string
  image: string
  year: string
}

export const projects: Project[] = [
  {
    id: 'ember-table',
    title: 'The Ember Table',
    category: 'Restaurant',
    categorySlug: 'restaurants',
    description: 'A refined digital presence for an upscale dining experience, featuring online reservations and a seasonal menu showcase.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=900&fit=crop',
    year: '2025',
  },
  {
    id: 'maison-noir',
    title: 'Maison Noir',
    category: 'Retail',
    categorySlug: 'retail',
    description: 'An elegant e-commerce platform for a contemporary fashion boutique, blending editorial aesthetics with seamless shopping.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=900&fit=crop',
    year: '2025',
  },
  {
    id: 'strand-studio',
    title: 'Strand Studio',
    category: 'Wellness',
    categorySlug: 'wellness',
    description: 'A sleek booking-first website for a premium hair salon, designed to reflect their artistry and attention to detail.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=900&fit=crop',
    year: '2024',
  },
  {
    id: 'forge-athletics',
    title: 'Forge Athletics',
    category: 'Fitness',
    categorySlug: 'fitness',
    description: 'A bold, high-energy website for a boutique fitness studio, with class scheduling and membership management.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=900&fit=crop',
    year: '2024',
  },
  {
    id: 'ritual-coffee',
    title: 'Ritual Coffee',
    category: 'Restaurant',
    categorySlug: 'restaurants',
    description: 'A warm, inviting web presence for a specialty coffee roaster, featuring their story, sourcing philosophy, and online shop.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=900&fit=crop',
    year: '2024',
  },
  {
    id: 'crumb-craft',
    title: 'Crumb & Craft',
    category: 'Restaurant',
    categorySlug: 'restaurants',
    description: 'A charming digital storefront for an artisan bakery, showcasing daily selections with mouth-watering photography.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=900&fit=crop',
    year: '2023',
  },
  {
    id: 'sage-wellness',
    title: 'Sage Wellness',
    category: 'Wellness',
    categorySlug: 'wellness',
    description: 'A serene, calming website for a holistic wellness center, with integrated booking and practitioner profiles.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=900&fit=crop',
    year: '2023',
  },
  {
    id: 'lumen-photography',
    title: 'Lumen Photography',
    category: 'Creative',
    categorySlug: 'creative',
    description: 'A minimal, image-forward portfolio for a commercial photographer, letting the work speak entirely for itself.',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&h=900&fit=crop',
    year: '2023',
  },
]

export const categories = ['All', 'Restaurants', 'Retail', 'Wellness', 'Fitness', 'Creative']
