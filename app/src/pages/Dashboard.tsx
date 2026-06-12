import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts'
import {
  MessageCircle,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Flame,
  Star,
  Zap,
  Trophy,
  Heart,
  ChevronRight,
  RefreshCw,
  Lock,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type DateRange = '7days' | '30days' | 'all'

interface Conversation {
  id: string
  personaName: string
  personaInitial: string
  date: string
  scenario: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master'
  score: number
  grade: string
  messages: number
  duration: string
  avatarGradient: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  unlockedDate?: string
  bgColor: string
}

interface Tip {
  icon: React.ReactNode
  iconColor: string
  category: string
  categoryColor: string
  title: string
  content: string
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const SKILL_RADAR_DATA = [
  { skill: 'Opening', current: 85, previous: 80 },
  { skill: 'Engagement', current: 72, previous: 60 },
  { skill: 'Emotional IQ', current: 68, previous: 53 },
  { skill: 'Attraction', current: 80, previous: 77 },
  { skill: 'Closing', current: 65, previous: 45 },
  { skill: 'Consistency', current: 74, previous: 66 },
]

const SKILL_INSIGHTS = [
  { name: 'Opening', score: 85, insight: 'Strong first impressions', change: '+5%', positive: true },
  { name: 'Engagement', score: 72, insight: 'Good but inconsistent', change: '+12%', positive: true },
  { name: 'Emotional IQ', score: 68, insight: 'Growing awareness', change: '+15%', positive: true },
  { name: 'Attraction', score: 80, insight: 'Natural confidence', change: '+3%', positive: true },
  { name: 'Closing', score: 65, insight: 'Work on the ask', change: '+20%', positive: true },
  { name: 'Consistency', score: 74, insight: 'Good personality reading', change: '+8%', positive: true },
]

const TREND_DATA = [
  { day: 'Oct 1', overall: 45, opening: 50, engagement: 40, emotionalIQ: 35 },
  { day: 'Oct 3', overall: 52, opening: 55, engagement: 48, emotionalIQ: 42 },
  { day: 'Oct 5', overall: 48, opening: 52, engagement: 45, emotionalIQ: 40 },
  { day: 'Oct 8', overall: 58, opening: 60, engagement: 55, emotionalIQ: 48 },
  { day: 'Oct 10', overall: 55, opening: 58, engagement: 50, emotionalIQ: 45 },
  { day: 'Oct 12', overall: 62, opening: 65, engagement: 58, emotionalIQ: 52 },
  { day: 'Oct 14', overall: 60, opening: 62, engagement: 56, emotionalIQ: 55 },
  { day: 'Oct 16', overall: 68, opening: 70, engagement: 62, emotionalIQ: 60 },
  { day: 'Oct 18', overall: 65, opening: 68, engagement: 60, emotionalIQ: 58 },
  { day: 'Oct 20', overall: 72, opening: 74, engagement: 68, emotionalIQ: 65 },
  { day: 'Oct 22', overall: 70, opening: 72, engagement: 66, emotionalIQ: 62 },
  { day: 'Oct 24', overall: 78, opening: 80, engagement: 75, emotionalIQ: 70 },
  { day: 'Oct 26', overall: 75, opening: 76, engagement: 72, emotionalIQ: 68 },
  { day: 'Oct 28', overall: 82, opening: 84, engagement: 78, emotionalIQ: 75 },
  { day: 'Oct 30', overall: 80, opening: 82, engagement: 76, emotionalIQ: 73 },
]

const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    personaName: 'Sophia',
    personaInitial: 'S',
    date: 'Yesterday',
    scenario: 'Coffee Shop Approach',
    difficulty: 'Intermediate',
    score: 78,
    grade: 'B',
    messages: 24,
    duration: '12m',
    avatarGradient: 'from-[#E11D48] to-[#F59E0B]',
  },
  {
    id: 'conv-002',
    personaName: 'Maya',
    personaInitial: 'M',
    date: '2 days ago',
    scenario: 'Bookstore Conversation',
    difficulty: 'Advanced',
    score: 65,
    grade: 'C',
    messages: 18,
    duration: '8m',
    avatarGradient: 'from-[#8B5CF6] to-[#3B82F6]',
  },
  {
    id: 'conv-003',
    personaName: 'Chloe',
    personaInitial: 'C',
    date: '3 days ago',
    scenario: 'Gym Small Talk',
    difficulty: 'Beginner',
    score: 82,
    grade: 'B',
    messages: 31,
    duration: '15m',
    avatarGradient: 'from-[#14B8A6] to-[#10B981]',
  },
  {
    id: 'conv-004',
    personaName: 'Ava',
    personaInitial: 'A',
    date: '5 days ago',
    scenario: 'Art Gallery Opening',
    difficulty: 'Intermediate',
    score: 71,
    grade: 'B',
    messages: 22,
    duration: '10m',
    avatarGradient: 'from-[#F59E0B] to-[#EF4444]',
  },
  {
    id: 'conv-005',
    personaName: 'Zara',
    personaInitial: 'Z',
    date: '1 week ago',
    scenario: 'Rooftop Bar',
    difficulty: 'Expert',
    score: 58,
    grade: 'D',
    messages: 14,
    duration: '6m',
    avatarGradient: 'from-[#8B5CF6] to-[#E11D48]',
  },
  {
    id: 'conv-006',
    personaName: 'Luna',
    personaInitial: 'L',
    date: '1 week ago',
    scenario: 'Park Encounter',
    difficulty: 'Beginner',
    score: 88,
    grade: 'A',
    messages: 28,
    duration: '14m',
    avatarGradient: 'from-[#14B8A6] to-[#3B82F6]',
  },
  {
    id: 'conv-007',
    personaName: 'Sophia',
    personaInitial: 'S',
    date: '2 weeks ago',
    scenario: 'Dinner Party',
    difficulty: 'Advanced',
    score: 62,
    grade: 'C',
    messages: 20,
    duration: '9m',
    avatarGradient: 'from-[#E11D48] to-[#F59E0B]',
  },
  {
    id: 'conv-008',
    personaName: 'Maya',
    personaInitial: 'M',
    date: '2 weeks ago',
    scenario: 'Networking Event',
    difficulty: 'Master',
    score: 45,
    grade: 'F',
    messages: 12,
    duration: '5m',
    avatarGradient: 'from-[#8B5CF6] to-[#3B82F6]',
  },
]

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Steps',
    description: 'Complete your first conversation',
    icon: <MessageCircle className="w-6 h-6" />,
    unlocked: true,
    unlockedDate: 'Oct 15',
    bgColor: '#10B981',
  },
  {
    id: 'ach-2',
    title: 'On the Rise',
    description: 'Score above 75 for the first time',
    icon: <TrendingUp className="w-6 h-6" />,
    unlocked: true,
    unlockedDate: 'Oct 18',
    bgColor: '#E11D48',
  },
  {
    id: 'ach-3',
    title: 'Speed Demon',
    description: 'Complete 5 conversations in one day',
    icon: <Zap className="w-6 h-6" />,
    unlocked: true,
    unlockedDate: 'Oct 20',
    bgColor: '#F59E0B',
  },
  {
    id: 'ach-4',
    title: 'Mind Reader',
    description: 'Correctly identify hidden subtext 10 times',
    icon: <Brain className="w-6 h-6" />,
    unlocked: true,
    unlockedDate: 'Oct 22',
    bgColor: '#8B5CF6',
  },
  {
    id: 'ach-5',
    title: 'Spark',
    description: 'Build strong attraction in a conversation',
    icon: <Flame className="w-6 h-6" />,
    unlocked: true,
    unlockedDate: 'Oct 24',
    bgColor: '#E11D48',
  },
  {
    id: 'ach-6',
    title: 'Closer',
    description: 'Achieve conversation goal 5 times',
    icon: <Target className="w-6 h-6" />,
    unlocked: true,
    unlockedDate: 'Oct 25',
    bgColor: '#14B8A6',
  },
  {
    id: 'ach-7',
    title: 'Streak',
    description: 'Practice 7 days in a row',
    icon: <Star className="w-6 h-6" />,
    unlocked: true,
    unlockedDate: 'Today',
    bgColor: '#F59E0B',
  },
  {
    id: 'ach-8',
    title: 'Master',
    description: 'Score 90+ on Expert difficulty',
    icon: <Trophy className="w-6 h-6" />,
    unlocked: false,
    bgColor: '#52525B',
  },
  {
    id: 'ach-9',
    title: 'Casanova',
    description: 'Successfully complete all conversation goals',
    icon: <Heart className="w-6 h-6" />,
    unlocked: false,
    bgColor: '#52525B',
  },
]

const TIPS: Tip[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    iconColor: '#8B5CF6',
    category: 'PSYCHOLOGY',
    categoryColor: '#8B5CF6',
    title: 'The Power of Vulnerability Calibration',
    content:
      'Your conversations show strong confidence, but adding calibrated vulnerability at the right moments could deepen connections by 40%. Learn when and how to open up without over-sharing.',
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    iconColor: '#E11D48',
    category: 'TECHNIQUE',
    categoryColor: '#E11D48',
    title: 'Mastering the Transition',
    content:
      'You tend to stay in one conversational stage too long. Practice smoother transitions between banter, personal topics, and the close. The best conversations flow like a natural escalation.',
  },
  {
    icon: <Target className="w-8 h-8" />,
    iconColor: '#14B8A6',
    category: 'STRATEGY',
    categoryColor: '#14B8A6',
    title: 'The Abundance Mindset',
    content:
      'Some of your messages show subtle neediness cues. Work on embodying abundance mentality. You\'re offering value, not seeking validation. This shift alone could improve your scores by 15%',
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getDifficultyColor(d: string): string {
  switch (d) {
    case 'Beginner':
      return '#10B981'
    case 'Intermediate':
      return '#F59E0B'
    case 'Advanced':
      return '#F97316'
    case 'Expert':
      return '#EF4444'
    case 'Master':
      return '#8B5CF6'
    default:
      return '#F59E0B'
  }
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'S':
      return '#14B8A6'
    case 'A':
      return '#16A34A'
    case 'B':
      return '#CA8A04'
    case 'C':
      return '#EA580C'
    case 'D':
      return '#EF4444'
    case 'F':
      return '#DC2626'
    default:
      return '#CA8A04'
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#16A34A'
  if (score >= 70) return '#CA8A04'
  if (score >= 60) return '#EA580C'
  return '#EF4444'
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRange>('7days')

  const dateRanges: { key: DateRange; label: string }[] = [
    { key: '7days', label: '7 days' },
    { key: '30days', label: '30 days' },
    { key: 'all', label: 'All time' },
  ]

  const stats = [
    {
      icon: <MessageCircle className="w-6 h-6 text-[#E11D48]" />,
      label: 'Conversations',
      value: '24',
      trend: '+12% this week',
      positive: true,
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#14B8A6]" />,
      label: 'Avg. Score',
      value: '72/100',
      trend: '+8% this week',
      positive: true,
    },
    {
      icon: <Clock className="w-6 h-6 text-[#F59E0B]" />,
      label: 'Practice Time',
      value: '4.2h',
      trend: '+23% this week',
      positive: true,
    },
    {
      icon: <Target className="w-6 h-6 text-[#8B5CF6]" />,
      label: 'Goals Reached',
      value: '18',
      trend: '+5 this week',
      positive: true,
    },
  ]

  return (
    <div className="min-h-[100dvh] pt-[72px]">
      {/* ============================================================ */}
      {/* SECTION 1: Header + Stats                                      */}
      {/* ============================================================ */}
      <section className="relative bg-[#0A0A0F]" style={{ padding: 'clamp(48px, 5vw, 64px) 0 48px' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <div>
              <h1 className="text-display-subsection text-[#F5F5F7] mb-2">
                Welcome back, Alex
              </h1>
              <p className="text-body-lg text-[#A1A1AA]">
                Here&apos;s your progress this week. You&apos;re improving fast.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {dateRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setDateRange(range.key)}
                  className={`text-caption font-medium px-4 py-1.5 rounded-full transition-all ${
                    dateRange === range.key
                      ? 'bg-[#1A1A25] text-[#F5F5F7]'
                      : 'text-[#52525B] hover:text-[#A1A1AA]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card-elevated p-6"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-3 mb-3">
                  {stat.icon}
                  <span className="text-caption text-[#52525B]">{stat.label}</span>
                </div>
                <p className="text-heading-xl font-semibold text-[#F5F5F7] mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1">
                  {stat.positive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#14B8A6]" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />
                  )}
                  <span
                    className={`text-caption font-medium ${
                      stat.positive ? 'text-[#14B8A6]' : 'text-[#EF4444]'
                    }`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 + 3: Charts Grid                                      */}
      {/* ============================================================ */}
      <section className="bg-[#12121A]" style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skill Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <div className="mb-6">
                <p className="text-caption text-[#52525B] uppercase mb-2">Skill Analysis</p>
                <h2 className="text-display-subsection text-[#F5F5F7]">
                  Your Communication Profile
                </h2>
              </div>
              <div className="glass-card p-6">
                <div className="flex flex-col xl:flex-row gap-6">
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height={320}>
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={SKILL_RADAR_DATA}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'Inter' }}
                        />
                        <Radar
                          name="Previous"
                          dataKey="previous"
                          stroke="#52525B"
                          strokeWidth={1}
                          strokeDasharray="4 4"
                          fill="transparent"
                        />
                        <Radar
                          name="Current"
                          dataKey="current"
                          stroke="#E11D48"
                          strokeWidth={2}
                          fill="url(#radarGradient)"
                          fillOpacity={0.3}
                        />
                        <defs>
                          <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#E11D48" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Skill Insights */}
                  <div className="xl:w-[240px] space-y-4">
                    {SKILL_INSIGHTS.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        className="flex flex-col gap-1"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.08,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-body-sm font-semibold text-[#F5F5F7]">
                            {skill.name}
                          </span>
                          <span
                            className="text-caption font-semibold"
                            style={{ color: getScoreColor(skill.score) }}
                          >
                            {skill.score}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1A1A25] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, #E11D48, #F59E0B)`,
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.score}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: 0.3 + i * 0.08,
                              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-caption text-[#A1A1AA]">{skill.insight}</span>
                          <span className="text-caption text-[#14B8A6] font-medium">
                            {skill.change}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performance Trend */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            >
              <div className="mb-6">
                <p className="text-caption text-[#52525B] uppercase mb-2">Performance Trends</p>
                <h2 className="text-display-subsection text-[#F5F5F7]">
                  Your Improvement Over Time
                </h2>
              </div>
              <div className="glass-card p-6">
                <div className="min-h-[300px]">
                  <ResponsiveContainer width="100%" height={340}>
                    <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E11D48" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#E11D48" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="openingGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E11D48" stopOpacity={0.1} />
                          <stop offset="100%" stopColor="#E11D48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: '#52525B', fontSize: 10, fontFamily: 'Inter' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: '#52525B', fontSize: 10, fontFamily: 'Inter' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(18,18,26,0.95)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(12px)',
                        }}
                        labelStyle={{ color: '#A1A1AA', fontSize: '12px' }}
                        itemStyle={{ fontSize: '12px', fontFamily: 'Inter' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="overall"
                        stroke="url(#lineGradient)"
                        strokeWidth={3}
                        fill="url(#areaGradient)"
                        dot={{ r: 4, fill: '#F5F5F7', stroke: '#E11D48', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#E11D48', stroke: '#F5F5F7', strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="opening"
                        stroke="#E11D48"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fill="url(#openingGradient)"
                        dot={false}
                      />
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#E11D48" />
                          <stop offset="50%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mt-4 flex-wrap">
                  {[
                    { color: '#E11D48', label: 'Overall Score' },
                    { color: '#E11D48', label: 'Opening', dashed: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: item.color,
                          border: item.dashed ? `2px dashed ${item.color}` : 'none',
                          background: item.dashed ? 'transparent' : item.color,
                        }}
                      />
                      <span className="text-caption text-[#52525B]">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Breakthrough annotation */}
                <div className="mt-4 glass-card px-4 py-2 inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#14B8A6]" />
                  <span className="text-caption font-semibold text-[#14B8A6]">
                    Breakthrough! +15 points
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: Conversation History                                */}
      {/* ============================================================ */}
      <section className="bg-[#0A0A0F]" style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="flex items-end justify-between mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-caption text-[#52525B] uppercase mb-2">History</p>
              <h2 className="text-display-subsection text-[#F5F5F7]">Recent Conversations</h2>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-body-sm text-[#FB7185] hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="space-y-3">
            {CONVERSATIONS.map((conv, i) => (
              <motion.div
                key={conv.id}
                className="glass-card p-4 flex items-center gap-4 cursor-pointer group hover:bg-[rgba(30,30,40,0.6)] transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                whileHover={{ x: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
                onClick={() => navigate(`/review/${conv.id}`)}
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${conv.avatarGradient} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-body font-semibold text-white">{conv.personaInitial}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-heading-sm font-semibold text-[#F5F5F7]">
                      {conv.personaName}
                    </span>
                    <span className="text-caption text-[#52525B]">{conv.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-body-sm text-[#A1A1AA]">{conv.scenario}</span>
                    <span
                      className="text-caption font-medium uppercase px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${getDifficultyColor(conv.difficulty)}20`,
                        color: getDifficultyColor(conv.difficulty),
                      }}
                    >
                      {conv.difficulty}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4">
                  <span
                    className="text-heading-sm font-semibold"
                    style={{ color: getGradeColor(conv.grade) }}
                  >
                    {conv.grade}
                  </span>
                  <div className="flex items-center gap-1 text-caption text-[#52525B]">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {conv.messages}
                  </div>
                  <div className="flex items-center gap-1 text-caption text-[#52525B]">
                    <Clock className="w-3.5 h-3.5" />
                    {conv.duration}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/review/${conv.id}`)
                    }}
                    className="text-body-sm text-[#A1A1AA] hover:text-[#F5F5F7] px-3 py-1.5 rounded-lg transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Review
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-[#52525B] hover:text-[#A1A1AA] transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-[#52525B] group-hover:text-[#A1A1AA] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: Achievements                                        */}
      {/* ============================================================ */}
      <section className="bg-[#12121A]" style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-caption text-[#F59E0B] uppercase mb-2">Achievements</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-display-subsection text-[#F5F5F7]">Your Milestones</h2>
              <span className="text-body-sm text-[#A1A1AA]">7 of 9 unlocked</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.id}
                className={`glass-card p-4 flex flex-col items-center text-center ${
                  !ach.unlocked ? 'opacity-50' : ''
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: ach.unlocked ? 1 : 0.5, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    ach.unlocked ? '' : 'bg-[#1A1A25]'
                  }`}
                  style={{
                    backgroundColor: ach.unlocked ? ach.bgColor : undefined,
                    color: ach.unlocked ? '#fff' : '#52525B',
                    boxShadow: ach.unlocked ? `0 0 20px ${ach.bgColor}40` : 'none',
                  }}
                >
                  {ach.unlocked ? ach.icon : <Lock className="w-5 h-5" />}
                </div>
                <h3
                  className={`text-heading-sm font-semibold mb-1 ${
                    ach.unlocked ? 'text-[#F5F5F7]' : 'text-[#52525B]'
                  }`}
                >
                  {ach.title}
                </h3>
                <p
                  className={`text-caption ${
                    ach.unlocked ? 'text-[#A1A1AA]' : 'text-[#52525B]'
                  }`}
                >
                  {ach.description}
                </p>
                {ach.unlocked && ach.unlockedDate && (
                  <p className="text-caption text-[#52525B] mt-2">{ach.unlockedDate}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: Personalized Tips                                   */}
      {/* ============================================================ */}
      <section className="bg-[#0A0A0F]" style={{ padding: 'clamp(48px, 5vw, 64px) 0' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-caption text-[#52525B] uppercase mb-2">Personalized For You</p>
            <h2 className="text-display-subsection text-[#F5F5F7]">This Week&apos;s Focus</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                className="glass-card-elevated p-8 group cursor-default"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 0 40px rgba(225,29,72,0.15)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ color: tip.iconColor }}>{tip.icon}</div>
                  <span className="text-caption font-medium" style={{ color: tip.categoryColor }}>
                    {tip.category}
                  </span>
                </div>
                <h3 className="text-heading-md font-semibold text-[#F5F5F7] mb-3">{tip.title}</h3>
                <p className="text-body text-[#A1A1AA] leading-relaxed mb-5">{tip.content}</p>
                <button
                  onClick={() => navigate('/science')}
                  className="text-body-sm text-[#FB7185] hover:underline inline-flex items-center gap-1"
                >
                  Read More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
