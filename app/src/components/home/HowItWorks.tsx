import { motion } from 'framer-motion'
import { UserRound, MessagesSquare, Trophy } from 'lucide-react'
import SectionHeading from './SectionHeading'

const steps = [
  {
    icon: UserRound,
    title: 'Build your practice partner',
    text: 'Pick a persona or design your own — personality sliders, conversational style, and a difficulty level from encouraging to brutally realistic.',
  },
  {
    icon: MessagesSquare,
    title: 'Have the conversation',
    text: 'Text (or talk) through the full arc — opener to date ask. The coach decodes every message: what it signaled, how it landed, what would land better.',
  },
  {
    icon: Trophy,
    title: 'Review, level up, repeat',
    text: 'Get a session score, earn XP, keep your streak alive, and watch your weakest skills become your strongest in the analytics.',
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-20 md:py-28 bg-bg-secondary border-y border-stone-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to better conversations"
          subtitle="The same way you'd train anything that matters: reps, feedback, progression."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="glass-card p-7 md:p-8 relative"
            >
              <span className="absolute top-6 right-7 font-display text-5xl text-stone-900/5 select-none" aria-hidden="true">
                {i + 1}
              </span>
              <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center mb-6">
                <s.icon className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-heading-lg text-text-primary font-display">{s.title}</h3>
              <p className="text-body text-text-secondary mt-3">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
