import { supabase } from './supabase'
import type { Conversation } from '@/store'

// ── Progress shape (gamification) ──────────────────────────────────────────

export interface DrillRecord {
  bestScore: number
  completedAt: number
}

export interface Progress {
  xp: number
  level: number
  streak: number
  longestStreak: number
  lastPracticeDate: string | null // YYYY-MM-DD
  achievements: string[]
  drills: Record<string, DrillRecord>
  voiceUsed: boolean
}

export const emptyProgress: Progress = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  achievements: [],
  drills: {},
  voiceUsed: false,
}

// ── Storage adapter ────────────────────────────────────────────────────────
// One interface, two implementations: localStorage (guest/local mode) and
// Supabase (cloud mode). The store calls these fire-and-forget; failures
// must never break the practice flow.

export interface StorageAdapter {
  loadConversations(userId: string): Promise<Conversation[]>
  saveConversation(userId: string, conversation: Conversation): Promise<void>
  loadProgress(userId: string): Promise<Progress | null>
  saveProgress(userId: string, progress: Progress): Promise<void>
  saveAnalysis(userId: string, id: string, result: unknown): Promise<void>
}

const MAX_STORED_CONVERSATIONS = 100
const LS_CONVERSATIONS = 'datingcoach_conversations'
const LS_PROGRESS = 'datingcoach_progress'

class LocalAdapter implements StorageAdapter {
  async loadConversations(): Promise<Conversation[]> {
    try {
      return JSON.parse(localStorage.getItem(LS_CONVERSATIONS) || '[]') as Conversation[]
    } catch {
      return []
    }
  }

  async saveConversation(_userId: string, conversation: Conversation): Promise<void> {
    try {
      const all = await this.loadConversations()
      const idx = all.findIndex((c) => c.id === conversation.id)
      if (idx >= 0) all[idx] = conversation
      else all.push(conversation)
      localStorage.setItem(LS_CONVERSATIONS, JSON.stringify(all.slice(-MAX_STORED_CONVERSATIONS)))
    } catch {
      /* quota exceeded — practice continues without persistence */
    }
  }

  async loadProgress(): Promise<Progress | null> {
    try {
      const raw = localStorage.getItem(LS_PROGRESS)
      return raw ? { ...emptyProgress, ...(JSON.parse(raw) as Progress) } : null
    } catch {
      return null
    }
  }

  async saveProgress(_userId: string, progress: Progress): Promise<void> {
    try {
      localStorage.setItem(LS_PROGRESS, JSON.stringify(progress))
    } catch {
      /* ignore */
    }
  }

  async saveAnalysis(): Promise<void> {
    // Local mode: ProfileAnalyzer already persists saved analyses itself.
  }
}

class SupabaseAdapter implements StorageAdapter {
  async loadConversations(userId: string): Promise<Conversation[]> {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('conversations')
      .select('id, persona, messages, analyses, phase, phase_name, is_active, scenario_slug, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(MAX_STORED_CONVERSATIONS)
    if (error || !data) return []
    return data.map((row) => {
      const persona = (row.persona ?? {}) as { id?: string; name?: string; archetype?: string }
      return {
        id: row.id as string,
        personaId: persona.id ?? '',
        personaName: persona.name,
        personaArchetype: persona.archetype,
        messages: (row.messages ?? []) as Conversation['messages'],
        analyses: (row.analyses ?? []) as Conversation['analyses'],
        phase: (row.phase ?? 0) as number,
        phaseName: (row.phase_name ?? 'Opener') as string,
        isActive: Boolean(row.is_active),
        scenarioSlug: (row.scenario_slug ?? undefined) as string | undefined,
        createdAt: new Date(row.created_at as string).getTime(),
        updatedAt: new Date(row.updated_at as string).getTime(),
      }
    })
  }

  async saveConversation(userId: string, c: Conversation): Promise<void> {
    if (!supabase) return
    const analyses = c.analyses
    const avg =
      analyses.length > 0 ? analyses.reduce((s, a) => s + a.score, 0) / analyses.length : null
    await supabase.from('conversations').upsert({
      id: c.id,
      user_id: userId,
      persona: { id: c.personaId, name: c.personaName, archetype: c.personaArchetype },
      messages: c.messages,
      analyses: c.analyses,
      phase: c.phase,
      phase_name: c.phaseName,
      is_active: c.isActive,
      scenario_slug: c.scenarioSlug ?? null,
      avg_score: avg,
      created_at: new Date(c.createdAt).toISOString(),
      updated_at: new Date(c.updatedAt).toISOString(),
    })
  }

  async loadProgress(userId: string): Promise<Progress | null> {
    if (!supabase) return null
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error || !data) return null
    return {
      xp: data.xp ?? 0,
      level: data.level ?? 1,
      streak: data.streak ?? 0,
      longestStreak: data.longest_streak ?? 0,
      lastPracticeDate: data.last_practice_date ?? null,
      achievements: (data.achievements ?? []) as string[],
      drills: (data.drills ?? {}) as Record<string, DrillRecord>,
      voiceUsed: Boolean(data.voice_used),
    }
  }

  async saveProgress(userId: string, p: Progress): Promise<void> {
    if (!supabase) return
    await supabase.from('user_progress').upsert({
      user_id: userId,
      xp: p.xp,
      level: p.level,
      streak: p.streak,
      longest_streak: p.longestStreak,
      last_practice_date: p.lastPracticeDate,
      achievements: p.achievements,
      drills: p.drills,
      voice_used: p.voiceUsed,
      updated_at: new Date().toISOString(),
    })
  }

  async saveAnalysis(userId: string, id: string, result: unknown): Promise<void> {
    if (!supabase) return
    await supabase.from('profile_analyses').upsert({ id, user_id: userId, result })
  }
}

const localAdapter = new LocalAdapter()
const cloudAdapter = new SupabaseAdapter()

/** Local adapter for guests; cloud adapter once signed in with Supabase. */
export function getStorageAdapter(isCloudUser: boolean): StorageAdapter {
  return isCloudUser && supabase ? cloudAdapter : localAdapter
}
