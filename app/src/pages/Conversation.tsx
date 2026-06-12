import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Brain,
  Settings,
  X,
  Send,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Star,
  Eye,
  Zap,
  RotateCcw,
  Flag,
  MessageCircle,
} from 'lucide-react'
import { useStore } from '@/store'
import type { Persona, Message, MessageAnalysis } from '@/store'
import {
  generateResponse,
  generateAnalysis,
  getInitialGreeting,
  getPhaseTransitionMessage,
  getDifficultyColor,
  generateId,
  phases,
} from '@/lib/conversation-engine'

// ─── Typing Indicator Component ────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="flex items-end gap-2 mb-4 max-w-[70%]"
    >
      <div
        className="px-4 py-3 flex items-center gap-1.5"
        style={{
          background: 'rgba(18, 18, 26, 0.6)',
          backdropFilter: 'blur(16px)',
          borderLeft: '3px solid #F472B6',
          borderRadius: '0 20px 20px 20px',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeftWidth: 3,
          borderLeftColor: '#F472B6',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#52525B]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Message Bubble Components ─────────────────────────────────────────────

function HerMessageBubble({
  message,
  persona,
}: {
  message: Message
  persona: Persona
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="flex items-end gap-2 mb-4 max-w-[70%]"
    >
      <img
        src={persona.image || '/persona-sophia.jpg'}
        alt={persona.name}
        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
        style={{ border: '2px solid rgba(225, 29, 72, 0.3)' }}
      />
      <div
        className="px-5 py-3"
        style={{
          background: 'rgba(18, 18, 26, 0.6)',
          backdropFilter: 'blur(16px)',
          borderLeft: '3px solid #F472B6',
          borderRadius: '0 20px 20px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p className="text-body text-[#F5F5F7] leading-relaxed">{message.content}</p>
        <p className="text-caption text-[#52525B] mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

function YourMessageBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="flex justify-end mb-4 max-w-[70%] ml-auto"
    >
      <div
        className="px-5 py-3"
        style={{
          background: 'linear-gradient(135deg, #E11D48, #BE123C)',
          borderRadius: '20px 20px 0 20px',
        }}
      >
        <p className="text-body text-white leading-relaxed">{message.content}</p>
        <p className="text-caption text-white/50 mt-1 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

function SystemMessageBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
      className="flex justify-center my-4"
    >
      <span
        className="px-4 py-2 rounded-xl text-body-sm text-[#52525B]"
        style={{ background: '#1A1A25' }}
      >
        {message.content}
      </span>
    </motion.div>
  )
}

// ─── Star Rating ───────────────────────────────────────────────────────────

function StarRating({ stars, size = 16 }: { stars: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: s * 0.08, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        >
          <Star
            size={size}
            className={s <= stars ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#1A1A25]'}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Analysis Card ─────────────────────────────────────────────────────────

function AnalysisCard({
  analysis,
  isLatest,
}: {
  analysis: MessageAnalysis
  isLatest: boolean
}) {
  const [expanded, setExpanded] = useState(isLatest)

  const sections = [
    {
      key: 'subtext',
      title: "What She's Really Saying",
      content: analysis.subtext,
      icon: Eye,
      color: '#E11D48',
    },
    {
      key: 'psychology',
      title: 'The Psychology',
      content: analysis.psychology,
      icon: Brain,
      color: '#8B5CF6',
    },
    {
      key: 'advice',
      title: 'Your Move',
      content: analysis.advice,
      icon: Zap,
      color: '#F59E0B',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="mb-3"
      style={{
        background: 'rgba(18, 18, 26, 0.6)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <StarRating stars={analysis.stars} />
          </div>
          <span className="text-heading-sm text-[#F5F5F7]">Score: {analysis.score}/5</span>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-[#52525B]" />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <div
                    key={section.key}
                    className="p-3 rounded-xl"
                    style={{
                      borderLeft: `3px solid ${section.color}`,
                      background: 'rgba(10, 10, 15, 0.4)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon size={16} style={{ color: section.color }} />
                      <span className="text-body-sm font-semibold text-[#F5F5F7]">{section.title}</span>
                    </div>
                    <p className="text-body-sm text-[#A1A1AA] leading-relaxed">{section.content}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Conversation Component ───────────────────────────────────────────

export default function Conversation() {
  const navigate = useNavigate()
  const {
    selectedPersona,
    currentConversation,
    addMessage,
    addAnalysis,
    updateConversationPhase,
    isAnalysisOpen,
    setIsAnalysisOpen,
    endConversation,
    setCurrentConversation,
  } = useStore()

  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false)

  const persona = selectedPersona
  const messages = currentConversation?.messages || []
  const analyses = currentConversation?.analyses || []
  const currentPhase = currentConversation?.phase || 0
  const phaseName = currentConversation?.phaseName || 'Opener'

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Start conversation with initial greeting
  useEffect(() => {
    if (!persona || !currentConversation || hasStartedRef.current) return
    hasStartedRef.current = true

    if (messages.length === 0) {
      // Add system message
      const sysMsg: Message = {
        id: generateId(),
        role: 'system',
        content: `Conversation started with ${persona.name} · ${persona.scenario} · ${persona.difficulty}`,
        timestamp: Date.now(),
      }
      addMessage(sysMsg)

      // Simulate initial greeting after delay
      setIsTyping(true)
      const greeting = getInitialGreeting(persona)
      const delay = 1500 + Math.random() * 1500

      setTimeout(() => {
        setIsTyping(false)
        const herMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: greeting,
          timestamp: Date.now(),
          phase: 'Opener',
        }
        addMessage(herMsg)
      }, delay)
    }
  }, [persona, currentConversation, messages.length, addMessage])

  // Handle sending a message
  const handleSend = useCallback(() => {
    if (!inputText.trim() || !persona || !currentConversation || isTyping) return

    const trimmed = inputText.trim()
    setInputText('')

    // Add user message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }
    addMessage(userMsg)

    // Start typing indicator
    setIsTyping(true)

    // Generate response
    const userMessageCount = messages.filter((m) => m.role === 'user').length
    const result = generateResponse(persona, trimmed, currentPhase, userMessageCount)

    // Delay then send her response
    setTimeout(() => {
      setIsTyping(false)

      const herMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: result.message,
        timestamp: Date.now(),
        phase: phaseName,
      }
      addMessage(herMsg)

      // Generate and add analysis
      const analysis = generateAnalysis(persona, trimmed, result.message, currentPhase, phaseName)
      addAnalysis(analysis)

      // Check phase transition
      if (result.phaseTransition && result.phaseTransition !== phaseName) {
        const newPhaseIdx = phases.findIndex((p) => p.name === result.phaseTransition)
        if (newPhaseIdx >= 0) {
          updateConversationPhase(newPhaseIdx, result.phaseTransition)

          // Add system message for phase transition
          setTimeout(() => {
            const sysMsg: Message = {
              id: generateId(),
              role: 'system',
              content: getPhaseTransitionMessage(result.phaseTransition || ''),
              timestamp: Date.now(),
            }
            addMessage(sysMsg)
          }, 500)
        }
      }
    }, result.delay)
  }, [
    inputText,
    persona,
    currentConversation,
    isTyping,
    messages,
    currentPhase,
    phaseName,
    addMessage,
    addAnalysis,
    updateConversationPhase,
  ])

  // Handle key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  // End conversation
  const handleEndConversation = () => {
    endConversation()
    const convId = currentConversation?.id || generateId()
    navigate(`/review/${convId}`)
  }

  // Restart conversation
  const handleRestart = () => {
    hasStartedRef.current = false
    if (!persona) return
    const conversationId = generateId()
    setCurrentConversation({
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
  }

  // Redirect if no persona
  if (!persona) {
    return (
      <div
        className="min-h-[100dvh] flex flex-col items-center justify-center px-6"
        style={{ background: 'var(--bg-primary)' }}
      >
        <h2 className="text-heading-xl text-[#F5F5F7] mb-4">No Persona Selected</h2>
        <p className="text-body-lg text-[#A1A1AA] mb-8 text-center">
          Create a persona first to start practicing conversations.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/create')}
          className="btn-gradient text-white text-heading-sm font-semibold px-8 py-3 rounded-full"
        >
          Create Persona
        </motion.button>
      </div>
    )
  }

  const diffColor = getDifficultyColor(persona.difficulty)

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ─── Chat Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="flex-shrink-0 h-[72px] flex items-center justify-between px-4 lg:px-6"
        style={{
          background: 'rgba(10, 10, 15, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Left Group */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1A1A25] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <img
            src={persona.image || '/persona-sophia.jpg'}
            alt={persona.name}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: '2px solid rgba(225, 29, 72, 0.3)' }}
          />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-heading-sm text-[#F5F5F7]">{persona.name}</span>
              <span
                className="text-caption font-mono uppercase px-2 py-0.5 rounded-full hidden sm:inline"
                style={{ background: `${diffColor}20`, color: diffColor }}
              >
                {persona.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#10B981]"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-caption text-[#52525B]">Online</span>
              {isTyping && <span className="text-caption text-[#52525B]"> · typing...</span>}
            </div>
          </div>
        </div>

        {/* Center - Phase + Scenario */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#1A1A25' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-caption text-[#A1A1AA]">Phase {currentPhase + 1}:</span>
            <span className="text-caption font-semibold text-[#F5F5F7]">{phaseName}</span>
          </div>
          <span
            className="text-caption px-3 py-1.5 rounded-full hidden lg:inline"
            style={{ background: '#1A1A25', color: '#52525B' }}
          >
            {persona.scenario}
          </span>
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-1">
          {/* Analysis Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{
              background: isAnalysisOpen ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: isAnalysisOpen ? '#8B5CF6' : '#A1A1AA',
            }}
          >
            <Brain className="w-5 h-5" />
          </motion.button>

          {/* Settings */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[#1A1A25] transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showSettings && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSettings(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-20"
                    style={{
                      background: 'rgba(18, 18, 26, 0.95)',
                      backdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowSettings(false)
                        handleRestart()
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-body-sm text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-[rgba(255,255,255,0.04)] transition-colors text-left"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restart Conversation
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(false)
                        setShowEndConfirm(true)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-body-sm text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors text-left"
                    >
                      <Flag className="w-4 h-4" />
                      End Conversation
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* End Conversation */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEndConfirm(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* ─── Main Content Area ───────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            background: 'rgba(10, 10, 15, 0.95)',
          }}
        >
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 lg:px-6 py-4"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(225,29,72,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,92,246,0.03) 0%, transparent 50%)',
            }}
          >
            {messages.length === 0 && !isTyping && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.2)' }}
                  >
                    <MessageCircle className="w-8 h-8 text-[#E11D48]" />
                  </div>
                  <h3 className="text-heading-md text-[#F5F5F7] mb-2">Say something to {persona.name}</h3>
                  <p className="text-body-sm text-[#52525B] max-w-sm">
                    Start the conversation. She&apos;s waiting for your first message.
                  </p>
                </motion.div>
              </div>
            )}

            {messages.map((msg) => {
              if (msg.role === 'assistant') {
                return <HerMessageBubble key={msg.id} message={msg} persona={persona} />
              }
              if (msg.role === 'user') {
                return <YourMessageBubble key={msg.id} message={msg} />
              }
              return <SystemMessageBubble key={msg.id} message={msg} />
            })}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex-shrink-0 px-4 lg:px-6 py-4"
            style={{
              background: 'rgba(10, 10, 15, 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${persona.name}...`}
                  disabled={isTyping}
                  className="w-full px-5 py-3 rounded-full text-body text-[#F5F5F7] outline-none transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: 'rgba(18, 18, 26, 0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(225, 29, 72, 0.3)'
                    e.target.style.boxShadow = '0 0 20px rgba(225, 29, 72, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(255,255,255,0.08)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <motion.button
                whileHover={inputText.trim() && !isTyping ? { scale: 1.08 } : {}}
                whileTap={inputText.trim() && !isTyping ? { scale: 0.92 } : {}}
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30"
                style={{
                  background:
                    inputText.trim() && !isTyping
                      ? 'linear-gradient(135deg, #E11D48, #BE123C)'
                      : '#1A1A25',
                }}
              >
                <Send className="w-[18px] h-[18px] text-white" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ─── Analysis Panel ─────────────────────────────────────────── */}
        <AnimatePresence>
          {isAnalysisOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="hidden lg:flex w-[40%] xl:w-[380px] flex-shrink-0 flex-col"
              style={{
                background: 'rgba(10, 10, 15, 0.95)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 pb-2">
                <div>
                  <h3 className="text-heading-md text-[#F5F5F7]">Message Analysis</h3>
                  <p className="text-body-sm text-[#52525B]">Understanding the invisible layer</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAnalysisOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[#52525B] hover:text-[#F5F5F7] hover:bg-[#1A1A25] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Analysis Cards */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {analyses.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Brain className="w-12 h-12 text-[#52525B] mx-auto mb-4" />
                      <p className="text-body-sm text-[#52525B]">
                        Send messages to see real-time analysis of her responses.
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  analyses.map((analysis, idx) => (
                    <AnalysisCard
                      key={analysis.messageId}
                      analysis={analysis}
                      isLatest={idx === analyses.length - 1}
                    />
                  ))
                )}
              </div>

              {/* Stats Footer */}
              {analyses.length > 0 && (
                <div
                  className="p-4 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-[#52525B]">Average Score</span>
                    <div className="flex items-center gap-2">
                      <StarRating
                        stars={Math.round(analyses.reduce((acc, a) => acc + a.score, 0) / analyses.length)}
                        size={14}
                      />
                      <span className="text-body-sm font-semibold text-[#F5F5F7]">
                        {(analyses.reduce((acc, a) => acc + a.score, 0) / analyses.length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-caption text-[#52525B]">Messages Analyzed</span>
                    <span className="text-body-sm font-semibold text-[#F5F5F7]">{analyses.length}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── End Conversation Confirmation Modal ──────────────────────── */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-4"
            style={{ background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="w-full max-w-md p-8 rounded-[24px]"
              style={{
                background: 'rgba(18, 18, 26, 0.95)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <h3 className="text-heading-lg text-[#F5F5F7] mb-2 text-center">End Conversation?</h3>
              <p className="text-body text-[#A1A1AA] mb-8 text-center">
                You&apos;ll be taken to a review page with your performance analysis.
              </p>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-full text-heading-sm font-semibold text-[#A1A1AA] transition-all duration-200 hover:text-[#F5F5F7]"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Keep Chatting
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEndConversation}
                  className="flex-1 px-6 py-3 rounded-full text-heading-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #E11D48, #BE123C)' }}
                >
                  End & Review
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
