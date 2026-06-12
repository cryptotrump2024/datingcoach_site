import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[28px] px-6 py-16 md:py-20 text-center"
          style={{ background: 'linear-gradient(135deg, #1C1917 0%, #44403C 100%)' }}
        >
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-500/20 blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/15 blur-[100px]" />
          </div>
          <div className="relative">
            <h2 className="text-display-subsection md:text-display-section text-white text-balance">
              Your next conversation could go differently
            </h2>
            <p className="text-body-lg text-stone-300 max-w-xl mx-auto mt-5">
              Every expert was once a beginner. Your first practice conversation is free —
              no credit card, no judgment, just reps.
            </p>
            <Link
              to="/create"
              className="btn-gradient inline-flex items-center gap-2 rounded-full px-9 py-4 text-heading-sm font-semibold mt-9"
            >
              Start practicing free
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
