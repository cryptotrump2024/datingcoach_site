import { describe, expect, it } from 'vitest'
import {
  applySession,
  levelForXp,
  levelProgress,
  LEVEL_THRESHOLDS,
  MAX_LEVEL,
  updateStreak,
  xpForSession,
} from '../gamification'
import { emptyProgress } from '../storage'

describe('levels', () => {
  it('maps XP to levels along the curve', () => {
    expect(levelForXp(0)).toBe(1)
    expect(levelForXp(99)).toBe(1)
    expect(levelForXp(100)).toBe(2)
    expect(levelForXp(450)).toBe(4)
    expect(levelForXp(3500)).toBe(MAX_LEVEL)
    expect(levelForXp(999_999)).toBe(MAX_LEVEL)
  })

  it('reports progress toward the next level', () => {
    const p = levelProgress(175) // level 2 (100), next 250
    expect(p.next).toBe(250)
    expect(p.pct).toBe(50)
    expect(levelProgress(LEVEL_THRESHOLDS[MAX_LEVEL - 1]).next).toBeNull()
  })
})

describe('xpForSession', () => {
  it('rewards quality over volume', () => {
    const low = xpForSession(1, 3)
    const high = xpForSession(5, 3)
    expect(high).toBeGreaterThan(low + 25)
  })

  it('caps the length bonus', () => {
    expect(xpForSession(3, 300) - xpForSession(3, 30)).toBe(0)
  })

  it('adds drill bonus', () => {
    expect(xpForSession(3, 6, 25) - xpForSession(3, 6)).toBe(25)
  })
})

describe('updateStreak', () => {
  it('starts at 1 for first practice', () => {
    expect(updateStreak(null, 0, '2026-06-12')).toBe(1)
  })
  it('does not double-count the same day', () => {
    expect(updateStreak('2026-06-12', 4, '2026-06-12')).toBe(4)
  })
  it('increments on consecutive days', () => {
    expect(updateStreak('2026-06-11', 4, '2026-06-12')).toBe(5)
  })
  it('resets after a gap', () => {
    expect(updateStreak('2026-06-09', 9, '2026-06-12')).toBe(1)
  })
  it('handles month boundaries', () => {
    expect(updateStreak('2026-05-31', 2, '2026-06-01')).toBe(3)
  })
})

describe('applySession', () => {
  it('accumulates xp, streak and first-conversation achievement', () => {
    const update = applySession(
      emptyProgress,
      {
        avgScore: 4,
        userMessageCount: 6,
        hadFiveStarMessage: false,
        usedVoice: false,
        totalSessionsAfter: 1,
      },
      '2026-06-12'
    )
    expect(update.xpGained).toBeGreaterThan(0)
    expect(update.progress.streak).toBe(1)
    expect(update.progress.lastPracticeDate).toBe('2026-06-12')
    expect(update.progress.achievements).toContain('first-conversation')
    expect(update.newAchievements.map((a) => a.id)).toContain('first-conversation')
  })

  it('unlocks drill + five-star + voice achievements and records best score', () => {
    const update = applySession(
      { ...emptyProgress, achievements: ['first-conversation'] },
      {
        avgScore: 5,
        userMessageCount: 8,
        hadFiveStarMessage: true,
        usedVoice: true,
        drillSlug: 'revive-dead-chat',
        drillBonus: 30,
        totalSessionsAfter: 2,
      },
      '2026-06-12'
    )
    const ids = update.progress.achievements
    expect(ids).toContain('first-drill')
    expect(ids).toContain('perfect-message')
    expect(ids).toContain('voice-first')
    expect(update.progress.drills['revive-dead-chat'].bestScore).toBe(5)
    // already-unlocked achievements are not re-announced
    expect(update.newAchievements.map((a) => a.id)).not.toContain('first-conversation')
  })

  it('keeps the higher drill best score', () => {
    const withDrill = applySession(
      { ...emptyProgress, drills: { d1: { bestScore: 4.5, completedAt: 1 } } },
      {
        avgScore: 3,
        userMessageCount: 5,
        hadFiveStarMessage: false,
        usedVoice: false,
        drillSlug: 'd1',
        totalSessionsAfter: 3,
      },
      '2026-06-12'
    )
    expect(withDrill.progress.drills.d1.bestScore).toBe(4.5)
  })

  it('flags level-ups', () => {
    const update = applySession(
      { ...emptyProgress, xp: 95 },
      {
        avgScore: 3,
        userMessageCount: 4,
        hadFiveStarMessage: false,
        usedVoice: false,
        totalSessionsAfter: 4,
      },
      '2026-06-12'
    )
    expect(update.leveledUp).toBe(true)
    expect(update.progress.level).toBe(2)
  })
})
