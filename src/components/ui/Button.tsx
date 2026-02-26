import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline'
  to?: string
  className?: string
}

export default function Button({ children, variant = 'primary', to, className = '' }: ButtonProps) {
  const base = 'inline-block text-sm font-semibold px-8 py-4 rounded-full transition-colors duration-300'
  const variants = {
    primary: 'bg-accent-green text-bg hover:bg-accent-beige',
    outline: 'border border-text/30 text-text hover:border-accent-green hover:text-accent-green',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
        <Link to={to} className={classes}>
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={classes}
      type="submit"
    >
      {children}
    </motion.button>
  )
}
