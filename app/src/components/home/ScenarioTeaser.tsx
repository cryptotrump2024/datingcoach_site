import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, HeartPulse, CalendarHeart, ShieldQuestion, ArrowRight } from 'lucide-react'
import SectionHeading from './SectionHeading'

const categories = [
  { icon: Zap, tint: '#E11D48', title: 'First Impressions', text: 'Cold opens, profile-based openers, and what to do when they message first.' },
  { icon: HeartPulse, tint: '#D97706', title: 'Keeping It Alive', text: 'Revive a dead chat, escape interview mode, turn one-word replies around.' },
  { icon: CalendarHeart, tint: '#0D9488', title: 'Making the Move', text: 'Ask for the date, get the number, and actually plan something good.' },
  { icon: ShieldQuestion, tint: '#7C3AED', title: 'Handling Curveballs', text: 'Pass the tests, handle a flake gracefully, recover when you misstep.' },
]

export default function ScenarioTeaser() {
  return (
    <section className="relative py-20 md:py-28 bg-bg-secondary border-y border-stone-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Guided drills"
          title="Train the moments that decide everything"
          subtitle="Twelve guided scenarios with clear goals and pass criteria — like a workout plan for your social skills."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to="/scenarios" className="group glass-card flex flex-col h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center border mb-5" style={{ background: `${c.tint}12`, borderColor: `${c.tint}30` }}>
                  <c.icon className="w-5 h-5" style={{ color: c.tint }} aria-hidden="true" />
                </div>
                <h3 className="text-heading-md text-text-primary font-display">{c.title}</h3>
                <p className="text-body-sm text-text-secondary mt-2 flex-1">{c.text}</p>
                <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-rose mt-5">
                  View drills <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
