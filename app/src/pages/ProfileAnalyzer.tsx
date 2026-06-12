import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Camera,
  FileText,
  MessageCircle,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Share2,
  Save,
  RefreshCw,
  Link,
  Send,
  Heart,
  Star,
  TrendingUp,
  Clock,
  Users,
  Sun,
  Smile,
  Award,
  Lightbulb,
  ChevronRight,
  Image,
  Sparkles,
  BarChart3,
  Search,
  Eye,
  EyeOff,
  Type,
} from 'lucide-react'
import Tesseract from 'tesseract.js'
import { useStore } from '@/store'
import { getAIProfileAnalysis, type ProfileResponse } from '@/lib/ai-client'

// Downscale + JPEG-encode an image file for the vision API (keeps payloads small).
async function fileToApiImage(
  file: File
): Promise<{ data: string; mediaType: 'image/jpeg' } | null> {
  try {
    const bitmap = await createImageBitmap(file)
    const maxEdge = 1568
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    return { data: dataUrl.split(',')[1], mediaType: 'image/jpeg' }
  } catch {
    return null
  }
}

// Overlay the live AI result onto the locally generated analysis shape.
function mergeAnalysisWithAI(base: AnalysisResult, ai: ProfileResponse): AnalysisResult {
  return {
    ...base,
    overallScore: ai.overallScore,
    photoScore: ai.photoScore,
    bioScore: ai.bioScore,
    verdict: ai.firstImpression,
    photoAnalysis: {
      ...base.photoAnalysis,
      greenFlags: ai.strengths.slice(0, 4),
      communicates: ai.firstImpression,
    },
    bioAnalysis: {
      ...base.bioAnalysis,
      suggestions: ai.fixes,
    },
    strategy: {
      ...base.strategy,
      openingLines: ai.openers,
    },
    comparison: {
      photoQuality: ai.photoScore,
      bioQuality: ai.bioScore,
      overallAppeal: ai.overallScore,
    },
    ocr: base.ocr
      ? { ...base.ocr, bioSummary: ai.extractedBio || base.ocr.bioSummary }
      : base.ocr,
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface OcrAnalysis {
  extractedText: string
  detectedName: string
  detectedAge: string
  bioSummary: string
  keyPhrases: string[]
  redFlags: string[]
  greenFlags: string[]
  sentimentScore: number
}

interface AnalysisResult {
  id: string
  personaName: string
  overallScore: number
  verdict: string
  photoScore: number
  bioScore: number
  communicationScore: number
  photoAnalysis: {
    redFlags: string[]
    greenFlags: string[]
    communicates: string
  }
  bioAnalysis: {
    length: string
    tone: string
    redFlags: string[]
    greenFlags: string[]
    suggestions: string[]
  }
  communicationStyle: {
    responsePattern: string
    messageLength: string
    questionRatio: string
    emojiUsage: string
    attachmentStyle: string
    recommendations: string[]
  }
  strategy: {
    openingLines: string[]
    approach: string
    topics: string[]
    timing: string
    investment: string
    responseTemplate: string
  }
  comparison: {
    photoQuality: number
    bioQuality: number
    overallAppeal: number
  }
  ocr?: OcrAnalysis | null
}

// ─── Keyword Lists ───────────────────────────────────────────────────────────

const RED_FLAG_KEYWORDS = [
  'drama', 'toxic', "don't waste my time", 'be 6ft', 'must make',
  'no hookups', 'fluent in sarcasm', 'here for a good time',
  'entertain me', 'no fatties', 'swipe left if', 'must be tall',
  'must be 6', 'under 6ft', 'short guys', 'broke boys',
  'not here for', 'no time for', 'cash app', 'venmo me',
  'sugar daddy', 'looking for a sugar', 'follow me on',
  'my instagram', 'snapchat', 'no short', 'financ',
  'must have car', 'must have job', 'six figures',
]

const GREEN_FLAG_KEYWORDS = [
  'travel', 'adventure', 'foodie', 'dog mom', 'dog dad', 'gym',
  'hiking', 'reading', 'coffee', 'wine', 'music', 'family',
  'friends', 'kind', 'genuine', 'honest', 'funny', 'ambitious',
  'cooking', 'outdoor', 'yoga', 'running', 'fitness', 'healthy',
  'volunteer', 'helping', 'learning', 'student', 'passionate',
  'creative', 'art', 'photography', 'dancing', 'singing',
  'beach', 'mountain', 'nature', 'camping', 'road trip',
  'tattoo', 'book', 'movie', 'podcast', 'netflix',
]

// ─── Mock Analysis Personas ──────────────────────────────────────────────────

const mockAnalyses: AnalysisResult[] = [
  {
    id: 'sophisticated',
    personaName: 'Sophisticated Professional',
    overallScore: 86,
    verdict: 'Excellent profile - strong match potential',
    photoScore: 9,
    bioScore: 8,
    communicationScore: 8,
    photoAnalysis: {
      redFlags: ['No full-body shot'],
      greenFlags: [
        'Clear, well-lit photos',
        'Variety of settings',
        'Professional quality',
        'Genuine smile',
        'Social photos with friends',
      ],
      communicates: 'a confident, well-established individual who values quality experiences and meaningful connections. The professional setting suggests ambition and social status.',
    },
    bioAnalysis: {
      length: 'Just right',
      tone: 'Confident',
      redFlags: [],
      greenFlags: [
        'Humor and personality',
        'Conversation starters',
        'Specific interests',
        'Call-to-action',
        'Authentic and unique',
      ],
      suggestions: [
        'Add one more specific hobby that invites conversation',
        'Consider mentioning a favorite travel destination',
      ],
    },
    communicationStyle: {
      responsePattern: 'Thoughtful, 5-15 min delays',
      messageLength: 'Medium to long',
      questionRatio: 'High - asks follow-up questions',
      emojiUsage: 'Moderate and purposeful',
      attachmentStyle: 'Secure: balanced responses',
      recommendations: [
        'Match her thoughtful pace - avoid rapid-fire messages',
        'Ask about her career passions and travel experiences',
        'Share stories that show emotional depth',
      ],
    },
    strategy: {
      openingLines: [
        "Your taste in travel spots is impeccable. What's the most underrated city you've visited?",
        "I have to know - what's the story behind that third photo? The lighting is cinematic.",
        "You seem like someone who appreciates good wine and better conversation. What's your go-to order?",
      ],
      approach: 'Direct',
      topics: ['Travel experiences', 'Career passions', 'Fine dining recommendations'],
      timing: 'Evening, 7-9 PM',
      investment: 'High - strong match potential',
      responseTemplate: 'Keep it thoughtful and show genuine interest in her experiences. Ask open-ended questions that invite storytelling.',
    },
    comparison: { photoQuality: 85, bioQuality: 78, overallAppeal: 86 },
  },
  {
    id: 'party-girl',
    personaName: 'Social Butterfly',
    overallScore: 62,
    verdict: 'Good profile with room for improvement',
    photoScore: 6,
    bioScore: 5,
    communicationScore: 7,
    photoAnalysis: {
      redFlags: [
        'Group photos where unclear who the person is',
        'Sunglasses in every photo (hides eyes)',
        'Excessive filters',
      ],
      greenFlags: ['Social photos with friends', 'Variety of settings'],
      communicates: 'a fun-loving, highly social person who prioritizes having a good time. The constant group photos suggest she values her social circle highly.',
    },
    bioAnalysis: {
      length: 'Too short',
      tone: 'Playful',
      redFlags: ['Empty or just emojis', 'Copy-paste generic bio'],
      greenFlags: ['Humor and personality'],
      suggestions: [
        'Add substance beyond the party persona',
        'Mention a specific interest or passion project',
        'Include what you\'re looking for beyond "fun"',
      ],
    },
    communicationStyle: {
      responsePattern: 'Sporadic, varied timing',
      messageLength: 'Short to medium',
      questionRatio: 'Low - mostly statements',
      emojiUsage: 'Heavy emoji user',
      attachmentStyle: 'Anxious: frequent, long messages',
      recommendations: [
        'Keep messages light and fun initially',
        'Use humor to stand out from the crowd',
        'Suggest concrete plans rather than endless chatting',
      ],
    },
    strategy: {
      openingLines: [
        "I see you have excellent taste in weekend activities. What's your ideal Saturday night?",
        'Your group photos scream "fun friend group" - how do I get an invite to the next outing?',
        "Between all those adventures, what's your go-to chill spot?",
      ],
      approach: 'Humorous',
      topics: ['Upcoming events', 'Favorite venues', 'Weekend plans'],
      timing: 'Friday afternoon',
      investment: 'Medium - potential for fun connection',
      responseTemplate: 'Match her energy with something playful. Suggest a fun activity or venue rather than just small talk.',
    },
    comparison: { photoQuality: 60, bioQuality: 52, overallAppeal: 64 },
  },
  {
    id: 'shy-introvert',
    personaName: 'Quiet Creative',
    overallScore: 58,
    verdict: 'Average profile - several areas to work on',
    photoScore: 5,
    bioScore: 6,
    communicationScore: 5,
    photoAnalysis: {
      redFlags: ['All selfies (no social proof)', 'No full-body shot', 'Low resolution/blurry images'],
      greenFlags: ['Hobby/activity photos'],
      communicates: 'a reserved, creative individual who may be more comfortable in one-on-one settings. The solo photos suggest independence but may also indicate social anxiety.',
    },
    bioAnalysis: {
      length: 'Too short',
      tone: 'Boring',
      redFlags: ['Self-deprecating humor'],
      greenFlags: ['Specific interests'],
      suggestions: [
        'Replace self-deprecating jokes with confident statements',
        'Expand on your creative hobbies - give people hooks to start conversations',
        'Add one fun fact that surprises people',
      ],
    },
    communicationStyle: {
      responsePattern: 'Delayed, 30+ min',
      messageLength: 'Short',
      questionRatio: 'Low',
      emojiUsage: 'Minimal',
      attachmentStyle: 'Avoidant: short, delayed responses',
      recommendations: [
        "Be patient - don't double message if she takes time",
        'Ask about her creative interests specifically',
        'Suggest low-pressure activities like coffee or a gallery visit',
      ],
    },
    strategy: {
      openingLines: [
        "I noticed you're into [creative hobby]. I'd love to hear more about your process.",
        'Your photos have a really unique aesthetic. Are you a photographer or just have good taste?',
        "What's the last book/film/art piece that really moved you?",
      ],
      approach: 'Sincere',
      topics: ['Creative hobbies', 'Favorite books/films', 'Quiet activities'],
      timing: 'Weekday evenings',
      investment: 'Medium - takes patience but can be rewarding',
      responseTemplate: 'Show genuine curiosity about her interests. Avoid overwhelming her with messages and give her space to respond.',
    },
    comparison: { photoQuality: 55, bioQuality: 58, overallAppeal: 56 },
  },
  {
    id: 'fitness-enthusiast',
    personaName: 'Fitness Enthusiast',
    overallScore: 74,
    verdict: 'Good profile with room for improvement',
    photoScore: 7,
    bioScore: 7,
    communicationScore: 8,
    photoAnalysis: {
      redFlags: ['Bathroom mirror selfie'],
      greenFlags: [
        'Clear, well-lit photos',
        'Hobby/activity photos',
        'Professional quality',
        'Genuine smile',
      ],
      communicates: 'a disciplined, health-conscious individual who prioritizes physical wellness. The active lifestyle photos suggest energy, dedication, and self-care.',
    },
    bioAnalysis: {
      length: 'Just right',
      tone: 'Confident',
      redFlags: ['Listing requirements ("Must be 6ft+")'],
      greenFlags: ['Conversation starters', 'Specific interests', 'Call-to-action'],
      suggestions: [
        'Remove height requirements - they come across as exclusionary',
        'Balance fitness talk with other interests to show depth',
      ],
    },
    communicationStyle: {
      responsePattern: 'Consistent, 10-20 min',
      messageLength: 'Medium',
      questionRatio: 'Medium',
      emojiUsage: 'Moderate',
      attachmentStyle: 'Secure: balanced responses',
      recommendations: [
        'Bond over fitness goals and healthy lifestyle',
        'Suggest an active date like hiking or a fitness class',
        'Show your own commitment to wellness through conversation',
      ],
    },
    strategy: {
      openingLines: [
        'Your dedication to fitness is inspiring. What\'s your current fitness goal?',
        'I need a hiking buddy for [local trail]. Based on your profile, you\'d probably outpace me.',
        'What\'s your post-workout reward meal? I\'m always looking for healthy recipes.',
      ],
      approach: 'Direct',
      topics: ['Workout routines', 'Healthy recipes', 'Outdoor activities'],
      timing: 'Morning or early evening',
      investment: 'Medium-High - shared lifestyle values',
      responseTemplate: 'Show genuine interest in fitness without being superficial. Ask about goals and suggest active date ideas.',
    },
    comparison: { photoQuality: 72, bioQuality: 70, overallAppeal: 74 },
  },
  {
    id: 'career-focused',
    personaName: 'Ambitious Professional',
    overallScore: 71,
    verdict: 'Good profile with room for improvement',
    photoScore: 6,
    bioScore: 7,
    communicationScore: 7,
    photoAnalysis: {
      redFlags: ['All selfies (no social proof)', 'No full-body shot'],
      greenFlags: ['Clear, well-lit photos', 'Professional quality', 'Variety of settings'],
      communicates: 'an ambitious, career-driven individual who values success and growth. The professional attire and settings suggest she takes herself seriously.',
    },
    bioAnalysis: {
      length: 'Too long',
      tone: 'Serious',
      redFlags: ['Listing requirements'],
      greenFlags: ['Specific interests', 'Authentic and unique', 'Call-to-action'],
      suggestions: [
        'Trim the bio - keep it punchy and memorable',
        'Balance career talk with personal interests',
        "Add a touch of humor to show you don't take yourself too seriously",
      ],
    },
    communicationStyle: {
      responsePattern: 'Structured, business hours',
      messageLength: 'Medium to long',
      questionRatio: 'Medium',
      emojiUsage: 'Minimal',
      attachmentStyle: 'Secure: balanced responses',
      recommendations: [
        "Respect her time - she's likely busy during work hours",
        'Show ambition and drive in your own messages',
        'Suggest networking events or professional meetups',
      ],
    },
    strategy: {
      openingLines: [
        "I admire the career drive. What's the most exciting project you're working on right now?",
        'Work-life balance question: how do you unwind after a big week?',
        'Your profile says you\'re into [interest] - tell me more about that.',
      ],
      approach: 'Direct',
      topics: ['Career goals', 'Work-life balance', 'Professional growth'],
      timing: 'Lunch break or early evening',
      investment: 'Medium-High - compatible ambition levels',
      responseTemplate: 'Show respect for her time and ambition. Ask thoughtful questions about her work and suggest quality over quantity in meetups.',
    },
    comparison: { photoQuality: 68, bioQuality: 72, overallAppeal: 71 },
  },
  {
    id: 'artsy-creative',
    personaName: 'Artsy Creative',
    overallScore: 78,
    verdict: 'Good profile with room for improvement',
    photoScore: 8,
    bioScore: 8,
    communicationScore: 7,
    photoAnalysis: {
      redFlags: ['Excessive filters'],
      greenFlags: [
        'Clear, well-lit photos',
        'Variety of settings',
        'Hobby/activity photos',
        'Professional quality',
        'Genuine smile',
      ],
      communicates: 'a creative, expressive individual with an artistic eye. The curated aesthetic suggests attention to detail and a unique worldview.',
    },
    bioAnalysis: {
      length: 'Just right',
      tone: 'Playful',
      redFlags: [],
      greenFlags: [
        'Humor and personality',
        'Conversation starters',
        'Specific interests',
        'Authentic and unique',
      ],
      suggestions: [
        'Add a specific creative project you\'re proud of',
        'Mention what kind of person you\'re looking to meet',
      ],
    },
    communicationStyle: {
      responsePattern: 'Varied, artistic hours',
      messageLength: 'Medium',
      questionRatio: 'High',
      emojiUsage: 'Creative and varied',
      attachmentStyle: 'Secure: balanced responses',
      recommendations: [
        'Appreciate her creative perspective and ask thoughtful questions',
        'Share your own creative interests or curiosity about art',
        'Suggest creative date ideas like gallery openings or live music',
      ],
    },
    strategy: {
      openingLines: [
        'Your aesthetic is incredible. Where do you find inspiration?',
        'I have to ask - what\'s the story behind that artistic shot in your profile?',
        'If you could collaborate with any artist, living or dead, who would it be?',
      ],
      approach: 'Sincere',
      topics: ['Art and creativity', 'Music and culture', 'Inspirations'],
      timing: 'Afternoon or late evening',
      investment: 'High - creative connections are rare',
      responseTemplate: 'Show genuine appreciation for her creative perspective. Ask thoughtful questions and share your own artistic curiosity.',
    },
    comparison: { photoQuality: 82, bioQuality: 80, overallAppeal: 78 },
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAnalysisFromInput(filename: string): AnalysisResult {
  const lower = filename.toLowerCase()
  if (lower.includes('sophisticated') || lower.includes('prof')) return mockAnalyses[0]
  if (lower.includes('party') || lower.includes('social')) return mockAnalyses[1]
  if (lower.includes('shy') || lower.includes('introvert') || lower.includes('quiet')) return mockAnalyses[2]
  if (lower.includes('fit') || lower.includes('gym') || lower.includes('sport')) return mockAnalyses[3]
  if (lower.includes('career') || lower.includes('work') || lower.includes('boss')) return mockAnalyses[4]
  if (lower.includes('art') || lower.includes('creative') || lower.includes('music')) return mockAnalyses[5]
  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)]
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#059669'
  if (score >= 60) return '#D97706'
  if (score >= 40) return '#F97316'
  return '#EF4444'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Average'
  if (score >= 20) return 'Below Average'
  return 'Critical'
}

// ─── OCR Text Parsing ────────────────────────────────────────────────────────

function parseExtractedText(text: string): OcrAnalysis {
  const lowerText = text.toLowerCase()
  const lines = text.split('\n').filter((l) => l.trim().length > 0)

  // Detect name: usually first short line (1-2 words, no numbers, capitalized)
  let detectedName = 'Not detected'
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim()
    if (
      trimmed.length > 1 &&
      trimmed.length < 30 &&
      !/\d/.test(trimmed) &&
      trimmed[0] === trimmed[0].toUpperCase() &&
      !trimmed.includes('@') &&
      !trimmed.includes('http')
    ) {
      const words = trimmed.split(/\s+/)
      if (words.length >= 1 && words.length <= 4) {
        detectedName = trimmed
        break
      }
    }
  }

  // Detect age: look for age patterns
  let detectedAge = 'Not detected'
  const agePatterns = [
    /(\d+)\s*(?:years?\s*old|y\.?o|y\/o)/i,
    /(?:age|aged)\s*(\d+)/i,
    /(\d{2})\s*[\u2022\u00B7]\s*/,  // age dot pattern like "25 •"
    /[\u2022\u00B7]\s*(\d{2})/,  // • 25
    /^(\d{2})$/,  // line with just 2 digits
  ]
  for (const pattern of agePatterns) {
    const match = text.match(pattern)
    if (match) {
      const age = parseInt(match[1], 10)
      if (age >= 18 && age <= 80) {
        detectedAge = String(age)
        break
      }
    }
  }

  // Bio summary: longest meaningful paragraph
  let bioSummary = ''
  let maxLen = 0
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length > maxLen && trimmed.length > 20 && trimmed.split(/\s+/).length >= 4) {
      maxLen = trimmed.length
      bioSummary = trimmed
    }
  }
  if (!bioSummary && lines.length > 0) {
    bioSummary = lines.slice(0, Math.min(5, lines.length)).join(' ')
  }

  // Find red flags in text
  const foundRedFlags = RED_FLAG_KEYWORDS.filter((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  )

  // Find green flags in text
  const foundGreenFlags = GREEN_FLAG_KEYWORDS.filter((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  )

  // Extract key phrases (lines that look like bio content)
  const keyPhrases = lines
    .filter((line) => {
      const trimmed = line.trim()
      return (
        trimmed.length > 10 &&
        trimmed.length < 200 &&
        trimmed.split(/\s+/).length >= 3
      )
    })
    .slice(0, 8)

  // Calculate sentiment score (-50 to +50)
  const redWeight = foundRedFlags.length * 8
  const greenWeight = foundGreenFlags.length * 5
  const sentimentScore = Math.max(-50, Math.min(50, greenWeight - redWeight))

  return {
    extractedText: text,
    detectedName,
    detectedAge,
    bioSummary,
    keyPhrases,
    redFlags: foundRedFlags,
    greenFlags: foundGreenFlags,
    sentimentScore,
  }
}

function mergeAnalysisWithOcr(baseAnalysis: AnalysisResult, ocr: OcrAnalysis): AnalysisResult {
  // Adjust score based on OCR findings
  let scoreAdjustment = 0

  // Boost for text found (higher confidence)
  if (ocr.extractedText.length > 100) scoreAdjustment += 3
  if (ocr.extractedText.length > 300) scoreAdjustment += 2

  // Red flags reduce score
  if (ocr.redFlags.length > 0) {
    scoreAdjustment -= Math.min(15, ocr.redFlags.length * 5)
  }

  // Green flags boost score
  if (ocr.greenFlags.length > 0) {
    scoreAdjustment += Math.min(10, ocr.greenFlags.length * 2)
  }

  const newScore = Math.max(20, Math.min(98, baseAnalysis.overallScore + scoreAdjustment))
  const newBioScore = Math.max(1, Math.min(10, baseAnalysis.bioScore + (scoreAdjustment > 0 ? 1 : scoreAdjustment < 0 ? -1 : 0)))

  // Merge bio analysis
  const mergedBioRedFlags = [
    ...baseAnalysis.bioAnalysis.redFlags,
    ...ocr.redFlags.map((f) => `Detected in text: "${f}"`),
  ]
  const mergedBioGreenFlags = [
    ...baseAnalysis.bioAnalysis.greenFlags,
    ...ocr.greenFlags.map((f) => `Detected in text: "${f}"`),
  ]

  return {
    ...baseAnalysis,
    overallScore: Math.round(newScore),
    bioScore: newBioScore,
    verdict:
      ocr.redFlags.length > 2
        ? 'Several red flags detected in bio text - proceed with caution'
        : ocr.greenFlags.length > 3
        ? 'Strong profile with positive bio indicators'
        : baseAnalysis.verdict,
    bioAnalysis: {
      ...baseAnalysis.bioAnalysis,
      redFlags: mergedBioRedFlags,
      greenFlags: mergedBioGreenFlags,
      tone: ocr.sentimentScore > 10 ? 'Positive' : ocr.sentimentScore < -10 ? 'Concerning' : baseAnalysis.bioAnalysis.tone,
    },
    communicationStyle: {
      ...baseAnalysis.communicationStyle,
      recommendations: [
        ...baseAnalysis.communicationStyle.recommendations,
        ...(ocr.redFlags.length > 0 ? ['Pay attention to concerning language patterns in their bio.'] : []),
        ...(ocr.greenFlags.length > 0 ? ['Their bio mentions shared interests - great conversation starters!'] : []),
      ],
    },
    strategy: {
      ...baseAnalysis.strategy,
      topics: [
        ...baseAnalysis.strategy.topics,
        ...ocr.greenFlags.slice(0, 3).map((f) => f.charAt(0).toUpperCase() + f.slice(1)),
      ],
    },
    ocr,
  }
}

// ─── Animated Score Circle ───────────────────────────────────────────────────

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const progress = animatedScore / 100
  const strokeDashoffset = circumference * (1 - progress)
  const color = getScoreColor(score)

  useEffect(() => {
    let frame: number
    const duration = 1500
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setAnimatedScore(Math.round(score * eased))
      if (t < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[170px] h-[170px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 170 170">
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke="rgba(28, 25, 23, 0.08)"
            strokeWidth="10"
          />
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-heading-xl text-text-primary">{animatedScore}</span>
          <span className="text-caption text-text-muted uppercase tracking-wider">{label}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Score Bar ───────────────────────────────────────────────────────────────

function ScoreBar({ label, score, max = 10, color }: { label: string; score: number; max?: number; color?: string }) {
  const pct = (score / max) * 100
  const barColor = color || getScoreColor(pct)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-body-sm text-text-secondary">{label}</span>
        <span className="text-mono text-text-primary">{score}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        />
      </div>
    </div>
  )
}

// ─── Comparison Bar ──────────────────────────────────────────────────────────

function ComparisonBar({ label, average, current }: { label: string; average: number; current: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-body-sm text-text-secondary">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-caption text-text-muted">Avg {average}%</span>
          <span className="text-mono text-[#FBBF24] font-medium">{current}%</span>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-bg-tertiary overflow-hidden relative">
        <div
          className="absolute top-0 h-full rounded-full bg-stone-400 opacity-40"
          style={{ width: `${average}%` }}
        />
        <motion.div
          className="h-full rounded-full relative z-10"
          style={{ background: 'linear-gradient(90deg, #E11D48, #F59E0B)' }}
          initial={{ width: 0 }}
          animate={{ width: `${current}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 }}
        />
      </div>
    </div>
  )
}

// ─── Tab Button ──────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-body-sm font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-[#E11D48] to-[#F59E0B] text-white shadow-glow-rose'
          : 'text-text-secondary hover:text-text-primary hover:bg-[rgba(28, 25, 23, 0.06)]'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}

// ─── Flag Card ───────────────────────────────────────────────────────────────

function FlagCard({ type, text }: { type: 'red' | 'green'; text: string }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border ${
        type === 'red'
          ? 'border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.06)]'
          : 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.06)]'
      }`}
    >
      {type === 'red' ? (
        <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
      ) : (
        <Shield className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
      )}
      <span className={`text-body-sm ${type === 'red' ? 'text-[#FBBF24]' : 'text-text-secondary'}`}>{text}</span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProfileAnalyzer() {
  const [phase, setPhase] = useState<'upload' | 'loading' | 'results'>('upload')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<{ name: string; size: string; dimensions: string; format: string } | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState(0)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [aiPowered, setAiPowered] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // OCR state
  const [ocrText, setOcrText] = useState<string | null>(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [showExtractedText, setShowExtractedText] = useState(false)
  const [ocrError, setOcrError] = useState(false)

  const stages = [
    'Uploading image...',
    'Scanning and reading text from image...',
    'Analyzing photos and bio...',
    'Evaluating social signals...',
    'Generating insights...',
  ]

  const tabs = [
    { label: 'Photo Analysis', icon: Camera },
    { label: 'Bio Analysis', icon: FileText },
    { label: 'Communication', icon: MessageCircle },
    { label: 'Strategy', icon: Zap },
    { label: 'Extracted Text', icon: Search },
  ]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const runOCR = useCallback(async (objectUrl: string): Promise<string | null> => {
    try {
      const result = await Tesseract.recognize(objectUrl, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100))
          }
        },
      })
      const extractedText = result.data.text
      if (extractedText.trim().length < 20) {
        return null
      }
      return extractedText
    } catch (err) {
      console.error('OCR failed:', err)
      return null
    }
  }, [])

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return
      const objectUrl = URL.createObjectURL(file)
      setUploadedImage(objectUrl)
      setImageInfo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        dimensions: 'Processing...',
        format: file.type.split('/')[1].toUpperCase(),
      })
      setOcrText(null)
      setOcrError(false)
      setOcrProgress(0)

      const img: HTMLImageElement = document.createElement('img')
      img.onload = () => {
        setImageInfo((prev) =>
          prev ? { ...prev, dimensions: `${img.width} x ${img.height}` } : null
        )
      }
      img.src = objectUrl

      // Start loading phase
      setPhase('loading')
      setLoadingProgress(0)
      setLoadingStage(0)
      setAiPowered(false)

      // Live AI analysis runs in parallel with local OCR; whichever path
      // succeeds shapes the result (AI preferred, OCR engine as fallback).
      const aiPromise = fileToApiImage(file).then((img) =>
        img ? getAIProfileAnalysis({ imageBase64: img.data, imageMediaType: img.mediaType }) : null
      )

      // Run OCR
      setLoadingStage(1)
      const extractedText = await runOCR(objectUrl)

      // Build analysis
      const baseResult = getAnalysisFromInput(file.name)

      let result = baseResult
      if (extractedText) {
        setOcrText(extractedText)
        const ocrAnalysis = parseExtractedText(extractedText)
        result = mergeAnalysisWithOcr(baseResult, ocrAnalysis)
      } else {
        setOcrError(true)
        setOcrText(null)
      }

      const ai = await aiPromise
      if (ai) {
        result = mergeAnalysisWithAI(result, ai)
        setAiPowered(true)
        if (!extractedText && ai.extractedBio) {
          setOcrText(ai.extractedBio)
          setOcrError(false)
        }
      }
      setAnalysis(result)
    },
    [runOCR]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) processFile(files[0])
    },
    [processFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0])
      }
    },
    [processFile]
  )

  const handleUrlAnalyze = useCallback(() => {
    if (!urlInput.trim()) return
    setUploadedImage(null)
    setImageInfo({
      name: 'Profile from URL',
      size: 'N/A',
      dimensions: 'N/A',
      format: 'URL',
    })
    setOcrText(null)
    setOcrError(false)
    setOcrProgress(0)
    const result = getAnalysisFromInput(urlInput)
    setAnalysis(result)
    setPhase('loading')
    setLoadingProgress(0)
    setLoadingStage(0)
  }, [urlInput])

  // Loading animation
  useEffect(() => {
    if (phase !== 'loading') return

    const timers: ReturnType<typeof setTimeout>[] = []

    // Stage 0: "Uploading image..." (0-10%) - already set on start
    const t0 = setTimeout(() => setLoadingProgress(10), 200)
    timers.push(t0)

    // Stage 1: OCR progress (10-60%) - driven by ocrProgress
    const ocrInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 10) return 10
        if (prev >= 60) return 60
        return 10 + Math.round(ocrProgress * 0.5)
      })
    }, 300)
    timers.push(ocrInterval)

    // After a reasonable OCR-like delay, advance stages
    stages.slice(2).forEach((_, index) => {
      const timer = setTimeout(() => {
        setLoadingStage(index + 2)
        setLoadingProgress(60 + (index + 1) * 10)
      }, 3000 + (index + 1) * 700)
      timers.push(timer)
    })

    const finishTimer = setTimeout(() => {
      setPhase('results')
      setLoadingProgress(100)
    }, 3000 + (stages.length - 2) * 700 + 500)
    timers.push(finishTimer)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(ocrInterval)
    }
  }, [phase, ocrProgress])

  const handleShare = useCallback(() => {
    if (!analysis) return
    const summary = `Profile Analysis: ${analysis.personaName}\nOverall Score: ${analysis.overallScore}/100\nVerdict: ${analysis.verdict}`
    navigator.clipboard.writeText(summary).catch(() => {})
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }, [analysis])

  const saveProfileAnalysis = useStore((s) => s.saveProfileAnalysis)

  const handleSave = useCallback(() => {
    if (!analysis) return
    const history = JSON.parse(localStorage.getItem('profileAnalyses') || '[]')
    history.push({ ...analysis, savedAt: Date.now() })
    localStorage.setItem('profileAnalyses', JSON.stringify(history))
    saveProfileAnalysis(analysis.id, { ...analysis, savedAt: Date.now() })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }, [analysis, saveProfileAnalysis])

  const handleReset = useCallback(() => {
    setPhase('upload')
    setUploadedImage(null)
    setImageInfo(null)
    setAnalysis(null)
    setActiveTab(0)
    setLoadingProgress(0)
    setLoadingStage(0)
    setUrlInput('')
    setOcrText(null)
    setOcrError(false)
    setOcrProgress(0)
    setShowExtractedText(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <div className="min-h-[100dvh] bg-bg-primary pt-[72px]">
      {/* ── Hero Header ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-[800px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-caption text-[#F59E0B] uppercase tracking-widest">AI-Powered Analysis</span>
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h1 className="text-display-section mb-6">
              <span className="gradient-text">Profile Intelligence Analyzer</span>
            </h1>
            <p className="text-body-lg text-text-secondary max-w-[600px] mx-auto">
              Upload any dating profile screenshot and get deep AI analysis on what works, what doesn't, and how to improve
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {/* ── Upload Phase ───────────────────────────────────────── */}
          {phase === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="space-y-8"
            >
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`glass-card cursor-pointer transition-all duration-300 p-12 md:p-16 text-center group ${
                  dragOver
                    ? 'border-[rgba(225,29,72,0.5)] shadow-[0_0_40px_rgba(225,29,72,0.2)]'
                    : 'hover:border-[rgba(255,255,255,0.12)]'
                }`}
                style={{
                  borderStyle: dragOver ? 'solid' : 'dashed',
                  borderWidth: '2px',
                  borderColor: dragOver
                    ? 'rgba(225, 29, 72, 0.5)'
                    : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <motion.div
                  className="flex flex-col items-center gap-4"
                  animate={dragOver ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(225,29,72,0.1)] flex items-center justify-center">
                    <Upload
                      className={`w-8 h-8 transition-colors duration-300 ${
                        dragOver ? 'text-[#E11D48]' : 'text-[#BE123C]'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-body-lg text-text-primary font-medium">
                      Drag & drop a profile screenshot here
                    </p>
                    <p className="text-body text-text-secondary mt-1">
                      or <span className="text-[#BE123C] underline underline-offset-2">click to browse</span>
                    </p>
                  </div>
                  <p className="text-caption text-text-muted mt-2">
                    Supports: JPG, PNG, WebP (max 10MB)
                  </p>
                  <p className="text-caption text-text-secondary bg-[rgba(225,29,72,0.06)] px-3 py-1.5 rounded-full mt-1 flex items-center gap-1.5">
                    <Type className="w-3 h-3 text-[#BE123C]" />
                    Tip: For best results, upload a screenshot that includes the person's bio/description text
                  </p>
                </motion.div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* URL Input Alternative */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link className="w-4 h-4 text-text-secondary" />
                  <span className="text-body-sm text-text-secondary">Or paste a profile URL</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlAnalyze()}
                    placeholder="https://tinder.com/profile/..."
                    className="flex-1 bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] rounded-xl px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[rgba(225,29,72,0.4)] transition-colors"
                  />
                  <button
                    onClick={handleUrlAnalyze}
                    disabled={!urlInput.trim()}
                    className="btn-gradient text-white text-body-sm font-semibold px-6 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Loading Phase ──────────────────────────────────────── */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-10 md:p-16"
            >
              <div className="text-center mb-10">
                <motion.div
                  className="w-20 h-20 rounded-full bg-[rgba(225,29,72,0.1)] flex items-center justify-center mx-auto mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BarChart3 className="w-10 h-10 text-[#E11D48]" />
                </motion.div>
                <h2 className="text-heading-lg text-text-primary mb-2">Analyzing Profile...</h2>
                <p className="text-body-sm text-text-secondary">
                  {loadingStage === 1 ? 'Reading text with OCR engine...' : 'Our AI is examining every detail'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-10">
                <div className="h-3 rounded-full bg-bg-tertiary overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #E11D48, #F59E0B, #8B5CF6)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                  {/* Scanning line effect */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ left: ['-20%', '120%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-caption text-text-muted">{loadingProgress}%</span>
                  <span className="text-caption text-text-muted">100%</span>
                </div>
              </div>

              {/* Text Detected Preview Panel */}
              {ocrText && loadingStage >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.06)] p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="text-body-sm text-[#10B981] font-medium">Text Detected</span>
                    <span className="text-caption text-text-muted ml-auto">
                      {ocrText.length} characters
                    </span>
                  </div>
                  <div className="max-h-[120px] overflow-y-auto rounded-lg bg-bg-primary p-3 font-mono text-xs text-text-secondary leading-relaxed">
                    {ocrText.slice(0, 500)}{ocrText.length > 500 ? '...' : ''}
                  </div>
                </motion.div>
              )}

              {/* OCR in progress indicator */}
              {!ocrText && loadingStage === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8 rounded-xl border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.06)] p-4"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-[#3B82F6]"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    <span className="text-body-sm text-[#3B82F6] font-medium">
                      OCR Engine: scanning image pixels...
                    </span>
                    <span className="text-caption text-text-muted ml-auto">
                      {ocrProgress}%
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Stages */}
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: loadingStage >= index ? 1 : 0.4,
                      x: 0,
                    }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                      {loadingStage > index ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                        </motion.div>
                      ) : loadingStage === index ? (
                        <motion.div
                          className="w-3 h-3 rounded-full bg-[#E11D48]"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-bg-tertiary border border-stone-300" />
                      )}
                    </div>
                    <span
                      className={`text-body-sm transition-colors duration-300 ${
                        loadingStage > index
                          ? 'text-[#10B981]'
                          : loadingStage === index
                          ? 'text-text-primary'
                          : 'text-text-muted'
                      }`}
                    >
                      {stage}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Results Phase ──────────────────────────────────────── */}
          {phase === 'results' && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Overall Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="glass-card-elevated p-8 md:p-10"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ScoreCircle score={analysis.overallScore} label="Profile Score" />
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-heading-lg text-text-primary mb-2">
                      {analysis.personaName}
                    </h2>
                    <p className="text-body text-text-secondary mb-4">{analysis.verdict}</p>
                    {imageInfo && (
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="text-caption text-text-muted bg-bg-tertiary px-3 py-1 rounded-full">
                          {imageInfo.format}
                        </span>
                        <span className="text-caption text-text-muted bg-bg-tertiary px-3 py-1 rounded-full">
                          {imageInfo.dimensions}
                        </span>
                        <span className="text-caption text-text-muted bg-bg-tertiary px-3 py-1 rounded-full">
                          {imageInfo.size}
                        </span>
                        <span
                          className="text-caption px-3 py-1 rounded-full inline-flex items-center gap-1.5"
                          style={{
                            background: aiPowered ? 'rgba(5, 150, 105, 0.1)' : '#EDE6DA',
                            color: aiPowered ? '#059669' : '#A8A29E',
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: aiPowered ? '#059669' : '#A8A29E' }}
                          />
                          {aiPowered ? 'Live AI analysis' : 'Standard analysis'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[rgba(28, 25, 23, 0.08)]">
                  <ScoreBar label="Photo Quality" score={analysis.photoScore} />
                  <ScoreBar label="Bio Quality" score={analysis.bioScore} />
                  <ScoreBar label="Communication" score={analysis.communicationScore} />
                </div>
              </motion.div>

              {/* Uploaded Image Preview */}
              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="glass-card p-4 overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Image className="w-4 h-4 text-text-secondary" />
                    <span className="text-body-sm text-text-secondary">Analyzed Image</span>
                  </div>
                  <img
                    src={uploadedImage}
                    alt="Uploaded profile"
                    className="w-full max-h-[300px] object-contain rounded-xl"
                  />
                </motion.div>
              )}

              {/* Collapsible Extracted Text Preview */}
              {analysis.ocr && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="glass-card overflow-hidden"
                >
                  <button
                    onClick={() => setShowExtractedText((prev) => !prev)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#8B5CF6]" />
                      <span className="text-body-sm text-text-primary font-medium">View Extracted Text</span>
                      <span className="text-caption text-text-muted">
                        ({analysis.ocr.extractedText.length} chars)
                      </span>
                    </div>
                    {showExtractedText ? (
                      <EyeOff className="w-4 h-4 text-text-muted" />
                    ) : (
                      <Eye className="w-4 h-4 text-text-muted" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showExtractedText && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <div className="max-h-[300px] overflow-y-auto rounded-xl bg-bg-primary border border-[rgba(28, 25, 23, 0.08)] p-4 font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                            {analysis.ocr.extractedText}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* OCR Fallback Warning */}
              {ocrError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="glass-card p-4 border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.06)]"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-body-sm text-[#FBBF24] font-medium mb-1">Limited Text Detected</p>
                      <p className="text-body-sm text-text-secondary">
                        We couldn't read enough text from this image. Try uploading a clearer screenshot with visible bio text for more accurate analysis.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tabbed Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card overflow-hidden"
              >
                {/* Tab Navigation */}
                <div className="flex gap-2 p-4 overflow-x-auto border-b border-[rgba(28, 25, 23, 0.08)]">
                  {tabs.map((tab, index) => (
                    <TabButton
                      key={tab.label}
                      active={activeTab === index}
                      onClick={() => setActiveTab(index)}
                      icon={tab.icon}
                      label={tab.label}
                    />
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    {/* ── Tab 1: Photo Analysis ──────────────── */}
                    {activeTab === 0 && (
                      <motion.div
                        key="photo"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        <ScoreBar label="Photo Quality Score" score={analysis.photoScore} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Red Flags */}
                          <div>
                            <h3 className="text-heading-sm text-[#FBBF24] mb-4 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Red Flags Detected
                            </h3>
                            <div className="space-y-3">
                              {analysis.photoAnalysis.redFlags.length > 0 ? (
                                analysis.photoAnalysis.redFlags.map((flag, i) => (
                                  <FlagCard key={i} type="red" text={flag} />
                                ))
                              ) : (
                                <p className="text-body-sm text-text-muted">No major red flags detected</p>
                              )}
                            </div>
                          </div>

                          {/* Green Flags */}
                          <div>
                            <h3 className="text-heading-sm text-[#10B981] mb-4 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Green Flags
                            </h3>
                            <div className="space-y-3">
                              {analysis.photoAnalysis.greenFlags.map((flag, i) => (
                                <FlagCard key={i} type="green" text={flag} />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.2)] rounded-xl p-5">
                          <h4 className="text-heading-sm text-[#8B5CF6] mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            What Photos Communicate
                          </h4>
                          <p className="text-body-sm text-text-secondary leading-relaxed">
                            These photos suggest {analysis.photoAnalysis.communicates}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Tab 2: Bio Analysis ────────────────── */}
                    {activeTab === 1 && (
                      <motion.div
                        key="bio"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        <ScoreBar label="Bio Quality Score" score={analysis.bioScore} />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-bg-tertiary rounded-xl p-4 text-center">
                            <span className="text-caption text-text-muted block mb-1">Length</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.bioAnalysis.length}</span>
                          </div>
                          <div className="bg-bg-tertiary rounded-xl p-4 text-center">
                            <span className="text-caption text-text-muted block mb-1">Tone</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.bioAnalysis.tone}</span>
                          </div>
                          <div className="bg-bg-tertiary rounded-xl p-4 text-center">
                            <span className="text-caption text-text-muted block mb-1">Red Flags</span>
                            <span className="text-body-sm text-[#FBBF24] font-medium">{analysis.bioAnalysis.redFlags.length}</span>
                          </div>
                          <div className="bg-bg-tertiary rounded-xl p-4 text-center">
                            <span className="text-caption text-text-muted block mb-1">Green Flags</span>
                            <span className="text-body-sm text-[#10B981] font-medium">{analysis.bioAnalysis.greenFlags.length}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-heading-sm text-[#FBBF24] mb-4 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Red Flags
                            </h3>
                            <div className="space-y-3">
                              {analysis.bioAnalysis.redFlags.length > 0 ? (
                                analysis.bioAnalysis.redFlags.map((flag, i) => (
                                  <FlagCard key={i} type="red" text={flag} />
                                ))
                              ) : (
                                <p className="text-body-sm text-text-muted">No red flags detected</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-heading-sm text-[#10B981] mb-4 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Green Flags
                            </h3>
                            <div className="space-y-3">
                              {analysis.bioAnalysis.greenFlags.map((flag, i) => (
                                <FlagCard key={i} type="green" text={flag} />
                              ))}
                            </div>
                          </div>
                        </div>

                        {analysis.bioAnalysis.suggestions.length > 0 && (
                          <div className="bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.2)] rounded-xl p-5">
                            <h4 className="text-heading-sm text-[#3B82F6] mb-3 flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Suggested Bio Improvements
                            </h4>
                            <ul className="space-y-2">
                              {analysis.bioAnalysis.suggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-body-sm text-text-secondary">
                                  <ChevronRight className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── Tab 3: Communication Style ─────────── */}
                    {activeTab === 2 && (
                      <motion.div
                        key="communication"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        <ScoreBar label="Communication Score" score={analysis.communicationScore} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-bg-tertiary rounded-xl p-4">
                            <Clock className="w-4 h-4 text-text-secondary mb-2" />
                            <span className="text-caption text-text-muted block">Response Pattern</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.communicationStyle.responsePattern}</span>
                          </div>
                          <div className="bg-bg-tertiary rounded-xl p-4">
                            <FileText className="w-4 h-4 text-text-secondary mb-2" />
                            <span className="text-caption text-text-muted block">Message Length</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.communicationStyle.messageLength}</span>
                          </div>
                          <div className="bg-bg-tertiary rounded-xl p-4">
                            <TrendingUp className="w-4 h-4 text-text-secondary mb-2" />
                            <span className="text-caption text-text-muted block">Question Ratio</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.communicationStyle.questionRatio}</span>
                          </div>
                          <div className="bg-bg-tertiary rounded-xl p-4">
                            <Smile className="w-4 h-4 text-text-secondary mb-2" />
                            <span className="text-caption text-text-muted block">Emoji Usage</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.communicationStyle.emojiUsage}</span>
                          </div>
                        </div>

                        <div className="bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.2)] rounded-xl p-5">
                          <h4 className="text-heading-sm text-[#8B5CF6] mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Attachment Style: {analysis.communicationStyle.attachmentStyle}
                          </h4>
                          <p className="text-body-sm text-text-secondary">
                            This communication pattern suggests a{' '}
                            {analysis.communicationStyle.attachmentStyle.split(':')[0].toLowerCase()} attachment style.
                            {analysis.communicationStyle.attachmentStyle.includes('Secure')
                              ? ' This is a healthy pattern that indicates emotional availability.'
                              : analysis.communicationStyle.attachmentStyle.includes('Anxious')
                              ? ' This may indicate a need for reassurance and frequent connection.'
                              : ' This may indicate difficulty with vulnerability and closeness.'}
                          </p>
                        </div>

                        <div className="bg-[rgba(20,184,166,0.08)] border border-[rgba(20,184,166,0.2)] rounded-xl p-5">
                          <h4 className="text-heading-sm text-[#14B8A6] mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {analysis.communicationStyle.recommendations.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-body-sm text-text-secondary">
                                <ChevronRight className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Tab 4: Strategy ────────────────────── */}
                    {activeTab === 3 && (
                      <motion.div
                        key="strategy"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        {/* Opening Lines */}
                        <div>
                          <h3 className="text-heading-md text-text-primary mb-4 flex items-center gap-2">
                            <Send className="w-5 h-5 text-[#E11D48]" />
                            Opening Line Suggestions
                          </h3>
                          <div className="space-y-3">
                            {analysis.strategy.openingLines.map((line, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-4 flex items-start gap-3"
                              >
                                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#E11D48] to-[#F59E0B] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {i + 1}
                                </span>
                                <p className="text-body-sm text-text-secondary">{line}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-bg-tertiary rounded-xl p-4">
                            <Zap className="w-4 h-4 text-[#F59E0B] mb-2" />
                            <span className="text-caption text-text-muted block">Approach Strategy</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.strategy.approach}</span>
                          </div>
                          <div className="bg-bg-tertiary rounded-xl p-4">
                            <Clock className="w-4 h-4 text-[#14B8A6] mb-2" />
                            <span className="text-caption text-text-muted block">Best Timing</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.strategy.timing}</span>
                          </div>
                          <div className="bg-bg-tertiary rounded-xl p-4">
                            <Award className="w-4 h-4 text-[#8B5CF6] mb-2" />
                            <span className="text-caption text-text-muted block">Investment Level</span>
                            <span className="text-body-sm text-text-primary font-medium">{analysis.strategy.investment}</span>
                          </div>
                        </div>

                        {/* Topic Suggestions */}
                        <div>
                          <h3 className="text-heading-sm text-text-primary mb-3 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-[#BE123C]" />
                            Conversation Topics
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {analysis.strategy.topics.map((topic, i) => (
                              <span
                                key={i}
                                className="px-4 py-2 rounded-full bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] text-body-sm text-text-secondary"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Response Template */}
                        <div className="bg-[rgba(225,29,72,0.08)] border border-[rgba(225,29,72,0.2)] rounded-xl p-5">
                          <h4 className="text-heading-sm text-[#BE123C] mb-2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Custom Response Template
                          </h4>
                          <p className="text-body-sm text-text-secondary leading-relaxed">{analysis.strategy.responseTemplate}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Tab 5: Extracted Text (OCR) ────────── */}
                    {activeTab === 4 && (
                      <motion.div
                        key="extracted-text"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                        {analysis.ocr ? (
                          <>
                            {/* OCR Status Badge */}
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]">
                                <span className="text-body-sm text-[#10B981] font-medium flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Text Successfully Extracted
                                </span>
                              </div>
                              <span className="text-caption text-text-muted">
                                {analysis.ocr.extractedText.length} characters analyzed
                              </span>
                            </div>

                            {/* Key Information Detected */}
                            <div className="glass-card p-6">
                              <h3 className="text-heading-sm text-text-primary mb-5 flex items-center gap-2">
                                <Search className="w-4 h-4 text-[#8B5CF6]" />
                                Key Information Detected
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-bg-tertiary rounded-xl p-4">
                                  <span className="text-caption text-text-muted block mb-1">Name</span>
                                  <span className="text-body-sm text-text-primary font-medium">
                                    {analysis.ocr.detectedName}
                                  </span>
                                </div>
                                <div className="bg-bg-tertiary rounded-xl p-4">
                                  <span className="text-caption text-text-muted block mb-1">Age</span>
                                  <span className="text-body-sm text-text-primary font-medium">
                                    {analysis.ocr.detectedAge}
                                  </span>
                                </div>
                              </div>

                              {/* Bio/Summary */}
                              <div className="mt-4 bg-bg-tertiary rounded-xl p-4">
                                <span className="text-caption text-text-muted block mb-1">Bio / Summary</span>
                                <p className="text-body-sm text-text-primary leading-relaxed">
                                  {analysis.ocr.bioSummary || 'No bio text detected'}
                                </p>
                              </div>
                            </div>

                            {/* Sentiment Score */}
                            <div className="glass-card p-6">
                              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
                                Keyword Sentiment Score
                              </h3>
                              <ScoreBar
                                label="Sentiment"
                                score={analysis.ocr.sentimentScore + 50}
                                max={100}
                                color={analysis.ocr.sentimentScore > 0 ? '#059669' : analysis.ocr.sentimentScore < 0 ? '#D97706' : '#57534E'}
                              />
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)] rounded-xl p-4 text-center">
                                  <span className="text-body-lg text-[#10B981] font-bold">{analysis.ocr.greenFlags.length}</span>
                                  <span className="text-caption text-text-muted block">Green Flags Found</span>
                                </div>
                                <div className="bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] rounded-xl p-4 text-center">
                                  <span className="text-body-lg text-[#F59E0B] font-bold">{analysis.ocr.redFlags.length}</span>
                                  <span className="text-caption text-text-muted block">Red Flags Found</span>
                                </div>
                              </div>
                            </div>

                            {/* Key Phrases */}
                            {analysis.ocr.keyPhrases.length > 0 && (
                              <div className="glass-card p-6">
                                <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-[#E11D48]" />
                                  Key Phrases Found
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {analysis.ocr.keyPhrases.map((phrase, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-2 rounded-lg bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] text-body-sm text-text-secondary"
                                    >
                                      {phrase}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* OCR Red Flags */}
                            {analysis.ocr.redFlags.length > 0 && (
                              <div>
                                <h3 className="text-heading-sm text-[#FBBF24] mb-4 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Red Flag Words Detected in Text
                                </h3>
                                <div className="space-y-3">
                                  {analysis.ocr.redFlags.map((flag, i) => (
                                    <FlagCard key={i} type="red" text={`"${flag}"`} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* OCR Green Flags */}
                            {analysis.ocr.greenFlags.length > 0 && (
                              <div>
                                <h3 className="text-heading-sm text-[#10B981] mb-4 flex items-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  Green Flag Words Detected in Text
                                </h3>
                                <div className="space-y-3">
                                  {analysis.ocr.greenFlags.map((flag, i) => (
                                    <FlagCard key={i} type="green" text={`"${flag}"`} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Full Extracted Text */}
                            <div className="glass-card p-6">
                              <h3 className="text-heading-sm text-text-primary mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-text-secondary" />
                                Full Extracted Text
                              </h3>
                              <div className="max-h-[400px] overflow-y-auto rounded-xl bg-bg-primary border border-[rgba(28, 25, 23, 0.08)] p-4 font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {analysis.ocr.extractedText}
                              </div>
                            </div>
                          </>
                        ) : (
                          /* No OCR data available */
                          <div className="text-center py-12">
                            <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
                            <h3 className="text-heading-sm text-text-primary mb-2">No Extracted Text Available</h3>
                            <p className="text-body-sm text-text-secondary max-w-[400px] mx-auto mb-6">
                              We couldn't extract readable text from the uploaded image. This could be because:
                            </p>
                            <ul className="text-body-sm text-text-muted max-w-[400px] mx-auto text-left space-y-2 mb-6">
                              <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                                The image doesn't contain visible text
                              </li>
              <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                                The text is too small or blurry
                              </li>
                              <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                                The image quality is too low for OCR
                              </li>
                            </ul>
                            <p className="text-body-sm text-text-secondary">
                              The analysis shown is based on our AI model's visual assessment.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Comparison Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="glass-card p-6 md:p-8"
              >
                <h3 className="text-heading-md text-text-primary mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#F59E0B]" />
                  How This Profile Compares
                </h3>
                <div className="space-y-6">
                  <ComparisonBar label="Photo Quality" average={65} current={analysis.comparison.photoQuality} />
                  <ComparisonBar label="Bio Quality" average={45} current={analysis.comparison.bioQuality} />
                  <ComparisonBar label="Overall Appeal" average={55} current={analysis.comparison.overallAppeal} />
                </div>
              </motion.div>

              {/* Share & Save */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 glass-card px-6 py-3 text-body-sm text-text-secondary hover:text-text-primary hover:border-[rgba(255,255,255,0.12)] transition-all"
                >
                  {copySuccess ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Share2 className="w-4 h-4" />}
                  {copySuccess ? 'Copied!' : 'Share Analysis'}
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 glass-card px-6 py-3 text-body-sm text-text-secondary hover:text-text-primary hover:border-[rgba(255,255,255,0.12)] transition-all"
                >
                  {saveSuccess ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Save className="w-4 h-4" />}
                  {saveSuccess ? 'Saved!' : 'Save to History'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 btn-gradient text-white text-body-sm font-semibold px-6 py-3 rounded-xl"
                >
                  <RefreshCw className="w-4 h-4" />
                  Analyze Another
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
