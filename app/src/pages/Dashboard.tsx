import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Target,
  Flame,
  Star,
  Trophy,
  ChevronRight,
  Lock,
  Sparkles,
  Mic,
} from 'lucide-react'
import { useStore } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { computeDashboardStats } from '@/lib/stats'
import { ACHIEVEMENTS, LEVEL_TITLES, levelProgress } from '@/lib/gamification'
import { scenarios } from '@/lib/scenarios'

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tint,
  delay,
}: {
  icon: typeof Star
  label: string
  value: string
  sub?: string
  tint: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="glass-card p-5"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 border"
        style={{ background: `${tint}12`, borderColor: `${tint}30` }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: tint, width: 18, height: 18 }} aria-hidden="true" />
      </div>
      <p className="text-2xl font-display font-semibold text-text-primary">{value}</p>
      <p className="text-body-sm text-text-secondary mt-0.5">{label}</p>
      {sub && <p className="text-caption text-text-muted mt-1">{sub}</p>}
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-elevated max-w-xl mx-auto text-center p-10 md:p-14 mt-8"
    >
      <p className="text-5xl mb-4" aria-hidden="true">📊</p>
      <h2 className="text-heading-xl text-text-primary font-display mb-3">
        Your stats start with your first conversation
      </h2>
      <p className="text-body text-text-secondary mb-8">
        Complete a practice session or a scenario drill and this dashboard fills with real
        numbers: score trends, skill breakdowns, streaks and achievements. No fake data here.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/scenarios"
          className="btn-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-body font-semibold"
        >
          <Target className="w-4 h-4" aria-hidden="true" />
          Start your first drill
        </Link>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 rounded-full border border-stone-900/15 px-7 py-3.5 text-body font-medium text-text-primary hover:border-rose-300 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-text-rose" aria-hidden="true" />
          Free practice
        </Link>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const conversations = useStore((s) => s.conversations)
  const progress = useStore((s) => s.progress)

  const stats = useMemo(() => computeDashboardStats(conversations), [conversations])
  const lp = levelProgress(progress.xp)
  const levelTitle = LEVEL_TITLES[progress.level - 1] ?? LEVEL_TITLES[0]
  const drillsDone = Object.keys(progress.drills).length

  const hasData = stats.totalSessions > 0

  return (
    <div className="min-h-[100dvh] bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-end justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-caption uppercase tracking-[0.18em] text-text-rose mb-2">
              Your progress
            </p>
            <h1 className="text-display-subsection text-text-primary">
              {user ? `Welcome back, ${user.username}` : 'Welcome back'}
            </h1>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-body-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            New practice session
          </button>
        </motion.div>

        {/* Level + streak banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card-elevated p-6 md:p-7 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center shrink-0">
                <span className="text-white font-display text-xl font-bold">{progress.level}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-heading-md text-text-primary font-display truncate">
                    Level {progress.level} — {levelTitle}
                  </p>
                  <p className="text-caption text-text-muted shrink-0">
                    {lp.next === null ? `${progress.xp} XP (max)` : `${progress.xp} / ${lp.next} XP`}
                  </p>
                </div>
                <div
                  className="h-2.5 rounded-full bg-bg-tertiary mt-2 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={lp.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progress to next level"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lp.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #E11D48, #D97706)' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 md:border-l md:border-stone-900/10 md:pl-6">
              <div className="text-center">
                <p className="text-2xl font-display font-semibold text-text-primary inline-flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  {progress.streak}
                </p>
                <p className="text-caption text-text-muted">day streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-semibold text-text-primary">
                  {progress.longestStreak}
                </p>
                <p className="text-caption text-text-muted">best streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-semibold text-text-primary">
                  {drillsDone}/{scenarios.length}
                </p>
                <p className="text-caption text-text-muted">drills done</p>
              </div>
            </div>
          </div>
        </motion.div>

        {!hasData ? (
          <EmptyState />
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={MessageCircle}
                label="Sessions completed"
                value={String(stats.totalSessions)}
                tint="#E11D48"
                delay={0.08}
              />
              <StatCard
                icon={Star}
                label="Average score"
                value={stats.overallAvg.toFixed(1)}
                sub="out of 5"
                tint="#D97706"
                delay={0.12}
              />
              <StatCard
                icon={Sparkles}
                label="Best session"
                value={stats.bestSession.toFixed(1)}
                tint="#0D9488"
                delay={0.16}
              />
              <StatCard
                icon={Target}
                label="Messages sent"
                value={String(stats.totalMessages)}
                tint="#7C3AED"
                delay={0.2}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-6 lg:col-span-3"
              >
                <h2 className="text-heading-md text-text-primary font-display mb-1">
                  Score trend
                </h2>
                <p className="text-body-sm text-text-muted mb-4">
                  Average message score per session (last {stats.trend.length})
                </p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.trend} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E11D48" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#E11D48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EDE6DA" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: '#A8A29E', fontSize: 11, fontFamily: 'Inter' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: '#A8A29E', fontSize: 11, fontFamily: 'Inter' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.96)',
                          border: '1px solid rgba(28, 25, 23, 0.08)',
                          borderRadius: 12,
                          fontFamily: 'Inter',
                          fontSize: 12,
                        }}
                        formatter={(value: number) => [`${value}/100`, 'Score']}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#E11D48"
                        strokeWidth={2.5}
                        fill="url(#scoreFill)"
                        dot={{ r: 3.5, fill: '#FFFFFF', stroke: '#E11D48', strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: '#E11D48', stroke: '#FFFFFF', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 lg:col-span-2"
              >
                <h2 className="text-heading-md text-text-primary font-display mb-1">
                  Skill breakdown
                </h2>
                <p className="text-body-sm text-text-muted mb-2">
                  From every analyzed message, by conversation phase
                </p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={stats.radar} outerRadius="75%">
                      <PolarGrid stroke="#E5DCCB" />
                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: '#57534E', fontSize: 11, fontFamily: 'Inter' }}
                      />
                      <Radar
                        dataKey="score"
                        stroke="#7C3AED"
                        fill="#7C3AED"
                        fillOpacity={0.18}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.96)',
                          border: '1px solid rgba(28, 25, 23, 0.08)',
                          borderRadius: 12,
                          fontFamily: 'Inter',
                          fontSize: 12,
                        }}
                        formatter={(value: number) => [`${value}/100`, 'Skill']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                {stats.weakest && (
                  <Link
                    to="/scenarios"
                    className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-body-sm text-amber-900 hover:bg-amber-50 transition-colors"
                  >
                    <span>
                      Weakest skill: <strong>{stats.weakest.skill}</strong> — train it with{' '}
                      <strong>{stats.weakest.drillCategory}</strong> drills
                    </span>
                    <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Recent sessions + achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card p-6 lg:col-span-3"
              >
                <h2 className="text-heading-md text-text-primary font-display mb-4">
                  Recent sessions
                </h2>
                <ul className="divide-y divide-stone-900/5">
                  {stats.sessions.slice(0, 8).map((s) => (
                    <li key={s.id} className="flex items-center gap-4 py-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-caption font-bold shrink-0"
                        style={{
                          background: s.scenarioSlug
                            ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                            : 'linear-gradient(135deg, #E11D48, #D97706)',
                        }}
                        aria-hidden="true"
                      >
                        {s.personaName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-medium text-text-primary truncate">
                          {s.personaName}
                          {s.scenarioSlug && (
                            <span className="ml-2 text-caption text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                              Drill
                            </span>
                          )}
                        </p>
                        <p className="text-caption text-text-muted">
                          {new Date(s.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          · {s.userMessages} messages
                        </p>
                      </div>
                      <span
                        className="text-body-sm font-semibold shrink-0"
                        style={{
                          color:
                            s.avgScore >= 4 ? '#059669' : s.avgScore >= 3 ? '#CA8A04' : '#DC2626',
                        }}
                      >
                        {s.avgScore.toFixed(1)}
                        <span className="text-text-muted font-normal">/5</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 lg:col-span-2"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-heading-md text-text-primary font-display">Achievements</h2>
                  <span className="text-caption text-text-muted">
                    {progress.achievements.length}/{ACHIEVEMENTS.length}
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-2">
                  {ACHIEVEMENTS.map((a) => {
                    const unlocked = progress.achievements.includes(a.id)
                    return (
                      <li
                        key={a.id}
                        className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${
                          unlocked
                            ? 'border-amber-200 bg-amber-50/60'
                            : 'border-stone-900/5 bg-bg-secondary/60 opacity-60'
                        }`}
                      >
                        <span className="text-xl" aria-hidden="true">
                          {unlocked ? a.emoji : <Lock className="w-4 h-4 text-stone-400" />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium text-text-primary truncate">
                            {a.title}
                          </p>
                          <p className="text-caption text-text-muted truncate">{a.description}</p>
                        </div>
                        {unlocked && (
                          <Trophy className="w-4 h-4 text-amber-500 ml-auto shrink-0" aria-hidden="true" />
                        )}
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            </div>

            {/* Voice nudge */}
            {!progress.voiceUsed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass-card flex flex-wrap items-center gap-4 p-5 mt-6"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-blue-600" aria-hidden="true" />
                </div>
                <p className="text-body-sm text-text-secondary flex-1 min-w-[220px]">
                  <strong className="text-text-primary">Try voice practice.</strong> Real dates
                  happen out loud — use the mic button in any conversation to practice speaking.
                </p>
                <Link to="/create" className="text-body-sm font-medium text-text-rose hover:underline">
                  Start talking →
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
