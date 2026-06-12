import { motion } from 'framer-motion'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-2xl mb-12 md:mb-16 ${alignCls}`}>
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.5 }}
        className="inline-block text-caption uppercase tracking-[0.18em] text-text-rose mb-4"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="text-display-subsection md:text-display-section text-text-primary text-balance"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-body-lg text-text-secondary mt-5"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
