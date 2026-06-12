import type { Progress } from './storage'

// ── XP & levels ────────────────────────────────────────────────────────────

/** Cumulative XP required to REACH each level (index 0 = level 1). */
export const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2600, 3500] as const

export const MAX_LEVEL = LEVEL_THRESHOLDS.length

export const LEVEL_TITLES = [
  'Wallflower',
  'Icebreaker',
  'Conversationalist',
  'Charmer',
  'Storyteller',
  'Connector',
  'Heartthrob',
  'Smooth Operator',
  'Natural',
  'Legend',
] as const

export function levelForXp(xp: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
  }
  return level
}

export function levelProgress(xp: number): { current: number; next: number | null; pct: number } {
  const level = levelForXp(xp)
  const current = LEVEL_THRESHOLDS[level - 1]
  const next = level < MAX_LEVEL ? LEVEL_THRESHOLDS[level] : null
  const pct = next === null ? 100 : Math.round(((xp - current) / (next - current)) * 100)
  return { current, next, pct }
}

/**
 * XP for a completed practice session. Quality matters more than volume:
 * base 10, up to +40 for score, small length bonus, drill bonus on top.
 */
export function xpForSession(avgScore: number, userMessageCount: number, drillBonus = 0): number {
  const base = 10
  const quality = Math.round(Math.max(0, Math.min(5, avgScore)) * 8)
  const length = Math.min(10, Math.floor(userMessageCount / 3) * 2)
  return base + quality + length + drillBonus
}

// ── Streaks ────────────────────────────────────────────────────────────────

/** Local-timezone YYYY-MM-DD for "did I practice today" comparisons. */
export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function updateStreak(
  lastPracticeDate: string | null,
  currentStreak: number,
  today: string = todayKey()
): number {
  if (lastPracticeDate === today) return Math.max(1, currentStreak)
  if (lastPracticeDate === null) return 1
  const last = new Date(`${lastPracticeDate}T12:00:00`)
  const now = new Date(`${today}T12:00:00`)
  const dayDiff = Math.round((now.getTime() - last.getTime()) / 86_400_000)
  return dayDiff === 1 ? currentStreak + 1 : 1
}

// ── Achievements ───────────────────────────────────────────────────────────

export interface AchievementDef {
  id: string
  title: string
  description: string
  emoji: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-conversation', title: 'First Words', description: 'Complete your first practice conversation', emoji: '💬' },
  { id: 'first-drill', title: 'In Training', description: 'Complete your first scenario drill', emoji: '🎯' },
  { id: 'streak-3', title: 'Warming Up', description: 'Practice 3 days in a row', emoji: '🔥' },
  { id: 'streak-7', title: 'Committed', description: 'Practice 7 days in a row', emoji: '⚡' },
  { id: 'streak-30', title: 'Unstoppable', description: 'Practice 30 days in a row', emoji: '🏆' },
  { id: 'sessions-10', title: 'Regular', description: 'Complete 10 practice sessions', emoji: '📈' },
  { id: 'sessions-50', title: 'Veteran', description: 'Complete 50 practice sessions', emoji: '🎖️' },
  { id: 'perfect-message', title: 'Smooth', description: 'Earn a 5-star message rating', emoji: '⭐' },
  { id: 'category-complete', title: 'Specialist', description: 'Complete every drill in a category', emoji: '🧠' },
  { id: 'level-5', title: 'Halfway There', description: 'Reach level 5', emoji: '🚀' },
  { id: 'level-10', title: 'Top of the Game', description: 'Reach the maximum level', emoji: '👑' },
  { id: 'voice-first', title: 'Out Loud', description: 'Complete a voice practice session', emoji: '🎤' },
]

export function achievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

export interface SessionOutcome {
  avgScore: number
  userMessageCount: number
  hadFiveStarMessage: boolean
  usedVoice: boolean
  drillSlug?: string
  drillBonus?: number
  drillCategoryCompleted?: boolean
  totalSessionsAfter: number
}

export interface ProgressUpdate {
  progress: Progress
  xpGained: number
  leveledUp: boolean
  newAchievements: AchievementDef[]
}

/** Pure reducer: applies one completed session to a Progress snapshot. */
export function applySession(prev: Progress, outcome: SessionOutcome, today: string = todayKey()): ProgressUpdate {
  const xpGained = xpForSession(outcome.avgScore, outcome.userMessageCount, outcome.drillBonus ?? 0)
  const xp = prev.xp + xpGained
  const prevLevel = levelForXp(prev.xp)
  const level = levelForXp(xp)
  const streak = updateStreak(prev.lastPracticeDate, prev.streak, today)
  const longestStreak = Math.max(prev.longestStreak, streak)

  const drills = { ...prev.drills }
  if (outcome.drillSlug) {
    const existing = drills[outcome.drillSlug]
    drills[outcome.drillSlug] = {
      bestScore: Math.max(existing?.bestScore ?? 0, outcome.avgScore),
      completedAt: Date.now(),
    }
  }

  const unlocked = new Set(prev.achievements)
  const checks: [string, boolean][] = [
    ['first-conversation', outcome.totalSessionsAfter >= 1],
    ['first-drill', Boolean(outcome.drillSlug)],
    ['streak-3', streak >= 3],
    ['streak-7', streak >= 7],
    ['streak-30', streak >= 30],
    ['sessions-10', outcome.totalSessionsAfter >= 10],
    ['sessions-50', outcome.totalSessionsAfter >= 50],
    ['perfect-message', outcome.hadFiveStarMessage],
    ['category-complete', Boolean(outcome.drillCategoryCompleted)],
    ['level-5', level >= 5],
    ['level-10', level >= MAX_LEVEL],
    ['voice-first', outcome.usedVoice || prev.voiceUsed],
  ]
  const newAchievements: AchievementDef[] = []
  for (const [id, earned] of checks) {
    if (earned && !unlocked.has(id)) {
      unlocked.add(id)
      const def = achievementById(id)
      if (def) newAchievements.push(def)
    }
  }

  return {
    progress: {
      xp,
      level,
      streak,
      longestStreak,
      lastPracticeDate: today,
      achievements: [...unlocked],
      drills,
      voiceUsed: prev.voiceUsed || outcome.usedVoice,
    },
    xpGained,
    leveledUp: level > prevLevel,
    newAchievements,
  }
}
