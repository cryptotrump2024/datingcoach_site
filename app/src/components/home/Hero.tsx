import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react'
import PersonaAvatar from '@/components/PersonaAvatar'

// Scripted demo conversation that auto-plays in the hero. Sells the core loop:
// you text → she replies → the coach explains what just happened.
const demoScript = [
  { type: 'user' as const, text: "Two truths and a lie: I make great pasta, I've never seen Titanic, I once won a salsa contest" },
  { type: 'persona' as const, text: 'Okay the salsa contest one better be TRUE because I need details 😂' },
  { type: 'coach' as const, text: 'Playful opener with a hook — she picked the thread you wanted. 5/5', score: 5 },
  { type: 'user' as const, text: 'Haha it is. Third place, but the trophy says champion energy' },
  { type: 'persona' as const, text: "Champion energy with a third place trophy is exactly my kind of confidence. What's the lie then?" },
  { type: 'coach' as const, text: 'Self-deprecating + confident. She invested with a question — momentum is yours.', score: 5 },
]

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1" aria-label="typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-stone-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  )
}

function ChatDemo() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [typing, setTyping] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(() => { if (!cancelled) fn() }, ms)
      timers.push(t)
    }

    const step = (i: number) => {
      if (i >= demoScript.length) {
        schedule(() => { setVisibleCount(0); step(0) }, 5200)
        return
      }
      const isPersona = demoScript[i].type === 'persona'
      if (isPersona) setTyping(true)
      schedule(() => {
        setTyping(false)
        setVisibleCount(i + 1)
        step(i + 1)
      }, isPersona ? 1500 : 1100)
    }
    step(0)
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [])

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
  }, [visibleCount, typing])

  return (
    <div className="glass-card-elevated w-full max-w-md mx-auto overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-900/10 bg-white/60">
        <PersonaAvatar name="Luna" color="#DB2777" className="w-10 h-10 rounded-full" textClassName="text-lg" />
        <div className="flex-1 min-w-0">
          <p className="text-heading-sm text-text-primary">Luna, 22</p>
          <p className="text-caption text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Practice persona
          </p>
        </div>
        <span className="text-caption px-2.5 py-1 rounded-full bg-rose-50 text-text-rose border border-rose-100">
          Beginner
        </span>
      </div>

      {/* Messages */}
      <div ref={containerRef} className="h-[320px] sm:h-[360px] overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {demoScript.slice(0, visibleCount).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {m.type === 'coach' ? (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-caption uppercase tracking-wider text-amber-700 mb-0.5">Coach feedback</p>
                    <p className="text-body-sm text-stone-700">{m.text}</p>
                  </div>
                </div>
              ) : (
                <div className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-body-sm leading-relaxed ${
                      m.type === 'user'
                        ? 'btn-gradient text-white rounded-2xl rounded-br-md'
                        : 'bg-bg-secondary text-text-primary rounded-2xl rounded-bl-md border border-stone-900/5'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex justify-start">
            <div className="bg-bg-secondary rounded-2xl rounded-bl-md border border-stone-900/5 px-4 py-3">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      {/* Faux input → routes to the builder */}
      <Link
        to="/create"
        className="flex items-center gap-3 mx-4 mb-4 px-4 py-3 rounded-full border border-stone-900/10 bg-white text-text-muted text-body-sm hover:border-rose-300 hover:text-text-secondary transition-colors"
      >
        Try it yourself — type your opener…
        <ArrowRight className="w-4 h-4 ml-auto text-text-rose" aria-hidden="true" />
      </Link>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-[120px] md:pt-[150px] pb-16 md:pb-24">
      {/* Warm ambient background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-rose-200/40 blur-[120px]" />
        <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full bg-amber-100/60 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-200 bg-rose-50/80 text-text-rose text-caption mb-6"
          >
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Private practice. Real-life confidence.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-display-hero text-text-primary text-balance"
          >
            Practice makes <span className="gradient-text-rose italic">confident</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-body-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mt-6"
          >
            Rehearse dating conversations with lifelike personas, get coaching on every message,
            and walk into real conversations already knowing what works. No scripts to copy —
            skills you keep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-9"
          >
            <Link
              to="/create"
              className="btn-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-heading-sm font-semibold"
            >
              Start practicing free
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/scenarios"
              className="inline-flex items-center gap-2 rounded-full border border-stone-900/15 bg-white/70 px-8 py-4 text-heading-sm font-medium text-text-primary hover:border-rose-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-text-rose" aria-hidden="true" />
              Browse scenarios
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-body-sm text-text-muted mt-6"
          >
            Free to start · No credit card · Your practice stays private
          </motion.p>
        </div>

        {/* Live demo */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ChatDemo />
        </motion.div>
      </div>
    </section>
  )
}
