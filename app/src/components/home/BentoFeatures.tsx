import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageCircle, Sparkles, ScanSearch, LineChart, ArrowUpRight, Mic, Flame } from 'lucide-react'
import SectionHeading from './SectionHeading'

function Card({
  to,
  className = '',
  children,
  delay = 0,
}: {
  to: string
  className?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      <Link
        to={to}
        className="group glass-card flex flex-col h-full p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
      >
        {children}
      </Link>
    </motion.div>
  )
}

function CardHeader({ icon: Icon, tint, label }: { icon: typeof MessageCircle; tint: string; label: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center border" style={{ background: `${tint}14`, borderColor: `${tint}33` }}>
        <Icon className="w-5 h-5" style={{ color: tint }} aria-hidden="true" />
      </div>
      <span className="inline-flex items-center gap-1 text-caption text-text-muted group-hover:text-text-rose transition-colors">
        {label} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
      </span>
    </div>
  )
}

export default function BentoFeatures() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="The toolkit"
          title="Everything you need to get better at the conversation"
          subtitle="Four tools, one loop: practice, get feedback, fix your profile, watch your skills climb."
        />

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {/* Conversation simulator — large card */}
          <Card to="/create" className="md:col-span-4" delay={0}>
            <CardHeader icon={MessageCircle} tint="#E11D48" label="Start a chat" />
            <h3 className="text-heading-xl text-text-primary font-display">Conversation simulator</h3>
            <p className="text-body text-text-secondary mt-3 max-w-lg">
              Build a persona — personality, vibe, difficulty level 1 to 5 — and practice the
              whole arc: opener, rapport, flirting, asking them out. Personas that play hard to
              get teach you the most.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {['12 personas', '5 difficulty levels', 'Realistic pushback'].map((t) => (
                <span key={t} className="text-caption px-3 py-1.5 rounded-full bg-bg-secondary text-text-secondary border border-stone-900/5">{t}</span>
              ))}
            </div>
          </Card>

          {/* Coaching feedback */}
          <Card to="/create" className="md:col-span-2" delay={0.08}>
            <CardHeader icon={Sparkles} tint="#D97706" label="See it live" />
            <h3 className="text-heading-lg text-text-primary font-display">Message-by-message coaching</h3>
            <p className="text-body-sm text-text-secondary mt-3">
              Every text you send gets decoded: the subtext, the psychology, and exactly how to
              improve it — scored 1–5.
            </p>
          </Card>

          {/* Profile analyzer */}
          <Card to="/profile-analyzer" className="md:col-span-2" delay={0.12}>
            <CardHeader icon={ScanSearch} tint="#7C3AED" label="Analyze yours" />
            <h3 className="text-heading-lg text-text-primary font-display">Profile analyzer</h3>
            <p className="text-body-sm text-text-secondary mt-3">
              Upload your dating profile and get a scored breakdown — photos, bio, prompts — plus
              openers tailored to it.
            </p>
          </Card>

          {/* Progress & gamification */}
          <Card to="/dashboard" className="md:col-span-2" delay={0.16}>
            <CardHeader icon={LineChart} tint="#0D9488" label="Track it" />
            <h3 className="text-heading-lg text-text-primary font-display">Progress analytics</h3>
            <p className="text-body-sm text-text-secondary mt-3">
              Skill radar, score trends and a daily practice streak <Flame className="inline w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> —
              built from your real sessions, not vanity numbers.
            </p>
          </Card>

          {/* Voice mode */}
          <Card to="/create" className="md:col-span-2" delay={0.2}>
            <CardHeader icon={Mic} tint="#2563EB" label="Try voice" />
            <h3 className="text-heading-lg text-text-primary font-display">Voice practice</h3>
            <p className="text-body-sm text-text-secondary mt-3">
              Say it out loud and hear them answer. Because real dates don't happen over text.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
