import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Star, Target } from 'lucide-react'
import { useStore } from '@/store'
import {
  SCENARIO_CATEGORIES,
  personaForScenario,
  scenarios,
  type Scenario,
  type ScenarioCategory,
} from '@/lib/scenarios'
import { generateId } from '@/lib/conversation-engine'
import PersonaAvatar from '@/components/PersonaAvatar'
import { showcasePersonas } from '@/lib/personas'

const difficultyTint: Record<string, string> = {
  Beginner: '#059669',
  Intermediate: '#CA8A04',
  Advanced: '#EA580C',
  Expert: '#DC2626',
  Master: '#7C3AED',
}

function ScenarioCard({
  scenario,
  completed,
  bestScore,
  onStart,
  delay,
}: {
  scenario: Scenario
  completed: boolean
  bestScore?: number
  onStart: (s: Scenario) => void
  delay: number
}) {
  const persona = showcasePersonas.find((p) => p.name === scenario.personaName)
  const tint = SCENARIO_CATEGORIES.find((c) => c.name === scenario.category)?.tint ?? '#E11D48'
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.45, delay }}
      onClick={() => onStart(scenario)}
      className="group glass-card relative flex flex-col p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated focus-visible:ring-2 focus-visible:ring-rose-400"
      aria-label={`Start drill: ${scenario.title}`}
    >
      {completed && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-caption text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          {bestScore ? `Best ${bestScore.toFixed(1)}` : 'Done'}
        </span>
      )}
      <div className="flex items-center gap-3 mb-4">
        {persona && (
          <PersonaAvatar
            name={persona.name}
            color={persona.color}
            className="w-11 h-11 rounded-full"
            textClassName="text-lg"
          />
        )}
        <div className="min-w-0">
          <p className="text-caption uppercase tracking-wider" style={{ color: tint }}>
            {scenario.category}
          </p>
          <h3 className="text-heading-md text-text-primary font-display truncate">
            {scenario.title}
          </h3>
        </div>
      </div>
      <p className="text-body-sm text-text-secondary flex-1">{scenario.brief}</p>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-900/5">
        <div className="flex items-center gap-2">
          <span
            className="text-caption px-2 py-0.5 rounded-full border"
            style={{
              color: difficultyTint[scenario.difficulty],
              borderColor: `${difficultyTint[scenario.difficulty]}55`,
              background: `${difficultyTint[scenario.difficulty]}0F`,
            }}
          >
            {scenario.difficulty}
          </span>
          <span className="text-caption text-text-muted inline-flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500" aria-hidden="true" />+{scenario.xpBonus} XP
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-body-sm font-medium text-text-rose">
          Start <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </motion.button>
  )
}

export default function Scenarios() {
  const navigate = useNavigate()
  const { setSelectedPersona, setCurrentConversation, progress } = useStore()
  const [activeCategory, setActiveCategory] = useState<ScenarioCategory | 'All'>('All')

  const visible = useMemo(
    () => scenarios.filter((s) => activeCategory === 'All' || s.category === activeCategory),
    [activeCategory]
  )

  const completedCount = scenarios.filter((s) => progress.drills[s.slug]).length

  const startScenario = (scenario: Scenario) => {
    const persona = personaForScenario(scenario)
    setSelectedPersona(persona)
    setCurrentConversation({
      id: generateId(),
      personaId: persona.id,
      personaName: persona.name,
      personaArchetype: persona.archetype,
      messages: [],
      analyses: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      phase: 0,
      phaseName: 'Opener',
      isActive: true,
      scenarioSlug: scenario.slug,
      scenarioBrief: scenario.brief,
    })
    navigate('/chat')
  }

  return (
    <div className="min-h-[100dvh] bg-bg-primary">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 md:pt-20 pb-20">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-caption uppercase tracking-[0.18em] text-text-rose mb-4"
          >
            <Target className="w-4 h-4" aria-hidden="true" />
            Guided drills
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="text-display-subsection md:text-display-section text-text-primary"
          >
            Train the moments that decide everything
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-body-lg text-text-secondary mt-4"
          >
            Twelve scenarios with clear goals and pass criteria. Each drill drops you into a
            specific situation — pass it by keeping your average message score above the bar.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-body-sm text-text-muted mt-3"
          >
            {completedCount} of {scenarios.length} completed
          </motion.p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Scenario categories">
          {(['All', ...SCENARIO_CATEGORIES.map((c) => c.name)] as const).map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-body-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? 'btn-gradient text-white border-transparent'
                  : 'border-stone-900/10 bg-white/70 text-text-secondary hover:text-text-primary hover:border-rose-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((s, i) => (
            <ScenarioCard
              key={s.slug}
              scenario={s}
              completed={Boolean(progress.drills[s.slug])}
              bestScore={progress.drills[s.slug]?.bestScore}
              onStart={startScenario}
              delay={(i % 3) * 0.07}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
