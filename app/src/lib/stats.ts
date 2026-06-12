import type { Conversation } from '@/store'

export interface SessionSummary {
  id: string
  date: number
  personaName: string
  archetype: string
  avgScore: number
  userMessages: number
  scenarioSlug?: string
}

export interface SkillBucket {
  skill: string
  score: number // 0-100
  samples: number
}

export interface DashboardStats {
  sessions: SessionSummary[]
  totalSessions: number
  totalMessages: number
  overallAvg: number // 0-5
  bestSession: number // 0-5
  trend: { label: string; score: number }[] // 0-100 for charts
  radar: SkillBucket[]
  weakest: { skill: string; drillCategory: string } | null
}

const PHASE_TO_SKILL: Record<string, string> = {
  Opener: 'Openers',
  Rapport: 'Rapport',
  Attraction: 'Escalation',
  Investment: 'Depth',
  Close: 'Closing',
}

const SKILL_TO_DRILL_CATEGORY: Record<string, string> = {
  Openers: 'First Impressions',
  Rapport: 'Keeping It Alive',
  Escalation: 'Keeping It Alive',
  Depth: 'Making the Move',
  Closing: 'Making the Move',
}

export function computeDashboardStats(conversations: Conversation[]): DashboardStats {
  const completed = conversations
    .filter((c) => !c.isActive && c.analyses.length > 0)
    .sort((a, b) => a.createdAt - b.createdAt)

  const sessions: SessionSummary[] = completed.map((c) => ({
    id: c.id,
    date: c.createdAt,
    personaName: c.personaName ?? 'Practice partner',
    archetype: c.personaArchetype ?? '',
    avgScore: c.analyses.reduce((s, a) => s + a.score, 0) / c.analyses.length,
    userMessages: c.messages.filter((m) => m.role === 'user').length,
    scenarioSlug: c.scenarioSlug,
  }))

  const totalMessages = completed.reduce(
    (n, c) => n + c.messages.filter((m) => m.role === 'user').length,
    0
  )
  const overallAvg =
    sessions.length > 0 ? sessions.reduce((s, x) => s + x.avgScore, 0) / sessions.length : 0
  const bestSession = sessions.reduce((max, s) => Math.max(max, s.avgScore), 0)

  const trend = sessions.slice(-14).map((s, i) => ({
    label: `#${sessions.length - Math.min(sessions.length, 14) + i + 1}`,
    score: Math.round((s.avgScore / 5) * 100),
  }))

  // Skill radar: each assistant reply carries the phase it was sent in, and
  // analyses are appended in lockstep with replies — pair them by order.
  const buckets = new Map<string, { total: number; samples: number }>()
  for (const skill of Object.values(PHASE_TO_SKILL)) buckets.set(skill, { total: 0, samples: 0 })
  for (const c of completed) {
    const phasedReplies = c.messages.filter((m) => m.role === 'assistant' && m.phase)
    c.analyses.forEach((analysis, i) => {
      const phase = phasedReplies[i]?.phase ?? phasedReplies[phasedReplies.length - 1]?.phase
      const skill = PHASE_TO_SKILL[phase ?? ''] ?? 'Openers'
      const bucket = buckets.get(skill)!
      bucket.total += analysis.score
      bucket.samples += 1
    })
  }
  const radar: SkillBucket[] = [...buckets.entries()].map(([skill, b]) => ({
    skill,
    score: b.samples > 0 ? Math.round((b.total / b.samples / 5) * 100) : 0,
    samples: b.samples,
  }))

  const measured = radar.filter((r) => r.samples >= 2)
  const weakestBucket = measured.length > 0 ? measured.reduce((min, r) => (r.score < min.score ? r : min)) : null
  const weakest = weakestBucket
    ? { skill: weakestBucket.skill, drillCategory: SKILL_TO_DRILL_CATEGORY[weakestBucket.skill] }
    : null

  return {
    sessions: sessions.slice().reverse(), // newest first for lists
    totalSessions: sessions.length,
    totalMessages,
    overallAvg,
    bestSession,
    trend,
    radar,
    weakest,
  }
}
