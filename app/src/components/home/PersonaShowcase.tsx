import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useStore } from '@/store'
import { showcasePersonas, type ShowcasePersona } from '@/lib/personas'
import PersonaAvatar from '@/components/PersonaAvatar'
import SectionHeading from './SectionHeading'

const difficultyTint: Record<string, string> = {
  Beginner: '#059669',
  Intermediate: '#CA8A04',
  Advanced: '#EA580C',
  Expert: '#DC2626',
  Master: '#7C3AED',
}

function PersonaCard({ persona, onSelect }: { persona: ShowcasePersona; onSelect: (p: ShowcasePersona) => void }) {
  return (
    <button
      onClick={() => onSelect(persona)}
      className="group glass-card snap-start shrink-0 w-[240px] sm:w-[260px] text-left overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated focus-visible:ring-2 focus-visible:ring-rose-400"
      aria-label={`Practice with ${persona.name}, ${persona.archetype}, ${persona.difficulty}`}
    >
      <PersonaAvatar name={persona.name} color={persona.color} className="w-full aspect-[4/3]" textClassName="text-6xl" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-heading-md text-text-primary font-display">{persona.name}, {persona.age}</p>
          <span
            className="text-caption px-2 py-0.5 rounded-full border shrink-0"
            style={{ color: difficultyTint[persona.difficulty], borderColor: `${difficultyTint[persona.difficulty]}55`, background: `${difficultyTint[persona.difficulty]}0F` }}
          >
            {persona.difficulty}
          </span>
        </div>
        <p className="text-body-sm text-text-rose mt-1">{persona.archetype}</p>
        <p className="text-body-sm text-text-secondary mt-2 line-clamp-2">{persona.bio}</p>
        <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-primary mt-4 group-hover:text-text-rose transition-colors">
          Start practicing <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </button>
  )
}

export default function PersonaShowcase() {
  const navigate = useNavigate()
  const setPersonaConfig = useStore((s) => s.setPersonaConfig)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSelect = (p: ShowcasePersona) => {
    setPersonaConfig({
      name: p.name, age: p.age, ethnicity: p.ethnicity, hairColor: p.hairColor,
      hairLength: p.hairLength, eyeColor: p.eyeColor, bodyType: p.bodyType, height: p.height,
      style: p.style, glasses: p.glasses, tattoos: p.tattoos, piercings: p.piercings,
      archetype: p.archetype, bio: p.bio, difficulty: p.difficulty, scenario: p.scenario, image: p.image,
    })
    navigate('/create')
  }

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * (scrollRef.current.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading
            align="left"
            eyebrow="Practice partners"
            title="Twelve personalities. Five difficulty levels."
            subtitle="From warm and encouraging to expert-level hard-to-get. Master one, then raise the stakes."
          />
          <div className="hidden md:flex gap-2 mb-16">
            <button onClick={() => scroll(-1)} aria-label="Scroll personas left" className="w-11 h-11 rounded-full border border-stone-900/15 bg-white flex items-center justify-center text-text-secondary hover:text-text-rose hover:border-rose-300 transition-colors">
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button onClick={() => scroll(1)} aria-label="Scroll personas right" className="w-11 h-11 rounded-full border border-stone-900/15 bg-white flex items-center justify-center text-text-secondary hover:text-text-rose hover:border-rose-300 transition-colors">
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6 }}
      >
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-6 lg:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pb-2"
        >
          {showcasePersonas.map((p) => (
            <PersonaCard key={p.name} persona={p} onSelect={handleSelect} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
