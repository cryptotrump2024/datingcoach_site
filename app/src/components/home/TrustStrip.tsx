import { motion } from 'framer-motion'
import { Lock, GraduationCap, MessageSquareText, TrendingUp } from 'lucide-react'

// Honest credibility strip — no fabricated press logos.
const points = [
  { icon: Lock, title: 'Private by design', text: 'Practice sessions are yours alone — nothing is posted or shared.' },
  { icon: GraduationCap, title: 'Skill, not scripts', text: 'We coach you to write your own great messages, not copy ours.' },
  { icon: MessageSquareText, title: 'Feedback on every message', text: 'Subtext, psychology and a concrete fix — after each text you send.' },
  { icon: TrendingUp, title: 'Progress you can see', text: 'Scores, streaks and skill analytics that show you improving.' },
]

export default function TrustStrip() {
  return (
    <section className="relative py-12 md:py-16 border-y border-stone-900/5 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {points.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <p.icon className="w-5 h-5 text-text-rose" aria-hidden="true" />
            </div>
            <div>
              <p className="text-heading-sm text-text-primary">{p.title}</p>
              <p className="text-body-sm text-text-secondary mt-1">{p.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
