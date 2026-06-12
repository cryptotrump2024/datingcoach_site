import { z } from 'zod'

// ── Chat endpoint ──────────────────────────────────────────────────────────

export const chatRequestSchema = z.object({
  persona: z.object({
    name: z.string().min(1).max(60),
    age: z.number().int().min(18).max(80),
    archetype: z.string().max(60),
    bio: z.string().max(600).optional().default(''),
    difficulty: z.string().max(20),
    scenario: z.string().max(200).optional().default('Dating App Match'),
    personality: z
      .object({
        extroversion: z.number().min(0).max(100),
        rationality: z.number().min(0).max(100),
        modernity: z.number().min(0).max(100),
        independence: z.number().min(0).max(100),
        playfulness: z.number().min(0).max(100),
      })
      .optional(),
  }),
  scenarioBrief: z.string().max(1200).optional(),
  phase: z.number().int().min(0).max(4),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(60),
})

export type ChatRequest = z.infer<typeof chatRequestSchema>

export const chatResponseSchema = z.object({
  reply: z.string().min(1),
  analysis: z.object({
    subtext: z.string(),
    psychology: z.string(),
    advice: z.string(),
    score: z.number().int().min(1).max(5),
  }),
  suggestedPhase: z.number().int().min(0).max(4),
})

export type ChatResponse = z.infer<typeof chatResponseSchema>

// JSON Schema handed to the model via output_config.format — must mirror
// chatResponseSchema. Structured outputs require additionalProperties:false
// and don't support numeric min/max, so score bounds are enforced by zod
// after parsing (and clamped as a fallback).
export const chatOutputJsonSchema = {
  type: 'object',
  properties: {
    reply: {
      type: 'string',
      description: "The persona's next text message, in her authentic voice.",
    },
    analysis: {
      type: 'object',
      properties: {
        subtext: {
          type: 'string',
          description: "What the user's last message actually signaled to her.",
        },
        psychology: {
          type: 'string',
          description: 'The psychological principle at play, explained simply.',
        },
        advice: {
          type: 'string',
          description: 'One concrete, actionable improvement for the user.',
        },
        score: {
          type: 'integer',
          description: "Rating of the user's last message from 1 (poor) to 5 (excellent).",
        },
      },
      required: ['subtext', 'psychology', 'advice', 'score'],
      additionalProperties: false,
    },
    suggestedPhase: {
      type: 'integer',
      description:
        'Conversation phase to move to: 0=opener, 1=rapport, 2=attraction, 3=deepening, 4=closing. Advance only when earned; regress if the user is losing her.',
    },
  },
  required: ['reply', 'analysis', 'suggestedPhase'],
  additionalProperties: false,
} as const

// ── Profile analysis endpoint ──────────────────────────────────────────────

export const profileRequestSchema = z
  .object({
    imageBase64: z.string().max(8_000_000).optional(),
    imageMediaType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']).optional(),
    bioText: z.string().max(6000).optional(),
  })
  .refine((v) => v.imageBase64 || v.bioText, { message: 'Provide an image or bio text' })

export type ProfileRequest = z.infer<typeof profileRequestSchema>

export const profileResponseSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  photoScore: z.number().int().min(0).max(100),
  bioScore: z.number().int().min(0).max(100),
  firstImpression: z.string(),
  strengths: z.array(z.string()).min(1).max(8),
  fixes: z.array(z.string()).min(1).max(8),
  openers: z.array(z.string()).min(1).max(5),
  extractedBio: z.string(),
})

export type ProfileResponse = z.infer<typeof profileResponseSchema>

export const profileOutputJsonSchema = {
  type: 'object',
  properties: {
    overallScore: { type: 'integer', description: 'Overall dating profile score, 0-100.' },
    photoScore: {
      type: 'integer',
      description: 'Photo quality/appeal score 0-100 (50 if no photo visible).',
    },
    bioScore: { type: 'integer', description: 'Bio/prompts quality score 0-100.' },
    firstImpression: {
      type: 'string',
      description: 'Two-sentence honest first impression a match would form.',
    },
    strengths: {
      type: 'array',
      items: { type: 'string' },
      description: 'Specific things working well (3-5 items).',
    },
    fixes: {
      type: 'array',
      items: { type: 'string' },
      description: 'Highest-impact concrete improvements, most important first (3-5 items).',
    },
    openers: {
      type: 'array',
      items: { type: 'string' },
      description: 'Three tailored opening messages someone could send THIS profile.',
    },
    extractedBio: {
      type: 'string',
      description: 'Bio/prompt text read from the screenshot, or echo of provided text.',
    },
  },
  required: [
    'overallScore',
    'photoScore',
    'bioScore',
    'firstImpression',
    'strengths',
    'fixes',
    'openers',
    'extractedBio',
  ],
  additionalProperties: false,
} as const
