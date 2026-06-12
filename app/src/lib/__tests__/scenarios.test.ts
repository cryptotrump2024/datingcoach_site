import { describe, expect, it } from 'vitest'
import {
  completesCategory,
  evaluateScenario,
  personaForScenario,
  scenarioBySlug,
  scenarios,
} from '../scenarios'

describe('scenario catalog', () => {
  it('has 12 unique drills across 4 categories', () => {
    expect(scenarios).toHaveLength(12)
    expect(new Set(scenarios.map((s) => s.slug)).size).toBe(12)
    expect(new Set(scenarios.map((s) => s.category)).size).toBe(4)
  })

  it('resolves personas for every drill', () => {
    for (const s of scenarios) {
      const persona = personaForScenario(s)
      expect(persona.name).toBe(s.personaName)
      expect(persona.difficulty).toBe(s.difficulty)
      expect(persona.id).toBe(`scenario-${s.slug}`)
    }
  })
})

describe('evaluateScenario', () => {
  const drill = scenarioBySlug('revive-dead-chat')!

  it('fails when too few messages were sent', () => {
    const result = evaluateScenario(drill, [{ score: 5 }, { score: 5 }], 2)
    expect(result.passed).toBe(false)
    expect(result.reason).toContain('at least')
  })

  it('fails below the score bar', () => {
    const analyses = Array(6).fill({ score: 2 })
    const result = evaluateScenario(drill, analyses, 6)
    expect(result.passed).toBe(false)
    expect(result.avgScore).toBe(2)
  })

  it('passes at or above the bar with enough messages', () => {
    const analyses = Array(6).fill({ score: 4 })
    const result = evaluateScenario(drill, analyses, 6)
    expect(result.passed).toBe(true)
  })
})

describe('completesCategory', () => {
  it('detects completing the last drill in a category', () => {
    const firstImpressions = scenarios.filter((s) => s.category === 'First Impressions')
    const others = firstImpressions.slice(0, -1).map((s) => s.slug)
    const last = firstImpressions[firstImpressions.length - 1].slug
    expect(completesCategory(last, others)).toBe(true)
    expect(completesCategory(last, [])).toBe(false)
  })
})
