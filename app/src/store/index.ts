import { create } from 'zustand'

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

interface StoredUser extends User {
  passwordHash: string
}

const STORAGE_KEY_USERS = 'datingcoach_users'
const STORAGE_KEY_SESSION = 'datingcoach_session'

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
}

function getSession(): User | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION) || 'null')
  } catch {
    return null
  }
}

function saveSession(user: User | null) {
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user))
}

function hashPassword(password: string): string {
  return btoa(password + '_datingcoach_salt')
}

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
  endConversation: () => void

  // User progress
  conversations: Conversation[]
  addConversation: (conversation: Conversation) => void
  totalMessages: number
  incrementTotalMessages: () => void

  // Current analysis
  currentAnalysis: AnalysisItem[] | null
  setCurrentAnalysis: (analysis: AnalysisItem[] | null) => void

  // UI state
  isAnalysisOpen: boolean
  setIsAnalysisOpen: (open: boolean) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // ===== Auth State =====
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updatePlan: (plan: 'free' | 'pro' | 'advanced') => void
  useCredit: () => boolean
  addCredits: (amount: number) => void
  getCreditCost: (conversationCount: number) => number
  canUseFeature: (feature: string) => boolean
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

// Load session from localStorage on init
const sessionUser = getSession()

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
  endConversation: () =>
    set((state) => ({
      currentConversation: state.currentConversation
        ? { ...state.currentConversation, isActive: false, updatedAt: Date.now() }
        : null,
    })),

  // User progress
  conversations: [],
  addConversation: (conversation) =>
    set((state) => ({ conversations: [...state.conversations, conversation] })),
  totalMessages: 0,
  incrementTotalMessages: () =>
    set((state) => ({ totalMessages: state.totalMessages + 1 })),

  // Analysis
  currentAnalysis: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  // UI state
  isAnalysisOpen: true,
  setIsAnalysisOpen: (open) => set({ isAnalysisOpen: open }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // ===== Auth State =====
  user: sessionUser,
  isAuthenticated: !!sessionUser,

  login: async (email: string, password: string) => {
    const users = getStoredUsers()
    const passwordHash = hashPassword(password)
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash
    )
    if (found) {
      const { passwordHash: _, ...user } = found
      saveSession(user)
      set({ user, isAuthenticated: true })
      return true
    }
    return false
  },

  signup: async (username: string, email: string, password: string) => {
    const users = getStoredUsers()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return false
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      username,
      email: email.toLowerCase(),
      avatar: '',
      plan: 'free',
      credits: 3,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password),
    }
    users.push(newUser)
    saveUsers(users)
    const { passwordHash: _, ...user } = newUser
    saveSession(user)
    set({ user, isAuthenticated: true })
    return true
  },

  logout: () => {
    saveSession(null)
    set({ user: null, isAuthenticated: false })
  },

  updatePlan: (plan) => {
    set((state) => {
      if (!state.user) return state
      const updatedUser: User = {
        ...state.user,
        plan,
        credits: plan === 'advanced' ? -1 : plan === 'pro' ? 50 : state.user.credits,
      }
      // Update stored users
      const users = getStoredUsers()
      const idx = users.findIndex((u) => u.id === updatedUser.id)
      if (idx >= 0) {
        users[idx] = { ...users[idx], plan: updatedUser.plan, credits: updatedUser.credits }
        saveUsers(users)
      }
      saveSession(updatedUser)
      return { user: updatedUser }
    })
  },

  useCredit: () => {
    const state = get()
    if (!state.user) return false
    if (state.user.plan === 'advanced' || state.user.credits === -1) return true
    if (state.user.credits <= 0) return false
    const newCredits = state.user.credits - 1
    const updatedUser: User = { ...state.user, credits: newCredits }
    // Update stored users
    const users = getStoredUsers()
    const idx = users.findIndex((u) => u.id === updatedUser.id)
    if (idx >= 0) {
      users[idx] = { ...users[idx], credits: newCredits }
      saveUsers(users)
    }
    saveSession(updatedUser)
    set({ user: updatedUser })
    return true
  },

  addCredits: (amount) => {
    set((state) => {
      if (!state.user || state.user.credits === -1) return state
      const updatedUser: User = { ...state.user, credits: state.user.credits + amount }
      const users = getStoredUsers()
      const idx = users.findIndex((u) => u.id === updatedUser.id)
      if (idx >= 0) {
        users[idx] = { ...users[idx], credits: updatedUser.credits }
        saveUsers(users)
      }
      saveSession(updatedUser)
      return { user: updatedUser }
    })
  },

  getCreditCost: (conversationCount: number) => {
    const state = get()
    if (!state.user) return 1
    if (state.user.plan === 'advanced') return 0
    if (state.user.plan === 'pro') return conversationCount >= 50 ? 1 : 1
    return 1
  },

  canUseFeature: (feature: string) => {
    const state = get()
    if (!state.user) return false

    const plan = state.user.plan

    const freeFeatures = ['basic_feedback', 'limited_personas', 'profile_analysis']
    const proFeatures = [
      ...freeFeatures,
      'conversation_history',
      'analytics_dashboard',
      'ai_image_generation',
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
}))
