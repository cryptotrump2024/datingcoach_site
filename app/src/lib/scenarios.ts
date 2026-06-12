import type { Persona } from '@/store'
import { showcasePersonas } from './personas'

export type ScenarioCategory =
  | 'First Impressions'
  | 'Keeping It Alive'
  | 'Making the Move'
  | 'Handling Curveballs'

export interface Scenario {
  slug: string
  category: ScenarioCategory
  title: string
  brief: string // shown to the user AND injected into the AI system prompt
  goal: string
  passCriteria: {
    minAvgScore: number
    maxUserMessages?: number
    minUserMessages: number
  }
  personaName: string // from showcasePersonas
  difficulty: Persona['difficulty']
  openingMessage?: string // persona's first text, when she opens
  xpBonus: number
}

export const SCENARIO_CATEGORIES: { name: ScenarioCategory; tint: string; description: string }[] = [
  { name: 'First Impressions', tint: '#E11D48', description: 'Openers that earn a reply' },
  { name: 'Keeping It Alive', tint: '#D97706', description: 'Momentum, depth and banter' },
  { name: 'Making the Move', tint: '#0D9488', description: 'From chat to an actual date' },
  { name: 'Handling Curveballs', tint: '#7C3AED', description: 'Tests, flakes and recoveries' },
]

export const scenarios: Scenario[] = [
  // ── First Impressions ────────────────────────────────────────────────────
  {
    slug: 'cold-open-sparse',
    category: 'First Impressions',
    title: 'The Sparse Profile',
    brief:
      "You matched with Yuki. Her profile gives you almost nothing: three artsy photos, a one-line bio ('here for the plot'). Open the conversation with no obvious hooks to work with.",
    goal: 'Earn a real reply without resorting to "hey" or generic compliments.',
    passCriteria: { minAvgScore: 3.2, minUserMessages: 4 },
    personaName: 'Yuki',
    difficulty: 'Intermediate',
    xpBonus: 20,
  },
  {
    slug: 'detailed-profile-opener',
    category: 'First Impressions',
    title: 'The Loaded Profile',
    brief:
      'Sophia\'s profile is rich: cooking, Sunday family dinners, a photo at a pasta-making class in Bologna. The trap is being obvious. Use the material without sounding like everyone else who read it.',
    goal: 'Open with specificity that stands out from the 50 other matches who saw the same profile.',
    passCriteria: { minAvgScore: 3.4, minUserMessages: 4 },
    personaName: 'Sophia',
    difficulty: 'Intermediate',
    xpBonus: 20,
  },
  {
    slug: 'she-texted-first',
    category: 'First Impressions',
    title: 'She Texted First',
    brief:
      "Luna messaged you first — rare, and a strong signal. Don't fumble it by being either smug or boring. Match her energy and convert interest into momentum.",
    goal: 'Keep her initial enthusiasm alive for at least four exchanges.',
    passCriteria: { minAvgScore: 3.0, minUserMessages: 4 },
    personaName: 'Luna',
    difficulty: 'Beginner',
    openingMessage: "ok your last photo is unfair 😄 where IS that place?",
    xpBonus: 15,
  },
  // ── Keeping It Alive ─────────────────────────────────────────────────────
  {
    slug: 'revive-dead-chat',
    category: 'Keeping It Alive',
    title: 'Revive the Dead Chat',
    brief:
      "You had a good conversation with Ava three days ago, then it went quiet after your last message. Re-open without apologizing for existing ('sorry to bother you') and without pretending nothing happened.",
    goal: 'Restart the conversation and get genuine engagement within three messages.',
    passCriteria: { minAvgScore: 3.4, minUserMessages: 4 },
    personaName: 'Ava',
    difficulty: 'Advanced',
    xpBonus: 30,
  },
  {
    slug: 'escape-interview-mode',
    category: 'Keeping It Alive',
    title: 'Escape Interview Mode',
    brief:
      "Your chat with Priya has become a polite Q&A: where do you work, do you have siblings, what's your favorite food. Nice, but going nowhere. Break the pattern and create actual playfulness.",
    goal: 'Shift from interview questions to banter she actually enjoys.',
    passCriteria: { minAvgScore: 3.2, minUserMessages: 5 },
    personaName: 'Priya',
    difficulty: 'Beginner',
    openingMessage: 'So… what do you do for work? 🙂',
    xpBonus: 20,
  },
  {
    slug: 'one-word-replies',
    category: 'Keeping It Alive',
    title: 'The One-Word Wall',
    brief:
      "Natasha's replies have shrunk to one or two words: 'haha', 'nice', 'yeah'. She hasn't unmatched, which means there's still a door. Find the thread that makes her invest again — or gracefully raise the stakes.",
    goal: 'Turn minimal replies into a real exchange.',
    passCriteria: { minAvgScore: 3.5, minUserMessages: 5 },
    personaName: 'Natasha',
    difficulty: 'Expert',
    openingMessage: 'haha yeah',
    xpBonus: 35,
  },
  // ── Making the Move ──────────────────────────────────────────────────────
  {
    slug: 'ask-for-the-date',
    category: 'Making the Move',
    title: 'Ask for the Date',
    brief:
      "The conversation with Isabella has been great for two days. The momentum is real but it won't last forever — text chemistry has a shelf life. Propose meeting up, concretely, without making it weird.",
    goal: 'Get to a confirmed plan: activity, day, and her enthusiastic yes.',
    passCriteria: { minAvgScore: 3.4, minUserMessages: 4 },
    personaName: 'Isabella',
    difficulty: 'Intermediate',
    xpBonus: 25,
  },
  {
    slug: 'number-close',
    category: 'Making the Move',
    title: 'Off the App',
    brief:
      'Chloe is engaged but you sense she barely opens the app. Move the conversation to phone numbers without triggering her scam-radar or sounding transactional.',
    goal: 'Earn the number exchange naturally.',
    passCriteria: { minAvgScore: 3.5, minUserMessages: 4 },
    personaName: 'Chloe',
    difficulty: 'Expert',
    xpBonus: 35,
  },
  {
    slug: 'plan-the-date',
    category: 'Making the Move',
    title: 'Plan Something Good',
    brief:
      "Maya said yes to meeting up — now she's watching how you handle the planning. 'Idk, whatever works for you' is a fail. Show decisiveness while reading her preferences.",
    goal: 'Land a specific, thoughtful plan she is excited about.',
    passCriteria: { minAvgScore: 3.4, minUserMessages: 4 },
    personaName: 'Maya',
    difficulty: 'Advanced',
    openingMessage: "Okay, I'm in. What did you have in mind? 🙂",
    xpBonus: 25,
  },
  // ── Handling Curveballs ──────────────────────────────────────────────────
  {
    slug: 'pass-her-test',
    category: 'Handling Curveballs',
    title: 'Pass the Test',
    brief:
      "Zara just hit you with 'You probably say that to all your matches.' It's a test — of composure, not honesty. Defensive = fail. Try-hard = fail. Handle it with calibrated confidence.",
    goal: 'Defuse the test and come out more attractive than before it.',
    passCriteria: { minAvgScore: 3.5, minUserMessages: 4 },
    personaName: 'Zara',
    difficulty: 'Expert',
    openingMessage: 'Smooth. You probably say that to all your matches 🙄',
    xpBonus: 35,
  },
  {
    slug: 'handle-the-flake',
    category: 'Handling Curveballs',
    title: 'The Flake',
    brief:
      "Elena cancelled your Thursday date two hours before, with a vague 'something came up, sorry!!'. Maybe real, maybe a soft no. Respond without sulking, lecturing, or instantly offering her your whole calendar.",
    goal: 'Keep your composure and either re-book on your terms or exit with grace.',
    passCriteria: { minAvgScore: 3.5, minUserMessages: 4 },
    personaName: 'Elena',
    difficulty: 'Expert',
    openingMessage: "heyy so sorry, something came up tonight — can't make it 😣",
    xpBonus: 35,
  },
  {
    slug: 'recover-the-fumble',
    category: 'Handling Curveballs',
    title: 'Recover the Fumble',
    brief:
      "You sent Amina a joke that landed completely wrong — she replied 'wow. okay.' and went quiet. Repair it without a five-paragraph apology and without doubling down.",
    goal: 'Acknowledge, recalibrate, and win back the conversation.',
    passCriteria: { minAvgScore: 3.4, minUserMessages: 4 },
    personaName: 'Amina',
    difficulty: 'Advanced',
    openingMessage: 'wow. okay.',
    xpBonus: 30,
  },
]

export function scenarioBySlug(slug: string): Scenario | undefined {
  return scenarios.find((s) => s.slug === slug)
}

export function personaForScenario(scenario: Scenario): Persona {
  const base = showcasePersonas.find((p) => p.name === scenario.personaName) ?? showcasePersonas[0]
  return {
    id: `scenario-${scenario.slug}`,
    name: base.name,
    age: base.age,
    ethnicity: base.ethnicity,
    hairColor: base.hairColor,
    hairLength: base.hairLength,
    eyeColor: base.eyeColor,
    bodyType: base.bodyType,
    height: base.height,
    style: base.style,
    glasses: base.glasses,
    tattoos: base.tattoos,
    piercings: base.piercings,
    personality: {
      extroversion: 50,
      rationality: 50,
      modernity: 60,
      independence: 60,
      playfulness: 55,
    },
    archetype: base.archetype,
    bio: base.bio,
    difficulty: scenario.difficulty,
    scenario: scenario.title,
    image: base.image,
  }
}

export interface ScenarioResult {
  passed: boolean
  avgScore: number
  reason: string
}

export function evaluateScenario(
  scenario: Scenario,
  analyses: { score: number }[],
  userMessageCount: number
): ScenarioResult {
  const avgScore =
    analyses.length > 0 ? analyses.reduce((s, a) => s + a.score, 0) / analyses.length : 0
  if (userMessageCount < scenario.passCriteria.minUserMessages) {
    return {
      passed: false,
      avgScore,
      reason: `Send at least ${scenario.passCriteria.minUserMessages} messages to complete this drill.`,
    }
  }
  if (avgScore < scenario.passCriteria.minAvgScore) {
    return {
      passed: false,
      avgScore,
      reason: `Average message score ${avgScore.toFixed(1)} — you need ${scenario.passCriteria.minAvgScore.toFixed(1)}+ to pass. Review the feedback and run it back.`,
    }
  }
  return {
    passed: true,
    avgScore,
    reason: `Average score ${avgScore.toFixed(1)} — drill passed.`,
  }
}

/** True when completing `slug` finishes every drill in its category. */
export function completesCategory(
  slug: string,
  completedSlugs: string[]
): boolean {
  const target = scenarioBySlug(slug)
  if (!target) return false
  const inCategory = scenarios.filter((s) => s.category === target.category)
  const done = new Set([...completedSlugs, slug])
  return inCategory.every((s) => done.has(s.slug))
}
