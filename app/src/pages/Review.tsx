import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  MessageCircle,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Flame,
  Star,
  AlertTriangle,
  RefreshCw,
  Heart,
  Users,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CategoryScore {
  name: string
  icon: React.ReactNode
  score: number
  maxScore: number
  color: string
  glowColor: string
  label: string
  feedback: string
}

interface TimelineMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  score: number
  insight: string
  timestamp: string
}

interface InsightCard {
  title: string
  icon: React.ReactNode
  color: string
  content: string
}

interface RoadmapStep {
  number: number
  title: string
  description: string
  actions: string[]
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const CONVERSATION_DATA = {
  id: 'conv-001',
  personaName: 'Sophia',
  personaAvatar: '/persona-sophia.jpg',
  difficulty: 'Intermediate' as const,
  date: 'Oct 28, 2024',
  duration: '12m',
  messageCount: 24,
  overallScore: 78,
  grade: 'B' as const,
  gradeLabel: 'GREAT JOB',
  descriptor:
    'You showed solid emotional intelligence and built good rapport. A few adjustments could take you to the next level.',
  vsAverage: '+23%',
  goalProgress: 'Stage 3',
}

const CATEGORY_SCORES: CategoryScore[] = [
  {
    name: 'Opening',
    icon: <MessageCircle className="w-8 h-8" />,
    score: 17,
    maxScore: 20,
    color: '#E11D48',
    glowColor: 'rgba(225,29,72,0.25)',
    label: 'Excellent',
    feedback: 'Your opener was strong and contextually relevant.',
  },
  {
    name: 'Engagement',
    icon: <TrendingUp className="w-8 h-8" />,
    score: 14,
    maxScore: 20,
    color: '#D97706',
    glowColor: 'rgba(245,158,11,0.25)',
    label: 'Good',
    feedback: 'Good flow, but some lulls in the middle.',
  },
  {
    name: 'Emotional Intelligence',
    icon: <Brain className="w-8 h-8" />,
    score: 14,
    maxScore: 20,
    color: '#7C3AED',
    glowColor: 'rgba(139,92,246,0.25)',
    label: 'Good',
    feedback: 'Missed some subtext cues. Work on reading between the lines.',
  },
  {
    name: 'Attraction Building',
    icon: <Flame className="w-8 h-8" />,
    score: 16,
    maxScore: 20,
    color: '#F43F5E',
    glowColor: 'rgba(244,63,94,0.25)',
    label: 'Great',
    feedback: 'Great use of playful tension and confidence.',
  },
  {
    name: 'Goal Progress',
    icon: <Target className="w-8 h-8" />,
    score: 15,
    maxScore: 20,
    color: '#0D9488',
    glowColor: 'rgba(20,184,166,0.25)',
    label: 'Good',
    feedback: 'Solid progress toward the conversation objective.',
  },
]

const TIMELINE_MESSAGES: TimelineMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'Hey! I noticed you\'re into hiking. Any favorite trails around here?',
    score: 85,
    insight: 'Strong opener. Contextually relevant and opens a thread.',
    timestamp: '0:00',
  },
  {
    id: 'm2',
    role: 'assistant',
    content: 'Oh hi! Yeah, I love getting outdoors on weekends. Crystal Cove has some amazing coastal views.',
    score: 0,
    insight: '',
    timestamp: '0:15',
  },
  {
    id: 'm3',
    role: 'user',
    content: 'Crystal Cove is beautiful! I went there last month and the sunset from the bluff was unreal.',
    score: 78,
    insight: 'Good follow-up sharing personal experience.',
    timestamp: '0:42',
  },
  {
    id: 'm4',
    role: 'assistant',
    content: 'That sounds amazing! I\'ve only done the morning hikes there. Did you go alone or with friends?',
    score: 0,
    insight: '',
    timestamp: '1:05',
  },
  {
    id: 'm5',
    role: 'user',
    content: 'With a couple friends. We made a day of it. Hiked, then grabbed tacos after. You should join next time!',
    score: 92,
    insight: 'Excellent. Natural invitation without pressure.',
    timestamp: '1:30',
  },
  {
    id: 'm6',
    role: 'assistant',
    content: 'Oh wow, that sounds fun! I\'d love that. When are you planning to go again?',
    score: 0,
    insight: '',
    timestamp: '1:55',
  },
  {
    id: 'm7',
    role: 'user',
    content: 'Probably in a couple weeks. I\'ll check the weather and let you know. What\'s your number?',
    score: 88,
    insight: 'Smooth transition to close. Reading signals well.',
    timestamp: '2:20',
  },
  {
    id: 'm8',
    role: 'assistant',
    content: 'Sure! It\'s 555-0142. Text me when you\'re planning to go!',
    score: 0,
    insight: '',
    timestamp: '2:35',
  },
]

const PSYCHOLOGY_INSIGHTS: InsightCard[] = [
  {
    title: 'Reciprocity Principle',
    icon: <RefreshCw className="w-10 h-10" />,
    color: '#0D9488',
    content:
      'You maintained good give-and-take. Your investment roughly matched hers, which kept the dynamic balanced. When you invested slightly less, she increased her effort. A positive sign.',
  },
  {
    title: 'Attachment Signals',
    icon: <Heart className="w-10 h-10" />,
    color: '#E11D48',
    content:
      'Her responses showed a mix of anxious and secure attachment cues. She tested your reliability twice and responded well to your consistency. This suggests potential for deeper connection.',
  },
  {
    title: 'Social Proof Dynamics',
    icon: <Users className="w-10 h-10" />,
    color: '#D97706',
    content:
      'You effectively used subtle pre-selection signals without overdoing it. Mentioning social activities created a sense of an active, interesting lifestyle without bragging.',
  },
  {
    title: 'Emotional Escalation',
    icon: <TrendingUp className="w-10 h-10" />,
    color: '#7C3AED',
    content:
      'The conversation followed a healthy emotional escalation curve. You moved from light banter to personal topics at a natural pace. The peak emotional moment came around message 5. Ideal timing for the number close.',
  },
]

const ROADMAP_STEPS: RoadmapStep[] = [
  {
    number: 1,
    title: 'Sharpen Your Subtext Reading',
    description:
      'You missed 3 subtext opportunities where she was signaling interest more strongly than her words suggested.',
    actions: [
      "Study the 'Reading Between the Lines' guide",
      "Practice with a 'Guarded' personality",
      'Focus on response-length analysis',
    ],
  },
  {
    number: 2,
    title: 'Master the Transition Points',
    description:
      'Your transitions between conversation stages were slightly abrupt. Smoother pivots create more natural escalation.',
    actions: [
      "Learn the 'Bridge Technique'",
      'Practice stage transitions in simulation',
      'Study example conversations',
    ],
  },
  {
    number: 3,
    title: 'Build More Emotional Hooks',
    description:
      'Your messages were logically sound but could use more emotional hooks that create memorable moments.',
    actions: [
      'Learn storytelling techniques',
      'Practice vulnerability calibration',
      'Study emotional trigger words',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'S':
      return '#0D9488'
    case 'A':
      return '#16A34A'
    case 'B':
      return '#CA8A04'
    case 'C':
      return '#EA580C'
    case 'D':
      return '#EF4444'
    case 'F':
      return '#991B1B'
    default:
      return '#CA8A04'
  }
}

function getScoreColor(score: number): string {
  if (score >= 18) return '#0891B2'
  if (score >= 15) return '#16A34A'
  if (score >= 12) return '#CA8A04'
  if (score >= 8) return '#EA580C'
  return '#DC2626'
}

function getStarCount(score: number): number {
  return Math.max(1, Math.min(5, Math.round((score / 20) * 5)))
}

function getDifficultyColor(d: string): string {
  switch (d) {
    case 'Beginner':
      return '#059669'
    case 'Intermediate':
      return '#D97706'
    case 'Advanced':
      return '#F97316'
    case 'Expert':
      return '#EF4444'
    case 'Master':
      return '#7C3AED'
    default:
      return '#D97706'
  }
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function AnimatedScore({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration])

  return <span ref={ref}>{display}</span>
}

function ScoreRing({
  score,
  size = 200,
  strokeWidth = 12,
}: {
  score: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const ref = useRef<SVGCircleElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    if (!isInView) return
    const target = circumference - (score / 100) * circumference
    const timer = setTimeout(() => setOffset(target), 200)
    return () => clearTimeout(timer)
  }, [isInView, score, circumference])

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(28, 25, 23, 0.08)"
        strokeWidth={strokeWidth}
      />
      <defs>
        <linearGradient id="scoreRingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <circle
        ref={ref}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#scoreRingGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </svg>
  )
}

function StarRating({ score, size = 20 }: { score: number; size?: number }) {
  const count = getStarCount(score)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.4 + i * 0.08,
            duration: 0.3,
            ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
          }}
        >
          <Star
            className={i <= count ? 'text-[#F59E0B]' : 'text-text-primary'}
            style={{ width: size, height: size, fill: i <= count ? '#D97706' : 'transparent' }}
          />
        </motion.div>
      ))}
    </div>
  )
}

function ScoreBar({
  score,
  maxScore,
  color,
  delay = 0,
}: {
  score: number
  maxScore: number
  color: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const pct = (score / maxScore) * 100

  return (
    <div ref={ref} className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: isInView ? `${pct}%` : 0 }}
        transition={{
          duration: 0.8,
          delay: delay + 0.3,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

export default function Review() {
  const { id } = useParams<{ id: string }>()
  // id used for future API integration
  void id
  const navigate = useNavigate()
  const gradeColor = getGradeColor(CONVERSATION_DATA.grade)

  return (
    <div className="min-h-[100dvh] pt-[72px]">
      {/* ============================================================ */}
      {/* SECTION 1: Hero                                                */}
      {/* ============================================================ */}
      <section
        className="relative"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(225, 29, 72, 0.06) 0%, transparent 60%), #FDFBF7',
          padding: 'clamp(48px, 6vw, 96px) 0 clamp(32px, 4vw, 64px)',
        }}
      >
        <div className="max-w-[900px] mx-auto px-6">
          {/* Back nav */}
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-body-sm font-medium text-text-muted hover:text-text-secondary transition-colors mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </motion.button>

          {/* Context bar */}
          <motion.div
            className="flex flex-wrap items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E11D48] to-[#8B5CF6] flex items-center justify-center text-caption font-semibold text-white">
                {CONVERSATION_DATA.personaName[0]}
              </div>
              <span className="text-caption font-medium text-text-muted">
                {CONVERSATION_DATA.personaName}
              </span>
            </div>
            <span
              className="text-caption font-medium uppercase px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${getDifficultyColor(CONVERSATION_DATA.difficulty)}20`,
                color: getDifficultyColor(CONVERSATION_DATA.difficulty),
              }}
            >
              {CONVERSATION_DATA.difficulty}
            </span>
            <span className="text-caption text-text-muted">
              {CONVERSATION_DATA.duration} &middot; {CONVERSATION_DATA.messageCount} messages
            </span>
            <span className="text-caption text-text-muted ml-auto">
              {CONVERSATION_DATA.date}
            </span>
          </motion.div>

          {/* Overall score */}
          <motion.div
            className="flex flex-col items-center text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUpVariants} className="relative mb-6">
              <ScoreRing score={CONVERSATION_DATA.overallScore} size={200} strokeWidth={12} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-display-hero text-text-primary">
                  <AnimatedScore target={CONVERSATION_DATA.overallScore} />
                </span>
                <span className="text-heading-md text-text-muted">/100</span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="px-6 py-2 rounded-full mb-4"
              style={{
                backgroundColor: `${gradeColor}15`,
                border: `1px solid ${gradeColor}30`,
              }}
            >
              <span className="text-heading-sm font-semibold" style={{ color: gradeColor }}>
                {CONVERSATION_DATA.gradeLabel}
              </span>
            </motion.div>

            <motion.p
              variants={fadeUpVariants}
              className="text-body-lg text-text-secondary max-w-[560px]"
            >
              {CONVERSATION_DATA.descriptor}
            </motion.p>

            {/* Quick stats */}
            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full"
            >
              {[
                {
                  icon: <MessageCircle className="w-6 h-6 text-[#E11D48]" />,
                  value: `${CONVERSATION_DATA.messageCount}`,
                  label: 'Messages Exchanged',
                },
                {
                  icon: <Clock className="w-6 h-6 text-[#F59E0B]" />,
                  value: CONVERSATION_DATA.duration,
                  label: 'Duration',
                },
                {
                  icon: <TrendingUp className="w-6 h-6 text-[#14B8A6]" />,
                  value: CONVERSATION_DATA.vsAverage,
                  label: 'vs. Average',
                },
                {
                  icon: <Target className="w-6 h-6 text-[#8B5CF6]" />,
                  value: CONVERSATION_DATA.goalProgress,
                  label: 'Goal Progress',
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass-card p-4 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                >
                  {stat.icon}
                  <span className="text-heading-lg font-semibold text-text-primary">
                    {stat.value}
                  </span>
                  <span className="text-caption text-text-muted">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: Category Scores                                     */}
      {/* ============================================================ */}
      <section className="bg-bg-secondary" style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-caption text-text-muted uppercase mb-2">Detailed Breakdown</p>
            <h2 className="text-display-subsection text-text-primary">
              Where You Excelled &amp; Where to Grow
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {CATEGORY_SCORES.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="glass-card-elevated p-6 group cursor-default"
                style={{ borderLeft: `4px solid ${cat.color}` }}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4, boxShadow: `0 0 40px ${cat.glowColor}` }}
              >
                <div className="mb-4" style={{ color: cat.color }}>
                  {cat.icon}
                </div>
                <h3 className="text-heading-sm font-semibold text-text-primary mb-3">{cat.name}</h3>
                <ScoreBar score={cat.score} maxScore={cat.maxScore} color={cat.color} delay={i * 0.12} />
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-heading-xl font-semibold text-text-primary">
                    <AnimatedScore target={cat.score} duration={800} />
                  </span>
                  <span className="text-body-sm text-text-muted">/20</span>
                </div>
                <StarRating score={cat.score} />
                <p
                  className="text-caption font-medium mt-2"
                  style={{ color: getScoreColor(cat.score) }}
                >
                  {cat.label}
                </p>
                <p className="text-body-sm text-text-secondary mt-2">{cat.feedback}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: Message Timeline                                    */}
      {/* ============================================================ */}
      <section
        className="bg-bg-primary"
        style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-caption text-text-muted uppercase mb-2">Message Timeline</p>
            <h2 className="text-display-subsection text-text-primary mb-3">
              Every Message, Analyzed
            </h2>
            <p className="text-body text-text-secondary">
              Click any message to see the full breakdown of what was really going on.
            </p>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-bg-tertiary md:-translate-x-px" />

            <div className="space-y-6">
              {TIMELINE_MESSAGES.map((msg, i) => (
                <TimelineMessageItem key={msg.id} message={msg} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: Psychology Deep Dive                                */}
      {/* ============================================================ */}
      <section
        className="bg-bg-secondary relative overflow-hidden"
        style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}
      >
        {/* Subtle purple overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 50%)',
          }}
        />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-caption text-[#8B5CF6] uppercase mb-2">Psychology Insights</p>
            <h2 className="text-display-subsection text-text-primary">
              The Science Behind Your Interaction
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PSYCHOLOGY_INSIGHTS.map((insight, i) => (
              <motion.div
                key={insight.title}
                className="glass-card p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center mb-5"
                  style={{ color: insight.color }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.1 + i * 0.15,
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
                  }}
                >
                  {insight.icon}
                </motion.div>
                <h3 className="text-heading-md font-semibold text-text-primary mb-3">
                  {insight.title}
                </h3>
                <p className="text-body text-text-secondary leading-relaxed">{insight.content}</p>
                <button
                  onClick={() => navigate('/science')}
                  className="mt-4 text-body-sm text-[#8B5CF6] hover:underline inline-flex items-center gap-1"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: Improvement Roadmap                                 */}
      {/* ============================================================ */}
      <section
        className="bg-bg-primary"
        style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-caption text-text-muted uppercase mb-2">Your Roadmap</p>
            <h2 className="text-display-subsection text-text-primary">3 Steps to Level Up</h2>
          </motion.div>

          <div className="relative space-y-8">
            {/* Connector line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-bg-tertiary" />

            {ROADMAP_STEPS.map((step, i) => (
              <RoadmapStepItem key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: Actions                                             */}
      {/* ============================================================ */}
      <section
        className="bg-bg-secondary"
        style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}
      >
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <motion.h2
            className="text-display-subsection text-text-primary mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready for Your Next Conversation?
          </motion.h2>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 btn-gradient text-text-primary text-heading-sm font-semibold px-8 py-4 rounded-full"
            >
              <TrendingUp className="w-5 h-5" />
              Try a Harder Challenge
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 text-text-primary text-heading-sm font-semibold px-8 py-4 rounded-full"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <RefreshCw className="w-5 h-5" />
              Practice Same Persona
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-text-primary text-heading-sm font-semibold px-8 py-4 rounded-full"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <Star className="w-5 h-5" />
              Save to Dashboard
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-body-sm text-text-muted mb-4">Share your progress</p>
            <div className="flex items-center justify-center gap-3">
              {[
                { icon: <TwitterIcon />, label: 'Twitter' },
                { icon: <LinkIcon />, label: 'Copy Link' },
                { icon: <CameraIcon />, label: 'Screenshot' },
              ].map((share, i) => (
                <motion.button
                  key={share.label}
                  className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-[#2A2A35] transition-colors"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={share.label}
                >
                  {share.icon}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Timeline Message Item                                              */
/* ------------------------------------------------------------------ */

function TimelineMessageItem({ message, index }: { message: TimelineMessage; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const isUser = message.role === 'user'
  const scoreColor = getScoreColor(message.score)
  const isGreat = message.score >= 85
  const isPoor = message.score < 70 && isUser

  return (
    <motion.div
      className={`relative flex items-start gap-4 ${isUser ? 'md:flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      {/* Timeline node */}
      <div
        className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-6 z-10"
        style={{ backgroundColor: isUser ? '#E11D48' : '#F472B6' }}
      />

      {/* Spacer for alternating layout on desktop */}
      <div className="hidden md:block md:w-1/2" />

      {/* Message content */}
      <div className="flex-1 ml-10 md:ml-0 md:max-w-[calc(50%-24px)]">
        <div className="flex items-start gap-2 mb-1">
          {isGreat && (
            <Star
              className="w-4 h-4 text-[#F59E0B] mt-1 flex-shrink-0"
              style={{ fill: '#D97706' }}
            />
          )}
          {isPoor && <AlertTriangle className="w-4 h-4 text-[#EF4444] mt-1 flex-shrink-0" />}
          <div
            className={`inline-block p-4 max-w-full ${
              isUser
                ? 'bg-gradient-to-br from-[#E11D48] to-[#BE123C] text-white'
                : 'bg-[rgba(255,255,255,0.82)] text-text-primary'
            }`}
            style={{
              borderRadius: isUser ? '20px 20px 0 20px' : '0 20px 20px 20px',
              borderLeft: isUser ? 'none' : '3px solid #F472B6',
              backdropFilter: isUser ? 'none' : 'blur(12px)',
            }}
          >
            <p className="text-body">{message.content}</p>
          </div>
        </div>

        {isUser && (
          <div className="flex items-center gap-3 mt-2 ml-6">
            {/* Score badge */}
            <motion.div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ backgroundColor: `${scoreColor}20` }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 400,
                damping: 15,
              }}
            >
              <span className="text-caption font-semibold" style={{ color: scoreColor }}>
                {message.score}
              </span>
            </motion.div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-caption text-text-muted hover:text-text-secondary flex items-center gap-1 transition-colors"
            >
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {expanded ? 'Hide' : 'Analyze'}
            </button>
          </div>
        )}

        {/* Expanded analysis */}
        <AnimatePresence>
          {expanded && isUser && (
            <motion.div
              className="mt-3 ml-6 glass-card p-4"
              style={{ borderLeft: `3px solid ${scoreColor}` }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
            >
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-body-sm font-semibold text-text-primary mb-1">Key Insight</p>
                  <p className="text-body-sm text-text-secondary">{message.insight}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Roadmap Step Item                                                  */
/* ------------------------------------------------------------------ */

function RoadmapStepItem({ step, index }: { step: RoadmapStep; index: number }) {
  return (
    <motion.div
      className="relative flex items-start gap-6"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      {/* Number badge */}
      <motion.div
        className="relative z-10 w-12 h-12 rounded-full btn-gradient flex items-center justify-center flex-shrink-0"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: index * 0.15,
          type: 'spring',
          stiffness: 400,
          damping: 15,
        }}
      >
        <span className="text-heading-md font-semibold text-white">{step.number}</span>
      </motion.div>

      {/* Content card */}
      <div className="glass-card p-6 flex-1">
        <h3 className="text-heading-md font-semibold text-text-primary mb-2">{step.title}</h3>
        <p className="text-body text-text-secondary mb-4">{step.description}</p>
        <ul className="space-y-2 mb-4">
          {step.actions.map((action) => (
            <li key={action} className="flex items-start gap-2 text-body-sm text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-[#14B8A6] mt-0.5 flex-shrink-0" />
              {action}
            </li>
          ))}
        </ul>
        <motion.button
          onClick={() => {}}
          className="inline-flex items-center gap-2 btn-gradient text-text-primary text-body-sm font-semibold px-5 py-2.5 rounded-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.15 }}
        >
          <Sparkles className="w-4 h-4" />
          Practice This
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Simple SVG icons for share buttons                                 */
/* ------------------------------------------------------------------ */

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
