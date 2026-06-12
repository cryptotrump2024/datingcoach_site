import { create } from 'zustand'
import { toast } from 'sonner'
import { isCloudMode, supabase } from '@/lib/supabase'
import { emptyProgress, getStorageAdapter, type Progress } from '@/lib/storage'
import { applySession, levelForXp, LEVEL_TITLES } from '@/lib/gamification'

export interface Persona {
  id: string
  name: string
  age: number
  ethnicity: string
  hairColor: string
  hairLength: string
  eyeColor: string
  bodyType: string
  height: string
  style: string
  glasses: boolean
  tattoos: boolean
  piercings: boolean
  personality: {
    extroversion: number
    rationality: number
    modernity: number
    independence: number
    playfulness: number
  }
  archetype: string
  bio: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master'
  scenario: string
  image: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  phase?: string
}

export interface MessageAnalysis {
  messageId: string
  subtext: string
  psychology: string
  advice: string
  score: number
  stars: number
}

export interface AnalysisItem {
  id: string
  category: 'subtext' | 'psychology' | 'advice'
  title: string
  description: string
  color: string
}

export interface Conversation {
  id: string
  personaId: string
  personaName?: string
  personaArchetype?: string
  messages: Message[]
  analyses: MessageAnalysis[]
  createdAt: number
  updatedAt: number
  phase: number
  phaseName: string
  isActive: boolean
  scenarioSlug?: string
  scenarioBrief?: string
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'advanced'
  credits: number
  createdAt: string
}

export interface AuthResult {
  ok: boolean
  error?: string
}

export interface EndConversationOptions {
  drillSlug?: string
  drillBonus?: number
  drillCategoryCompleted?: boolean
}

// ── Local (guest) profile persistence — no passwords stored, ever ──────────

const STORAGE_KEY_USERS = 'datingcoach_users'
const STORAGE_KEY_SESSION = 'datingcoach_session'

interface StoredLocalUser extends User {
  passwordHash?: string // legacy field from the old fake-auth implementation; ignored
}

function getLocalUsers(): StoredLocalUser[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]')
  } catch {
    return []
  }
}

function saveLocalUsers(users: StoredLocalUser[]) {
  localStorage.setItem(
    STORAGE_KEY_USERS,
    JSON.stringify(users.map(({ passwordHash: _legacy, ...u }) => u))
  )
}

function getLocalSession(): User | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION) || 'null')
  } catch {
    return null
  }
}

function saveLocalSession(user: User | null) {
  if (user) localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY_SESSION)
}

// ── Store ───────────────────────────────────────────────────────────────────

interface AppState {
  // Persona builder state
  personaConfig: Partial<Persona>
  setPersonaConfig: (config: Partial<Persona>) => void
  resetPersonaConfig: () => void

  // Selected persona (final)
  selectedPersona: Persona | null
  setSelectedPersona: (persona: Persona | null) => void

  // Conversation state
  currentConversation: Conversation | null
  setCurrentConversation: (conversation: Conversation | null) => void
  addMessage: (message: Message) => void
  addAnalysis: (analysis: MessageAnalysis) => void
  updateConversationPhase: (phase: number, phaseName: string) => void
  endConversation: (options?: EndConversationOptions) => void

  // Practice history (persisted via storage adapter)
  conversations: Conversation[]
  addConversation: (conversation: Conversation) => void
  totalMessages: number
  incrementTotalMessages: () => void

  // Gamification progress
  progress: Progress
  sessionUsedVoice: boolean
  markVoiceUsed: () => void
  saveProfileAnalysis: (id: string, result: unknown) => void

  // Current analysis
  currentAnalysis: AnalysisItem[] | null
  setCurrentAnalysis: (analysis: AnalysisItem[] | null) => void

  // UI state
  isAnalysisOpen: boolean
  setIsAnalysisOpen: (open: boolean) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // ===== Auth =====
  user: User | null
  isAuthenticated: boolean
  isCloudMode: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  signup: (username: string, email: string, password: string) => Promise<AuthResult>
  loginWithGoogle: () => Promise<AuthResult>
  logout: () => void
  updatePlan: (plan: 'free' | 'pro' | 'advanced') => void
  useCredit: () => boolean
  addCredits: (amount: number) => void
  getCreditCost: (conversationCount: number) => number
  canUseFeature: (feature: string) => boolean

  // internal hydration
  _hydrate: (user: User | null) => Promise<void>
}

const initialPersonaConfig: Partial<Persona> = {
  name: '',
  age: 25,
  ethnicity: '',
  hairColor: '',
  eyeColor: '',
  bodyType: '',
  personality: {
    extroversion: 50,
    rationality: 50,
    modernity: 50,
    independence: 50,
    playfulness: 50,
  },
  archetype: '',
  bio: '',
  difficulty: 'Beginner',
  scenario: 'Dating App Match',
  image: '',
}

function adapterFor(user: User | null) {
  return getStorageAdapter(Boolean(user) && isCloudMode)
}

async function fetchCloudProfile(authUserId: string, email: string, fallbackUsername: string): Promise<User> {
  const base: User = {
    id: authUserId,
    username: fallbackUsername,
    email,
    avatar: '',
    plan: 'free',
    credits: 3,
    createdAt: new Date().toISOString(),
  }
  if (!supabase) return base
  // Tolerates a missing profiles table/row (schema not applied yet).
  const { data } = await supabase.from('profiles').select('*').eq('id', authUserId).maybeSingle()
  if (!data) return base
  return {
    ...base,
    username: data.username ?? fallbackUsername,
    plan: (data.plan ?? 'free') as User['plan'],
    credits: data.credits ?? 3,
    createdAt: data.created_at ?? base.createdAt,
  }
}

function persistCloudProfile(user: User) {
  if (!isCloudMode || !supabase) return
  supabase
    .from('profiles')
    .upsert({ id: user.id, username: user.username, plan: user.plan, credits: user.credits })
    .then(({ error }) => {
      if (error) console.warn('Profile sync failed:', error.message)
    })
}

// Load session synchronously for local mode so refreshes don't flash logged-out.
const initialLocalUser = isCloudMode ? null : getLocalSession()

export const useStore = create<AppState>((set, get) => ({
  // Persona builder state
  personaConfig: { ...initialPersonaConfig },
  setPersonaConfig: (config) =>
    set((state) => ({
      personaConfig: { ...state.personaConfig, ...config },
    })),
  resetPersonaConfig: () => set({ personaConfig: { ...initialPersonaConfig } }),

  // Selected persona
  selectedPersona: null,
  setSelectedPersona: (persona) => set({ selectedPersona: persona }),

  // Conversation state
  currentConversation: null,
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  addMessage: (message) =>
    set((state) => ({
      currentConversation: state.currentConversation
        ? {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, message],
            updatedAt: Date.now(),
          }
        : null,
    })),
  addAnalysis: (analysis) =>
    set((state) => ({
      currentConversation: state.currentConversation
        ? {
            ...state.currentConversation,
            analyses: [...state.currentConversation.analyses, analysis],
            updatedAt: Date.now(),
          }
        : null,
    })),
  updateConversationPhase: (phase, phaseName) =>
    set((state) => ({
      currentConversation: state.currentConversation
        ? { ...state.currentConversation, phase, phaseName }
        : null,
    })),

  endConversation: (options) => {
    const state = get()
    const conv = state.currentConversation
    if (!conv) return

    const persona = state.selectedPersona
    const ended: Conversation = {
      ...conv,
      personaName: conv.personaName ?? persona?.name,
      personaArchetype: conv.personaArchetype ?? persona?.archetype,
      isActive: false,
      updatedAt: Date.now(),
    }

    const userMessageCount = ended.messages.filter((m) => m.role === 'user').length
    const conversations = [...state.conversations.filter((c) => c.id !== ended.id), ended]
    set({ currentConversation: ended, conversations })

    // Persist (fire-and-forget; never blocks the UI)
    const user = state.user
    if (user) {
      adapterFor(user)
        .saveConversation(user.id, ended)
        .catch(() => toast.error('Could not sync this session — it is saved on this device.'))
    } else {
      adapterFor(null).saveConversation('guest', ended).catch(() => undefined)
    }

    // Gamification — only sessions with real participation earn progress
    if (userMessageCount >= 2 && ended.analyses.length > 0) {
      const avgScore =
        ended.analyses.reduce((s, a) => s + a.score, 0) / ended.analyses.length
      const update = applySession(state.progress, {
        avgScore,
        userMessageCount,
        hadFiveStarMessage: ended.analyses.some((a) => a.score >= 5),
        usedVoice: state.sessionUsedVoice,
        drillSlug: options?.drillSlug ?? ended.scenarioSlug,
        drillBonus: options?.drillBonus,
        drillCategoryCompleted: options?.drillCategoryCompleted,
        totalSessionsAfter: conversations.filter((c) => !c.isActive).length,
      })
      set({ progress: update.progress, sessionUsedVoice: false })

      const uid = user?.id ?? 'guest'
      adapterFor(user).saveProgress(uid, update.progress).catch(() => undefined)

      toast.success(`+${update.xpGained} XP`, {
        description: `Practice streak: ${update.progress.streak} day${update.progress.streak === 1 ? '' : 's'}`,
      })
      if (update.leveledUp) {
        const lvl = levelForXp(update.progress.xp)
        toast.success(`Level ${lvl} — ${LEVEL_TITLES[lvl - 1]}!`, { duration: 6000 })
      }
      for (const ach of update.newAchievements) {
        toast(`${ach.emoji} Achievement unlocked: ${ach.title}`, {
          description: ach.description,
          duration: 6000,
        })
      }
    }
  },

  // Practice history
  conversations: [],
  addConversation: (conversation) =>
    set((state) => ({ conversations: [...state.conversations, conversation] })),
  totalMessages: 0,
  incrementTotalMessages: () => set((state) => ({ totalMessages: state.totalMessages + 1 })),

  // Gamification
  progress: { ...emptyProgress },
  sessionUsedVoice: false,
  markVoiceUsed: () => set({ sessionUsedVoice: true }),
  saveProfileAnalysis: (id, result) => {
    const user = get().user
    adapterFor(user)
      .saveAnalysis(user?.id ?? 'guest', id, result)
      .catch(() => undefined)
  },

  // Analysis
  currentAnalysis: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  // UI state
  isAnalysisOpen: true,
  setIsAnalysisOpen: (open) => set({ isAnalysisOpen: open }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // ===== Auth =====
  user: initialLocalUser,
  isAuthenticated: Boolean(initialLocalUser),
  isCloudMode,

  login: async (email, password) => {
    if (isCloudMode && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { ok: false, error: error.message }
      if (!data.user) return { ok: false, error: 'Login failed — please try again.' }
      // onAuthStateChange hydrates the profile; set a provisional user now.
      const user = await fetchCloudProfile(
        data.user.id,
        data.user.email ?? email,
        (data.user.user_metadata?.username as string) ?? email.split('@')[0]
      )
      set({ user, isAuthenticated: true })
      void get()._hydrate(user)
      return { ok: true }
    }

    // Local mode: guest profile lookup (no passwords involved by design)
    const found = getLocalUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!found) {
      return { ok: false, error: 'No local profile with that email. Create one via Sign up.' }
    }
    const { passwordHash: _legacy, ...user } = found
    saveLocalSession(user)
    set({ user, isAuthenticated: true })
    void get()._hydrate(user)
    return { ok: true }
  },

  signup: async (username, email, password) => {
    if (isCloudMode && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      })
      if (error) return { ok: false, error: error.message }
      if (!data.session) {
        return {
          ok: false,
          error: 'Account created — check your email to confirm it, then log in.',
        }
      }
      const user = await fetchCloudProfile(data.user!.id, email, username)
      set({ user, isAuthenticated: true })
      void get()._hydrate(user)
      return { ok: true }
    }

    // Local mode: create a guest profile on this device. No password stored.
    const users = getLocalUsers()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'A local profile with that email already exists.' }
    }
    const user: User = {
      id: crypto.randomUUID(),
      username,
      email: email.toLowerCase(),
      avatar: '',
      plan: 'free',
      credits: 3,
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    saveLocalUsers(users)
    saveLocalSession(user)
    set({ user, isAuthenticated: true })
    void get()._hydrate(user)
    return { ok: true }
  },

  loginWithGoogle: async () => {
    if (!isCloudMode || !supabase) {
      return { ok: false, error: 'Google sign-in requires the cloud backend (not configured).' }
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true } // browser redirects
  },

  logout: () => {
    if (isCloudMode && supabase) void supabase.auth.signOut()
    saveLocalSession(null)
    set({
      user: null,
      isAuthenticated: false,
      conversations: [],
      progress: { ...emptyProgress },
    })
  },

  updatePlan: (plan) => {
    set((state) => {
      if (!state.user) return state
      const updatedUser: User = {
        ...state.user,
        plan,
        credits: plan === 'advanced' ? -1 : plan === 'pro' ? 50 : state.user.credits,
      }
      if (isCloudMode) {
        persistCloudProfile(updatedUser)
      } else {
        const users = getLocalUsers()
        const idx = users.findIndex((u) => u.id === updatedUser.id)
        if (idx >= 0) {
          users[idx] = { ...users[idx], plan: updatedUser.plan, credits: updatedUser.credits }
          saveLocalUsers(users)
        }
        saveLocalSession(updatedUser)
      }
      return { user: updatedUser }
    })
  },

  useCredit: () => {
    const state = get()
    if (!state.user) return false
    if (state.user.plan === 'advanced' || state.user.credits === -1) return true
    if (state.user.credits <= 0) return false
    const updatedUser: User = { ...state.user, credits: state.user.credits - 1 }
    if (isCloudMode) {
      persistCloudProfile(updatedUser)
    } else {
      const users = getLocalUsers()
      const idx = users.findIndex((u) => u.id === updatedUser.id)
      if (idx >= 0) {
        users[idx] = { ...users[idx], credits: updatedUser.credits }
        saveLocalUsers(users)
      }
      saveLocalSession(updatedUser)
    }
    set({ user: updatedUser })
    return true
  },

  addCredits: (amount) => {
    set((state) => {
      if (!state.user || state.user.credits === -1) return state
      const updatedUser: User = { ...state.user, credits: state.user.credits + amount }
      if (isCloudMode) {
        persistCloudProfile(updatedUser)
      } else {
        const users = getLocalUsers()
        const idx = users.findIndex((u) => u.id === updatedUser.id)
        if (idx >= 0) {
          users[idx] = { ...users[idx], credits: updatedUser.credits }
          saveLocalUsers(users)
        }
        saveLocalSession(updatedUser)
      }
      return { user: updatedUser }
    })
  },

  getCreditCost: () => 1,

  canUseFeature: (feature: string) => {
    const state = get()
    if (!state.user) return false

    const plan = state.user.plan
    const freeFeatures = ['basic_feedback', 'limited_personas', 'profile_analysis']
    const proFeatures = [
      ...freeFeatures,
      'conversation_history',
      'analytics_dashboard',
      'all_personas',
      'subtext_decoding',
    ]
    const advancedFeatures = [
      ...proFeatures,
      'relationship_coaching',
      'custom_personas',
      'priority_support',
      'early_access',
      'trends_analytics',
    ]

    if (plan === 'advanced') return advancedFeatures.includes(feature)
    if (plan === 'pro') return proFeatures.includes(feature)
    return freeFeatures.includes(feature)
  },

  _hydrate: async (user) => {
    const adapter = adapterFor(user)
    const uid = user?.id ?? 'guest'
    try {
      const [conversations, progress] = await Promise.all([
        adapter.loadConversations(uid),
        adapter.loadProgress(uid),
      ])
      set({
        conversations,
        progress: progress ?? { ...emptyProgress },
        totalMessages: conversations.reduce(
          (n, c) => n + c.messages.filter((m) => m.role === 'user').length,
          0
        ),
      })
    } catch {
      /* hydration is best-effort */
    }
  },
}))

// ── Boot-time hydration & cloud auth subscription ──────────────────────────

// Guests (and local-mode users) get their device history immediately.
void useStore.getState()._hydrate(initialLocalUser)

if (isCloudMode && supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session?.user) {
      if (useStore.getState().isAuthenticated) {
        useStore.setState({ user: null, isAuthenticated: false })
      }
      return
    }
    const authUser = session.user
    // Avoid duplicate hydration when login()/signup() already did it.
    if (useStore.getState().user?.id === authUser.id) return
    void fetchCloudProfile(
      authUser.id,
      authUser.email ?? '',
      (authUser.user_metadata?.username as string) ?? (authUser.email ?? 'Member').split('@')[0]
    ).then((user) => {
      useStore.setState({ user, isAuthenticated: true })
      void useStore.getState()._hydrate(user)
    })
  })
}
