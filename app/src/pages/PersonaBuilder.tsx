import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Brain,
  Flame,
  Coffee,
  MessageCircle,
  Loader2,
  Download,
} from 'lucide-react'
import { useStore, type Persona } from '@/store'
import { getPersonaImageName, generateId } from '@/lib/conversation-engine'
import { getDifficultyColor } from '@/lib/conversation-engine'

// ─── Data ──────────────────────────────────────────────────────────────────

const ethnicities = [
  'Caucasian/White',
  'East Asian',
  'South Asian',
  'Latina/Hispanic',
  'Middle Eastern',
  'Black/African',
]

const hairColors = ['Blonde', 'Brunette', 'Black', 'Red', 'Auburn', 'Platinum']
const eyeColors = ['Blue', 'Green', 'Brown', 'Hazel', 'Gray', 'Amber']
const bodyTypes = ['Slim', 'Athletic', 'Curvy']
const hairLengths = ['', 'Short', 'Medium', 'Long', 'Very Long']
const heights = ['', 'Petite (under 5\'3)', 'Average (5\'3 - 5\'7)', 'Tall (5\'8 - 5\'11)', 'Very Tall (6\'+)']
const styles = ['', 'Casual', 'Elegant', 'Sporty', 'Edgy', 'Bohemian', 'Professional', 'Minimalist', 'Trendy']

const archetypes = [
  { id: 'The Romantic', icon: Heart, label: 'The Romantic', desc: 'Deep emotional, seeks connection' },
  { id: 'The Intellectual', icon: Brain, label: 'The Intellectual', desc: 'Values depth and intelligence' },
  { id: 'The Free Spirit', icon: Zap, label: 'The Free Spirit', desc: 'High energy, playful, spontaneous' },
  { id: 'The Mysterious', icon: Shield, label: 'The Mysterious', desc: 'Hard to open up, tests you first' },
  { id: 'The Diva', icon: Flame, label: 'The Diva', desc: 'Bold, confident, high standards' },
  { id: 'The Girl Next Door', icon: Coffee, label: 'The Girl Next Door', desc: 'Laid back, easygoing, warm' },
]

const difficultyTiers = [
  { level: 'Beginner', desc: "She's responsive and engaged. Great for building fundamentals." },
  { level: 'Intermediate', desc: "She's interested but tests you occasionally. Standard dating app experience." },
  { level: 'Advanced', desc: "She's selective and has high standards. You'll need sharp game." },
  { level: 'Expert', desc: "She's been approached hundreds of times. Only authentic confidence works." },
  { level: 'Master', desc: "She's emotionally complex with hidden expectations. For true masters." },
]

const scenarios = [
  'Dating App Match',
  'First Date Texting',
  'Getting Her Number',
  'Deepening Connection',
  'Keeping Interest',
  'Ex Re-engagement',
]

const sliderConfigs = [
  { key: 'extroversion', label: 'Introverted', rightLabel: 'Extroverted' },
  { key: 'rationality', label: 'Emotional', rightLabel: 'Rational' },
  { key: 'modernity', label: 'Traditional', rightLabel: 'Modern' },
  { key: 'independence', label: 'Clingy', rightLabel: 'Independent' },
  { key: 'playfulness', label: 'Playful', rightLabel: 'Serious' },
]

// ─── Saved Analysis type ───────────────────────────────────────────────────

interface SavedAnalysis {
  id: string
  personaName: string
  filename?: string
  thumbnail?: string
  overallScore: number
  verdict: string
  bioScore: number
  photoScore: number
  communicationScore: number
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
  ocr?: {
    extractedText: string
    detectedName: string
    detectedAge: string
    bioSummary: string
    keyPhrases: string[]
    redFlags: string[]
    greenFlags: string[]
    sentimentScore: number
  } | null
  savedAt?: number
}

const personalityMap: Record<string, number> = {
  creative: 70, artistic: 75, intellectual: 80,
  adventurous: 85, outgoing: 90, shy: 30,
  confident: 80, mysterious: 60, romantic: 70,
  sporty: 75, professional: 65, playful: 85,
  free: 75, spontaneous: 80, deep: 65,
  emotional: 55, witty: 80, funny: 85,
  sarcastic: 50, ambitious: 70, calm: 45,
  energetic: 85, quiet: 30, social: 90,
}

const archetypeKeywordMap: Record<string, string[]> = {
  'The Romantic': ['romantic', 'deep', 'emotional', 'connection', 'heart', 'love', 'poetry', 'passionate'],
  'The Intellectual': ['intellectual', 'smart', 'depth', 'intelligence', 'book', 'reading', 'educated', 'thoughtful'],
  'The Free Spirit': ['free', 'spontaneous', 'adventurous', 'travel', 'energetic', 'outdoor', 'fun', 'playful'],
  'The Mysterious': ['mysterious', 'quiet', 'shy', 'reserved', 'intriguing', 'depth', 'complex'],
  'The Diva': ['confident', 'bold', 'ambitious', 'professional', 'successful', 'diva', 'high standards'],
  'The Girl Next Door': ['laid', 'back', 'easygoing', 'warm', 'genuine', 'kind', 'coffee', 'casual'],
}

// ─── Archetype presets for sliders ─────────────────────────────────────────

const archetypePresets: Record<string, Record<string, number>> = {
  'The Romantic': { extroversion: 60, rationality: 40, modernity: 50, independence: 30, playfulness: 70 },
  'The Intellectual': { extroversion: 40, rationality: 80, modernity: 70, independence: 80, playfulness: 30 },
  'The Free Spirit': { extroversion: 80, rationality: 30, modernity: 80, independence: 70, playfulness: 90 },
  'The Mysterious': { extroversion: 30, rationality: 60, modernity: 40, independence: 90, playfulness: 40 },
  'The Diva': { extroversion: 70, rationality: 50, modernity: 80, independence: 85, playfulness: 60 },
  'The Girl Next Door': { extroversion: 50, rationality: 50, modernity: 50, independence: 50, playfulness: 60 },
}

// ─── Animation variants ────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function PersonaBuilder() {
  const navigate = useNavigate()
  const { personaConfig, setPersonaConfig, setSelectedPersona } = useStore()

  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageGenerated, setImageGenerated] = useState(false)
  const [showImageReveal, setShowImageReveal] = useState(false)
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([])
  const [showImportSection, setShowImportSection] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('datingcoach_saved_analyses')
    if (saved) {
      try { setSavedAnalyses(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  // Local form state synced to store
  const name = personaConfig.name || ''
  const age = personaConfig.age || 25
  const ethnicity = personaConfig.ethnicity || ''
  const hairColor = personaConfig.hairColor || ''
  const eyeColor = personaConfig.eyeColor || ''
  const bodyType = personaConfig.bodyType || ''
  const hairLength = personaConfig.hairLength || ''
  const height = personaConfig.height || ''
  const style = personaConfig.style || ''
  const glasses = personaConfig.glasses || false
  const tattoos = personaConfig.tattoos || false
  const piercings = personaConfig.piercings || false
  const personality = personaConfig.personality || { extroversion: 50, rationality: 50, modernity: 50, independence: 50, playfulness: 50 }
  const archetype = personaConfig.archetype || ''
  const bio = personaConfig.bio || ''
  const difficulty = personaConfig.difficulty || 'Beginner'
  const scenario = personaConfig.scenario || 'Dating App Match'
  const image = personaConfig.image || ''

  const updateField = useCallback(
    (field: string, value: unknown) => {
      setPersonaConfig({ [field]: value })
    },
    [setPersonaConfig]
  )

  const handleArchetypeSelect = (archId: string) => {
    setPersonaConfig({ archetype: archId })
    const preset = archetypePresets[archId]
    if (preset) {
      setPersonaConfig({ personality: { ...personality, ...preset } })
    }
  }

  const importFromAnalysis = (analysis: SavedAnalysis) => {
    // FIX: Use optional chaining and null-safety everywhere
    const importedName = analysis.ocr?.detectedName
      || analysis.personaName
      || analysis.filename
      || 'Imported Persona'

    // FIX: detectedAge doesn't exist in the saved structure, use sensible default
    const importedAge = 25

    // FIX: Safe persona name for text analysis - never call toLowerCase on undefined
    const safePersonaName = (analysis.personaName || analysis.ocr?.detectedName || analysis.filename || '').toLowerCase()

    // Map archetype from personality keywords found in bio/ocr data
    const textToAnalyze = (
      (analysis.ocr?.bioSummary || '') + ' ' +
      (analysis.ocr?.keyPhrases?.join(' ') || '') + ' ' +
      (analysis.bioAnalysis?.tone || '') + ' ' +
      safePersonaName
    ).toLowerCase()

    let bestArchetype = 'The Girl Next Door'
    let bestScore = -1
    Object.entries(archetypeKeywordMap).forEach(([archId, keywords]) => {
      const score = keywords.reduce((acc, kw) => acc + (textToAnalyze.includes(kw.toLowerCase()) ? 1 : 0), 0)
      if (score > bestScore) {
        bestScore = score
        bestArchetype = archId
      }
    })
    // Fallback: if no keywords matched, pick based on score
    if (bestScore === 0) {
      if (analysis.overallScore >= 75) bestArchetype = 'The Diva'
      else if (analysis.overallScore >= 60) bestArchetype = 'The Girl Next Door'
      else bestArchetype = 'The Mysterious'
    }

    // Map difficulty from overall score
    let importedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master' = 'Beginner'
    if (analysis.overallScore >= 80) importedDifficulty = 'Advanced'
    else if (analysis.overallScore >= 60) importedDifficulty = 'Intermediate'
    else if (analysis.overallScore >= 40) importedDifficulty = 'Beginner'
    else importedDifficulty = 'Beginner'

    // Map personality sliders from keywords
    const importedPersonality = { ...personality }
    const matchedTraits: Record<string, number> = {}
    Object.entries(personalityMap).forEach(([trait, value]) => {
      if (textToAnalyze.includes(trait.toLowerCase())) {
        matchedTraits[trait] = value
      }
    })
    if (Object.keys(matchedTraits).length > 0) {
      const avgVal = Math.round(Object.values(matchedTraits).reduce((a, b) => a + b, 0) / Object.values(matchedTraits).length)
      importedPersonality.extroversion = Math.min(100, Math.max(0, avgVal + (textToAnalyze.includes('outgoing') || textToAnalyze.includes('social') ? 15 : 0)))
      importedPersonality.rationality = Math.min(100, Math.max(0, avgVal + (textToAnalyze.includes('intellectual') || textToAnalyze.includes('smart') ? 10 : -5)))
      importedPersonality.modernity = Math.min(100, Math.max(0, 50 + (textToAnalyze.includes('modern') || textToAnalyze.includes('trendy') ? 20 : 0)))
      importedPersonality.independence = Math.min(100, Math.max(0, avgVal + (textToAnalyze.includes('independent') || textToAnalyze.includes('confident') ? 10 : -10)))
      importedPersonality.playfulness = Math.min(100, Math.max(0, avgVal + (textToAnalyze.includes('playful') || textToAnalyze.includes('fun') ? 15 : -10)))
    }

    // Apply archetype preset
    const preset = archetypePresets[bestArchetype]
    if (preset) {
      Object.entries(preset).forEach(([key, val]) => {
        (importedPersonality as Record<string, number>)[key] = val
      })
    }

    // FIX: Safe bio generation - never call toLowerCase on potentially undefined personaName
    const importedBio = analysis.ocr?.extractedText
      || analysis.ocr?.bioSummary
      || analysis.bioAnalysis?.tone
      || `${importedName} is a unique personality to practice with.`

    // FIX: Also set the image from the saved analysis thumbnail
    const updates: Record<string, unknown> = {
      name: importedName,
      age: importedAge,
      archetype: bestArchetype,
      difficulty: importedDifficulty,
      personality: importedPersonality,
      bio: importedBio,
    }
    if (analysis.thumbnail) {
      updates.image = analysis.thumbnail
    }

    // Set all config fields
    setPersonaConfig(updates)

    // Advance to step 2
    setStep(2)
  }

  const handleGenerateImage = () => {
    setIsGenerating(true)
    // Simulate generation delay
    setTimeout(() => {
      const imgName = getPersonaImageName(ethnicity || 'Caucasian/White')
      setPersonaConfig({ image: `/${imgName}` })
      setIsGenerating(false)
      setImageGenerated(true)
      setTimeout(() => setShowImageReveal(true), 100)
    }, 2000)
  }

  const handleStartConversation = () => {
    if (!name || !ethnicity) return

    const persona = {
      id: generateId(),
      name,
      age,
      ethnicity,
      hairColor: hairColor || 'Brunette',
      hairLength: hairLength || 'Medium',
      eyeColor: eyeColor || 'Brown',
      bodyType: bodyType || 'Slim',
      height: height || "Average (5'3 - 5'7)",
      style: style || 'Casual',
      glasses: glasses || false,
      tattoos: tattoos || false,
      piercings: piercings || false,
      personality,
      archetype: archetype || 'The Girl Next Door',
      bio: bio || `${name} is a ${age}-year-old ${ethnicity} woman with a ${archetype || 'unique'} personality.`,
      difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master',
      scenario,
      image: image || `/${getPersonaImageName(ethnicity)}`,
    }

    setSelectedPersona(persona as Persona)

    // Create conversation
    const conversationId = generateId()
    useStore.getState().setCurrentConversation({
      id: conversationId,
      personaId: persona.id,
      messages: [],
      analyses: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      phase: 0,
      phaseName: 'Opener',
      isActive: true,
    })

    navigate('/chat')
  }

  const canProceedStep1 = name.length > 0 && ethnicity.length > 0
  const canProceedStep2 = archetype.length > 0

  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--bg-primary)' }}>
      {/* ─── Header + Progress ─────────────────────────────────────────── */}
      <div className="pt-[72px]">
        <div className="px-6 py-16 md:py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-display-section text-center text-text-primary mb-3"
          >
            Create Your Practice Partner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-body-lg text-center text-text-secondary"
          >
            Customize every detail. Build your perfect practice partner.
          </motion.p>

          {/* Progress Stepper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="max-w-[500px] mx-auto mt-12"
          >
            <div className="relative flex items-center justify-between">
              {/* Track */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full" style={{ background: 'var(--bg-tertiary)' }} />
              {/* Active fill */}
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)',
                }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              />
              {/* Nodes */}
              {[1, 2, 3].map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                    animate={{
                      background:
                        s < step
                          ? 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)'
                          : s === step
                            ? 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)'
                            : 'var(--bg-tertiary)',
                      boxShadow: s === step ? '0 0 20px rgba(225, 29, 72, 0.3)' : 'none',
                    }}
                    style={{
                      border: s > step ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {s < step ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className={s === step ? 'text-white' : 'text-text-muted'}>{s}</span>
                    )}
                  </motion.div>
                  <span className="text-caption" style={{ color: s === step ? '#1C1917' : '#A8A29E' }}>
                    {s === 1 ? 'Basics' : s === 2 ? 'Personality' : 'Scenario'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Step Content ────────────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Form */}
          <div className="flex-1 lg:w-[55%]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                >
                  {/* Step 1: Basic Profile */}
                  <span className="text-caption uppercase tracking-[0.08em] text-[#E11D48]">Step 1 of 3</span>
                  <h2 className="text-heading-xl text-text-primary mt-2 mb-8">
                    Who would you like to practice with?
                  </h2>

                  {/* Import from Profile Analyzer */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="mb-8"
                  >
                    <button
                      onClick={() => setShowImportSection((v) => !v)}
                      className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: showImportSection ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.82)',
                        border: showImportSection ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(28, 25, 23, 0.1)',
                        backdropFilter: 'blur(16px)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: showImportSection ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.92)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}
                      >
                        <Download className="w-5 h-5 text-[#8B5CF6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-body-sm font-semibold text-text-primary block">Import from Profile Analyzer</span>
                        <span className="text-caption text-text-muted">Pre-fill persona from a saved profile analysis</span>
                      </div>
                      <motion.div
                        animate={{ rotate: showImportSection ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: '#A8A29E', transform: showImportSection ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {showImportSection && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4">
                            {savedAnalyses.length === 0 ? (
                              <div
                                className="flex flex-col items-center gap-3 px-6 py-10 rounded-xl text-center"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.82)',
                                  border: '1px solid rgba(28, 25, 23, 0.08)',
                                }}
                              >
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center"
                                  style={{ background: 'rgba(255, 255, 255, 0.92)', border: '1px solid rgba(28, 25, 23, 0.08)' }}
                                >
                                  <Download className="w-5 h-5 text-text-muted" />
                                </div>
                                <p className="text-body-sm text-text-secondary">No saved analyses yet.</p>
                                <p className="text-caption text-text-muted">Go to Profile Analyzer to analyze a profile first.</p>
                                <button
                                  onClick={() => navigate('/profile-analyzer')}
                                  className="mt-1 px-5 py-2 rounded-full text-body-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                                  style={{
                                    background: 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)',
                                  }}
                                >
                                  Go to Profile Analyzer
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-3 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                                {savedAnalyses.map((analysis, idx) => {
                                  const scoreColor = analysis.overallScore >= 80 ? '#059669' : analysis.overallScore >= 60 ? '#D97706' : '#E11D48'
                                  return (
                                    <motion.div
                                      key={analysis.id || idx}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: idx * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                                      className="flex-shrink-0 w-[240px] rounded-xl overflow-hidden"
                                      style={{
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(24px)',
                                        border: '1px solid rgba(28, 25, 23, 0.1)',
                                        boxShadow: 'inset 0 1px 0 rgba(28, 25, 23, 0.08), 0 4px 20px rgba(0,0,0,0.3)',
                                      }}
                                    >
                                      {/* Card header with score badge */}
                                      <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <span
                                            className="text-caption font-mono uppercase px-2.5 py-1 rounded-full"
                                            style={{ background: `${scoreColor}20`, color: scoreColor }}
                                          >
                                            {analysis.overallScore}/100
                                          </span>
                                          <span className="text-caption text-text-muted">
                                            {analysis.savedAt ? new Date(analysis.savedAt).toLocaleDateString() : 'Recently'}
                                          </span>
                                        </div>
                                        <h4 className="text-body-sm font-semibold text-text-primary truncate">
                                          {analysis.ocr?.detectedName || analysis.personaName || `Analysis ${idx + 1}`}
                                        </h4>
                                        <p className="text-caption text-text-muted truncate mt-0.5">
                                          {analysis.verdict || 'Profile analysis'}
                                        </p>
                                      </div>

                                      {/* Import button */}
                                      <div className="px-4 pb-4">
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={() => importFromAnalysis(analysis)}
                                          className="w-full py-2.5 rounded-lg text-body-sm font-semibold text-white transition-all duration-200"
                                          style={{
                                            background: 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)',
                                          }}
                                        >
                                          Import
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Name Input */}
                  <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
                    <label className="text-heading-sm text-text-primary block mb-2">Her Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="e.g., Sophia"
                      className="w-full px-[18px] py-[14px] rounded-xl text-body text-text-primary outline-none transition-all duration-200 focus:shadow-[0_0_20px_rgba(225,29,72,0.15)]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.82)',
                        border: '1px solid rgba(28, 25, 23, 0.1)',
                        backdropFilter: 'blur(16px)',
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '1px solid rgba(225, 29, 72, 0.3)'
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '1px solid rgba(28, 25, 23, 0.1)'
                      }}
                    />
                    <p className="text-caption text-text-muted mt-1">Choose any name, or let us suggest one</p>
                  </motion.div>

                  {/* Age Slider */}
                  <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-heading-sm text-text-primary">Age</label>
                      <span className="text-heading-xl text-[#E11D48]">{age}</span>
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={45}
                      value={age}
                      onChange={(e) => updateField('age', parseInt(e.target.value))}
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #E11D48 0%, #D97706 ${((age - 18) / (45 - 18)) * 100}%, #EDE6DA ${((age - 18) / (45 - 18)) * 100}%, #EDE6DA 100%)`,
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-caption text-text-muted">18</span>
                      <span className="text-caption text-text-muted">45</span>
                    </div>
                  </motion.div>

                  {/* Ethnicity Selector */}
                  <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
                    <label className="text-heading-sm text-text-primary block mb-3">Ethnicity</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ethnicities.map((eth) => (
                        <motion.button
                          key={eth}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateField('ethnicity', eth)}
                          className="px-4 py-3 rounded-xl text-body-sm font-medium transition-all duration-200"
                          style={{
                            background: ethnicity === eth ? 'rgba(225, 29, 72, 0.08)' : 'rgba(255, 255, 255, 0.82)',
                            border:
                              ethnicity === eth
                                ? '1px solid rgba(225, 29, 72, 0.3)'
                                : '1px solid rgba(28, 25, 23, 0.08)',
                            color: ethnicity === eth ? '#1C1917' : '#57534E',
                            backdropFilter: 'blur(16px)',
                            boxShadow:
                              ethnicity === eth ? '0 0 20px rgba(225, 29, 72, 0.15), inset 0 1px 0 rgba(28, 25, 23, 0.08)' : 'inset 0 1px 0 rgba(28, 25, 23, 0.08)',
                          }}
                        >
                          {eth}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Physical Traits */}
                  <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
                    <label className="text-heading-sm text-text-primary block mb-3">Physical Appearance</label>

                    {/* Hair Color */}
                    <div className="mb-3">
                      <span className="text-body-sm text-text-secondary mb-2 block">Hair Color</span>
                      <div className="flex flex-wrap gap-2">
                        {hairColors.map((hc) => (
                          <button
                            key={hc}
                            onClick={() => updateField('hairColor', hc === hairColor ? '' : hc)}
                            className="px-3 py-1.5 rounded-full text-body-sm transition-all duration-200"
                            style={{
                              background: hairColor === hc ? 'rgba(225, 29, 72, 0.15)' : '#EDE6DA',
                              border: hairColor === hc ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid rgba(28, 25, 23, 0.08)',
                              color: hairColor === hc ? '#BE123C' : '#57534E',
                            }}
                          >
                            {hc}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Eye Color */}
                    <div className="mb-3">
                      <span className="text-body-sm text-text-secondary mb-2 block">Eye Color</span>
                      <div className="flex flex-wrap gap-2">
                        {eyeColors.map((ec) => (
                          <button
                            key={ec}
                            onClick={() => updateField('eyeColor', ec === eyeColor ? '' : ec)}
                            className="px-3 py-1.5 rounded-full text-body-sm transition-all duration-200"
                            style={{
                              background: eyeColor === ec ? 'rgba(225, 29, 72, 0.15)' : '#EDE6DA',
                              border: eyeColor === ec ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid rgba(28, 25, 23, 0.08)',
                              color: eyeColor === ec ? '#BE123C' : '#57534E',
                            }}
                          >
                            {ec}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body Type */}
                    <div className="mb-3">
                      <span className="text-body-sm text-text-secondary mb-2 block">Body Type</span>
                      <div className="flex gap-2">
                        {bodyTypes.map((bt) => (
                          <button
                            key={bt}
                            onClick={() => updateField('bodyType', bt === bodyType ? '' : bt)}
                            className="px-4 py-2 rounded-xl text-body-sm font-medium transition-all duration-200"
                            style={{
                              background: bodyType === bt ? 'rgba(225, 29, 72, 0.15)' : '#EDE6DA',
                              border: bodyType === bt ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid rgba(28, 25, 23, 0.08)',
                              color: bodyType === bt ? '#BE123C' : '#57534E',
                            }}
                          >
                            {bt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hair Length */}
                    <div className="mb-3">
                      <span className="text-body-sm text-text-secondary mb-2 block">Hair Length</span>
                      <select
                        value={hairLength}
                        onChange={(e) => updateField('hairLength', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-body-sm bg-bg-tertiary text-text-secondary border border-[rgba(28, 25, 23, 0.08)] focus:border-[rgba(225,29,72,0.4)] focus:outline-none transition-colors appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                      >
                        {hairLengths.map((hl) => (
                          <option key={hl} value={hl}>{hl || 'Select hair length'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Height */}
                    <div className="mb-3">
                      <span className="text-body-sm text-text-secondary mb-2 block">Height</span>
                      <select
                        value={height}
                        onChange={(e) => updateField('height', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-body-sm bg-bg-tertiary text-text-secondary border border-[rgba(28, 25, 23, 0.08)] focus:border-[rgba(225,29,72,0.4)] focus:outline-none transition-colors appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                      >
                        {heights.map((h) => (
                          <option key={h} value={h}>{h || 'Select height'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Style */}
                    <div className="mb-3">
                      <span className="text-body-sm text-text-secondary mb-2 block">Style</span>
                      <select
                        value={style}
                        onChange={(e) => updateField('style', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-body-sm bg-bg-tertiary text-text-secondary border border-[rgba(28, 25, 23, 0.08)] focus:border-[rgba(225,29,72,0.4)] focus:outline-none transition-colors appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                      >
                        {styles.map((s) => (
                          <option key={s} value={s}>{s || 'Select style'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Toggle Switches: Glasses, Tattoos, Piercings */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-body text-text-secondary">Glasses</label>
                        <button
                          type="button"
                          onClick={() => updateField('glasses', !glasses)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            glasses ? 'bg-[#E11D48]' : 'bg-[rgba(255,255,255,0.1)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                            glasses ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-body text-text-secondary">Tattoos</label>
                        <button
                          type="button"
                          onClick={() => updateField('tattoos', !tattoos)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            tattoos ? 'bg-[#E11D48]' : 'bg-[rgba(255,255,255,0.1)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                            tattoos ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-body text-text-secondary">Piercings</label>
                        <button
                          type="button"
                          onClick={() => updateField('piercings', !piercings)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            piercings ? 'bg-[#E11D48]' : 'bg-[rgba(255,255,255,0.1)]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                            piercings ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Navigation */}
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={canProceedStep1 ? { scale: 1.03 } : {}}
                      whileTap={canProceedStep1 ? { scale: 0.97 } : {}}
                      onClick={() => canProceedStep1 && setStep(2)}
                      disabled={!canProceedStep1}
                      className="flex items-center gap-2 px-7 py-3 rounded-full text-heading-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: canProceedStep1
                          ? 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)'
                          : 'var(--bg-tertiary)',
                      }}
                    >
                      Next Step
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                >
                  {/* Step 2: Personality */}
                  <span className="text-caption uppercase tracking-[0.08em] text-[#F59E0B]">Step 2 of 3</span>
                  <h2 className="text-heading-xl text-text-primary mt-2 mb-8">Define her personality</h2>

                  {/* Personality Sliders */}
                  <div className="space-y-5 mb-8">
                    {sliderConfigs.map((slider, idx) => (
                      <motion.div
                        key={slider.key}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                              delay: idx * 0.08,
                              duration: 0.4,
                              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                            },
                          },
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-heading-sm text-text-primary">
                            {slider.label} ↔ {slider.rightLabel}
                          </span>
                          <span className="text-body-sm text-[#F59E0B]">
                            {personality[slider.key as keyof typeof personality]}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={personality[slider.key as keyof typeof personality]}
                          onChange={(e) => {
                            const val = parseInt(e.target.value)
                            setPersonaConfig({
                              personality: { ...personality, [slider.key]: val },
                            })
                          }}
                          className="w-full h-1 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #E11D48 0%, #D97706 ${personality[slider.key as keyof typeof personality]}%, #EDE6DA ${personality[slider.key as keyof typeof personality]}%, #EDE6DA 100%)`,
                          }}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-caption text-text-muted">{slider.label}</span>
                          <span className="text-caption text-text-muted">{slider.rightLabel}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Archetype Selector */}
                  <div className="mb-8">
                    <label className="text-heading-sm text-text-primary block mb-3">Or choose a preset archetype</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {archetypes.map((arch, idx) => {
                        const Icon = arch.icon
                        return (
                          <motion.button
                            key={arch.id}
                            custom={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.04, duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleArchetypeSelect(arch.id)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200"
                            style={{
                              background: archetype === arch.id ? 'rgba(225, 29, 72, 0.08)' : 'rgba(255, 255, 255, 0.82)',
                              border:
                                archetype === arch.id
                                  ? '1px solid rgba(225, 29, 72, 0.3)'
                                  : '1px solid rgba(28, 25, 23, 0.08)',
                              boxShadow:
                                archetype === arch.id ? '0 0 20px rgba(225, 29, 72, 0.15), inset 0 1px 0 rgba(28, 25, 23, 0.08)' : 'inset 0 1px 0 rgba(28, 25, 23, 0.08)',
                              backdropFilter: 'blur(16px)',
                            }}
                          >
                            <Icon
                              className="w-7 h-7"
                              style={{ color: archetype === arch.id ? '#E11D48' : '#57534E' }}
                            />
                            <span
                              className="text-body-sm font-semibold"
                              style={{ color: archetype === arch.id ? '#1C1917' : '#57534E' }}
                            >
                              {arch.label}
                            </span>
                            <span className="text-caption text-text-muted text-center leading-tight">{arch.desc}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Bio Textarea */}
                  <div className="mb-8">
                    <label className="text-heading-sm text-text-primary block mb-2">Bio / Background</label>
                    <textarea
                      value={bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="She loves hiking, reading poetry, and spontaneous road trips..."
                      rows={4}
                      className="w-full px-[18px] py-[14px] rounded-xl text-body text-text-primary outline-none transition-all duration-200 resize-none focus:shadow-[0_0_20px_rgba(225,29,72,0.15)]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.82)',
                        border: '1px solid rgba(28, 25, 23, 0.1)',
                        backdropFilter: 'blur(16px)',
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '1px solid rgba(225, 29, 72, 0.3)'
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '1px solid rgba(28, 25, 23, 0.1)'
                      }}
                    />
                    <p className="text-caption text-text-muted mt-1">
                      {bio.length === 0 && archetype
                        ? `Auto-generated based on ${archetype}. Edit as you like.`
                        : `${bio.length} characters`}
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full text-heading-sm font-semibold text-text-secondary transition-all duration-200 hover:text-text-primary"
                      style={{ border: '1px solid rgba(28, 25, 23, 0.1)' }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={canProceedStep2 ? { scale: 1.03 } : {}}
                      whileTap={canProceedStep2 ? { scale: 0.97 } : {}}
                      onClick={() => canProceedStep2 && setStep(3)}
                      disabled={!canProceedStep2}
                      className="flex items-center gap-2 px-7 py-3 rounded-full text-heading-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: canProceedStep2
                          ? 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)'
                          : 'var(--bg-tertiary)',
                      }}
                    >
                      Next Step
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                >
                  {/* Step 3: Difficulty & Scenario */}
                  <span className="text-caption uppercase tracking-[0.08em] text-[#14B8A6]">Step 3 of 3</span>
                  <h2 className="text-heading-xl text-text-primary mt-2 mb-8">Set the challenge</h2>

                  {/* Difficulty Selector */}
                  <div className="mb-8">
                    <label className="text-heading-sm text-text-primary block mb-3">Conversation Difficulty</label>
                    <div className="space-y-2">
                      {difficultyTiers.map((tier, idx) => {
                        const color = getDifficultyColor(tier.level)
                        const isSelected = difficulty === tier.level
                        return (
                          <motion.button
                            key={tier.level}
                            custom={idx}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => updateField('difficulty', tier.level)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left"
                            style={{
                              background: isSelected ? `${color}14` : 'rgba(255, 255, 255, 0.82)',
                              borderLeft: isSelected ? `4px solid ${color}` : '4px solid transparent',
                              border: isSelected ? `1px solid ${color}30` : '1px solid rgba(28, 25, 23, 0.08)',
                              backdropFilter: 'blur(16px)',
                              boxShadow: isSelected ? `0 0 20px ${color}25` : 'none',
                            }}
                          >
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                            <div className="flex-1 min-w-0">
                              <div className="text-heading-sm font-semibold text-text-primary">{tier.level}</div>
                              <div className="text-body-sm text-text-secondary">{tier.desc}</div>
                            </div>
                            <span
                              className="text-caption font-mono uppercase px-3 py-1 rounded-full flex-shrink-0"
                              style={{ background: `${color}20`, color }}
                            >
                              {tier.level}
                            </span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Scenario Selector */}
                  <div className="mb-8">
                    <label className="text-heading-sm text-text-primary block mb-3">Scenario</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {scenarios.map((sc, idx) => (
                        <motion.button
                          key={sc}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.04, duration: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateField('scenario', sc)}
                          className="p-4 rounded-xl text-body-sm font-medium text-center transition-all duration-200"
                          style={{
                            background: scenario === sc ? 'rgba(225, 29, 72, 0.08)' : 'rgba(255, 255, 255, 0.82)',
                            border:
                              scenario === sc
                                ? '1px solid rgba(225, 29, 72, 0.3)'
                                : '1px solid rgba(28, 25, 23, 0.08)',
                            color: scenario === sc ? '#1C1917' : '#57534E',
                            backdropFilter: 'blur(16px)',
                            boxShadow: scenario === sc ? '0 0 20px rgba(225, 29, 72, 0.15)' : 'none',
                          }}
                        >
                          {sc}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Image Button */}
                  <div className="mb-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerateImage}
                      disabled={isGenerating || imageGenerated}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full text-heading-sm font-semibold transition-all duration-300"
                      style={{
                        background: imageGenerated
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)',
                        border: imageGenerated ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                        color: '#fff',
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Persona...
                        </>
                      ) : imageGenerated ? (
                        <>
                          <Check className="w-5 h-5 text-[#10B981]" />
                          <span className="text-[#10B981]">Persona Generated!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate Persona Image
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Navigation + Launch */}
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full text-heading-sm font-semibold text-text-secondary transition-all duration-200 hover:text-text-primary"
                      style={{ border: '1px solid rgba(28, 25, 23, 0.1)' }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleStartConversation}
                      disabled={!canProceedStep1}
                      className="flex items-center gap-3 px-9 py-4 rounded-full text-heading-md font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: canProceedStep1
                          ? 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)'
                          : 'var(--bg-tertiary)',
                        boxShadow: canProceedStep1 ? '0 0 40px rgba(225, 29, 72, 0.3)' : 'none',
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      Launch Conversation
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Preview Card (hidden on mobile) */}
          <motion.div
            className="hidden lg:block lg:w-[45%]"
            variants={slideRight}
            initial="hidden"
            animate="visible"
          >
            <div className="sticky top-[100px]">
              <div
                className="rounded-[20px] overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(28, 25, 23, 0.1)',
                  boxShadow: 'inset 0 1px 0 rgba(28, 25, 23, 0.1), 0 8px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Image Area */}
                <div className="relative aspect-square flex items-center justify-center overflow-hidden" style={{ background: '#FDFBF7' }}>
                  {image && showImageReveal ? (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      src={image}
                      alt={name || 'Persona preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(255, 255, 255, 0.82)',
                          border: '1px solid rgba(28, 25, 23, 0.08)',
                        }}
                      >
                        <Sparkles className="w-8 h-8 text-text-muted" />
                      </div>
                      <p className="text-body-sm text-text-muted">Your persona will appear here</p>
                      {isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(253, 251, 247, 0.85)' }}>
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-[#E11D48] animate-spin" />
                            <p className="text-body-sm text-text-secondary">Creating your persona...</p>
                            <motion.div
                              className="w-48 h-1 rounded-full overflow-hidden"
                              style={{ background: 'var(--bg-tertiary)' }}
                            >
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: 'linear-gradient(135deg, #E11D48, #F59E0B)' }}
                                animate={{ width: ['0%', '100%'] }}
                                transition={{ duration: 2, ease: 'easeInOut' }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sparkle overlay on reveal */}
                  {showImageReveal && image && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(225,29,72,0.2) 0%, transparent 70%)',
                      }}
                    />
                  )}
                </div>

                {/* Persona Summary */}
                <div className="p-5">
                  <h3 className="text-heading-md text-text-primary mb-1">
                    {name || 'Your Persona'}
                  </h3>
                  <p className="text-body-sm text-text-secondary mb-3">
                    {age ? `${age} years old` : ''}
                    {age && ethnicity ? ' · ' : ''}
                    {ethnicity || ''}
                  </p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hairColor && (
                      <span
                        className="px-3 py-1 rounded-full text-body-sm"
                        style={{ background: '#EDE6DA', border: '1px solid rgba(28, 25, 23, 0.08)', color: '#57534E' }}
                      >
                        {hairColor} hair
                      </span>
                    )}
                    {eyeColor && (
                      <span
                        className="px-3 py-1 rounded-full text-body-sm"
                        style={{ background: '#EDE6DA', border: '1px solid rgba(28, 25, 23, 0.08)', color: '#57534E' }}
                      >
                        {eyeColor} eyes
                      </span>
                    )}
                    {bodyType && (
                      <span
                        className="px-3 py-1 rounded-full text-body-sm"
                        style={{ background: '#EDE6DA', border: '1px solid rgba(28, 25, 23, 0.08)', color: '#57534E' }}
                      >
                        {bodyType}
                      </span>
                    )}
                    {archetype && (
                      <span
                        className="px-3 py-1 rounded-full text-body-sm"
                        style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.2)', color: '#BE123C' }}
                      >
                        {archetype}
                      </span>
                    )}
                  </div>

                  {/* Difficulty Preview */}
                  {difficulty && (
                    <div className="flex items-center gap-2">
                      <span className="text-caption text-text-muted">Difficulty:</span>
                      <span
                        className="text-caption font-mono uppercase px-3 py-1 rounded-full"
                        style={{
                          background: `${getDifficultyColor(difficulty)}20`,
                          color: getDifficultyColor(difficulty),
                        }}
                      >
                        {difficulty}
                      </span>
                    </div>
                  )}

                  {/* Scenario */}
                  {scenario && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-caption text-text-muted">Scenario:</span>
                      <span className="text-caption text-text-secondary">{scenario}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
