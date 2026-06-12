import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView, type Transition } from 'framer-motion'
import {
  Shield, Heart, Lock, Zap, ChevronDown, CheckCircle2, XCircle,
  Sparkles, Eye, Users, MessageSquare, TrendingUp, RefreshCw,
  Target, ArrowRight, Brain, Send, Clock, Star, AlertTriangle,
  Lightbulb, Flame, Compass, BookOpen, MessageCircle, ChevronRight,
  FileText, BarChart3, Layers
} from 'lucide-react'

/* ─────────────────── Animation helpers ─────────────────── */

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: easeOutExpo },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
}

/* ─────────────────── Reusable components ─────────────────── */

function SectionLabel({ text, color = 'text-[#52525B]' }: { text: string; color?: string }) {
  return (
    <span className={`text-caption uppercase tracking-[0.12em] ${color}`}>{text}</span>
  )
}

function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: easeOutExpo }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════ HERO SECTION ═══════════════════ */

function HeroSection() {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{ minHeight: '500px' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/science-hero.jpg)' }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-[rgba(10,10,15,0.7)]" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 40%, #0A0A0F 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <SectionLabel text="THE SCIENCE OF CONNECTION" color="text-[#14B8A6]" />
        </motion.div>

        <motion.h1
          className="text-display-section font-semibold text-[#F5F5F7] mt-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
        >
          The Science of{' '}
          <span className="gradient-text">Attraction</span>
        </motion.h1>

        <motion.p
          className="text-body-lg text-[#A1A1AA] mt-6 max-w-[640px] mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
        >
          Evidence-based insights into human connection, communication psychology,
          and relationship dynamics
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="text-caption text-[#52525B]">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-[#52525B]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════ SECTION 1: ATTACHMENT THEORY ═══════════════════ */

const attachmentStyles = [
  {
    icon: Shield,
    title: 'Secure Attachment',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.25)',
    description: 'Comfortable with intimacy and independence. Responds well to direct communication.',
    recognize: ['Maintains healthy boundaries', 'Communicates needs openly', 'Handles conflict constructively'],
    approach: ['Be direct and honest', 'Respect their independence', 'They\u2019ll meet you halfway'],
  },
  {
    icon: Heart,
    title: 'Anxious Attachment',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.25)',
    description: 'Craves closeness, fears abandonment. Needs reassurance but too much pushes them away.',
    recognize: ['Seeks frequent validation', 'Overthinks delayed responses', 'Becomes clingy under stress'],
    approach: ['Provide consistent reassurance', 'Don\u2019t play games', 'Be patient but set boundaries'],
  },
  {
    icon: Lock,
    title: 'Avoidant Attachment',
    color: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.25)',
    description: 'Values independence, uncomfortable with closeness. Needs space to feel safe.',
    recognize: ['Pulls away when things get close', 'Difficulty expressing emotions', 'Values alone time highly'],
    approach: ['Give them space', 'Don\u2019t chase or pressure', 'Let them come to you'],
  },
  {
    icon: Zap,
    title: 'Disorganized Attachment',
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.25)',
    description: 'Mixed signals, unpredictable. Requires patience and consistency.',
    recognize: ['Hot and cold behavior', 'Mixed messages', 'Fear of both intimacy and abandonment'],
    approach: ['Be extremely consistent', 'Don\u2019t take push personally', 'Requires the most patience'],
  },
]

function AttachmentSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="attachment" className="py-24 lg:py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel text="DEEP DIVE" color="text-[#8B5CF6]" />
          <h2 className="text-display-subsection font-medium text-[#F5F5F7] mt-4">
            Attachment Theory in Dating
          </h2>
          <p className="text-body-lg text-[#A1A1AA] mt-4 max-w-[600px] mx-auto">
            Understanding your patterns and hers is the foundation of every successful connection
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {attachmentStyles.map((style) => (
            <motion.div
              key={style.title}
              variants={staggerItem}
              className="glass-card-elevated p-8 group hover:-translate-y-2 transition-all duration-300"
              style={
                {
                  borderTop: `4px solid ${style.color}`,
                  '--tw-shadow': `0 8px 40px ${style.glow}`,
                } as React.CSSProperties
              }
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${style.color}15` }}
                >
                  <style.icon className="w-6 h-6" style={{ color: style.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-heading-md text-[#F5F5F7]">{style.title}</h3>
                  <p className="text-body text-[#A1A1AA] mt-2">{style.description}</p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-caption text-[#52525B] uppercase tracking-wider">How to Recognize</span>
                      <ul className="mt-2 space-y-1.5">
                        {style.recognize.map((r) => (
                          <li key={r} className="text-body-sm text-[#A1A1AA] flex items-start gap-2">
                            <Eye className="w-3.5 h-3.5 text-[#52525B] mt-0.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-caption text-[#52525B] uppercase tracking-wider">Best Approach</span>
                      <ul className="mt-2 space-y-1.5">
                        {style.approach.map((a) => (
                          <li key={a} className="text-body-sm text-[#A1A1AA] flex items-start gap-2">
                            <Lightbulb className="w-3.5 h-3.5 text-[#52525B] mt-0.5 flex-shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════ SECTION 2: ATTRACTION FORMULA ═══════════════════ */

const pillars = [
  {
    icon: Sparkles,
    title: 'Novelty',
    color: '#E11D48',
    explanation: 'New experiences trigger dopamine release in the brain, creating excitement and positive associations.',
    example: 'Suggest an unusual date idea instead of the standard coffee or drinks.',
    citation: 'Berridge & Robinson, 1998',
  },
  {
    icon: Eye,
    title: 'Mystery',
    color: '#8B5CF6',
    explanation: 'The unknown creates curiosity and cognitive investment. She thinks about you more when she doesn\'t know everything.',
    example: 'Reveal personal stories gradually rather than all at once.',
    citation: 'Loewenstein, 1994',
  },
  {
    icon: Users,
    title: 'Social Proof',
    color: '#F59E0B',
    explanation: 'Perceived value increases when others validate you. Humans use social signals to make quick judgments.',
    example: 'Mention social activities naturally: "My friend and I were just talking about that..."',
    citation: 'Cialdini, 2001',
  },
  {
    icon: Flame,
    title: 'Emotional Range',
    color: '#14B8A6',
    explanation: 'Taking her through different emotions creates memorable connections. Contrast makes experiences vivid.',
    example: 'Mix humor with sincerity, teasing with genuine compliments.',
    citation: 'Dolcos et al., 2022',
  },
  {
    icon: TrendingUp,
    title: 'Progressive Investment',
    color: '#FB7185',
    explanation: 'Small commitments lead to larger ones through the principle of consistency.',
    example: 'Start with light questions, then gradually ask for more thoughtful responses.',
    citation: 'Cialdini, 2001',
  },
]

function AttractionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="attraction" className="py-24 lg:py-32 px-6 bg-[#12121A]">
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel text="THE FORMULA" color="text-[#F59E0B]" />
          <h2 className="text-display-subsection font-medium text-[#F5F5F7] mt-4">
            What Creates Attraction
          </h2>
          <p className="text-body-lg text-[#A1A1AA] mt-4 max-w-[600px] mx-auto">
            Five psychological pillars that drive genuine romantic interest
          </p>
        </ScrollReveal>

        {/* Visual flow connector */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] -translate-y-1/2">
            <div className="w-full h-full bg-gradient-to-r from-[#E11D48] via-[#8B5CF6] to-[#14B8A6] opacity-20" />
          </div>

          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                variants={staggerItem}
                className="glass-card p-6 text-center group hover:-translate-y-2 hover:shadow-glow-rose transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: `${pillar.color}15` }}
                >
                  <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `${pillar.color}25`, color: pillar.color }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-heading-sm text-[#F5F5F7]">{pillar.title}</h3>
                </div>

                <p className="text-body-sm text-[#A1A1AA] mt-3 leading-relaxed">
                  {pillar.explanation}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-[#1A1A25]">
                  <p className="text-body-sm text-[#F5F5F7] italic">"{pillar.example}"</p>
                </div>

                <p className="text-caption text-[#52525B] mt-3">{pillar.citation}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════ SECTION 3: CONVERSATION PSYCHOLOGY ═══════════════════ */

const readingBetweenLines = [
  { phrase: "I'm fine", meaning: "Usually means she's NOT fine. Testing if you'll dig deeper." },
  { phrase: "Haha (alone)", meaning: "Low investment response. Conversation may be dying." },
  { phrase: "What are you up to?", meaning: "She's thinking about you. This is a very good sign." },
  { phrase: "Short/delayed responses", meaning: "Interest dropping, or she's testing your reaction." },
  { phrase: "Double texting", meaning: "High interest. She's invested in the conversation." },
  { phrase: "We should hang out", meaning: "She's opening the door. You need to lead and make a plan." },
]

const shitTests = [
  { test: "You're probably a player", response: 'Agree & exaggerate: "Yeah, I have a harem of 47 women"' },
  { test: "You're too short/old/young", response: 'Reframe: "Good thing I make up for it in other ways"' },
  { test: "Buy me a drink", response: 'Flip it: "I\'ll buy the first round if you buy the second"' },
]

function ConversationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="conversation" className="py-24 lg:py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel text="COMMUNICATION" color="text-[#14B8A6]" />
          <h2 className="text-display-subsection font-medium text-[#F5F5F7] mt-4">
            How Women Communicate
          </h2>
          <p className="text-body-lg text-[#A1A1AA] mt-4 max-w-[600px] mx-auto">
            Decoding subtext, passing tests, and understanding investment dynamics
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-8"
        >
          {/* Reading Between the Lines */}
          <motion.div variants={staggerItem} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <h3 className="text-heading-lg text-[#F5F5F7]">Reading Between the Lines</h3>
            </div>
            <p className="text-body text-[#A1A1AA] mb-6">
              Women often communicate indirectly. Understanding the real message behind common phrases is a critical skill.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    <th className="text-left text-caption text-[#52525B] uppercase tracking-wider pb-3 pr-4">What She Says</th>
                    <th className="text-left text-caption text-[#52525B] uppercase tracking-wider pb-3">What It Means</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {readingBetweenLines.map((row) => (
                    <tr key={row.phrase}>
                      <td className="py-4 pr-4">
                        <span className="text-body-sm text-[#F5F5F7] font-medium">"{row.phrase}"</span>
                      </td>
                      <td className="py-4 text-body-sm text-[#A1A1AA]">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Shit Tests */}
          <motion.div variants={staggerItem} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#E11D48]/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#E11D48]" />
              </div>
              <h3 className="text-heading-lg text-[#F5F5F7]">Shit Tests & How to Pass Them</h3>
            </div>
            <p className="text-body text-[#A1A1AA] mb-6">
              Shit tests are not insults. They are unconscious tests of your confidence and congruence. She wants to see if you're the real deal. The key is never to get defensive or justify yourself.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    <th className="text-left text-caption text-[#52525B] uppercase tracking-wider pb-3 pr-4">The Test</th>
                    <th className="text-left text-caption text-[#52525B] uppercase tracking-wider pb-3">How to Respond</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {shitTests.map((row) => (
                    <tr key={row.test}>
                      <td className="py-4 pr-4">
                        <span className="text-body-sm text-[#F5F5F7] font-medium">"{row.test}"</span>
                      </td>
                      <td className="py-4 text-body-sm text-[#14B8A6]">{row.response}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Investment & Reciprocity */}
          <motion.div variants={staggerItem} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <h3 className="text-heading-lg text-[#F5F5F7]">Investment & Reciprocity</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-heading-sm text-[#F5F5F7] mb-3">The Principle</h4>
                <p className="text-body text-[#A1A1AA] leading-relaxed">
                  People value what they invest in. The more emotional and cognitive effort she puts into the interaction, the more invested she becomes. Your goal is to create an exchange where she's contributing equally or more.
                </p>
              </div>
              <div>
                <h4 className="text-heading-sm text-[#F5F5F7] mb-3">How to Get Her Investing</h4>
                <ul className="space-y-2.5">
                  {[
                    'Ask questions that require thought, not just yes/no answers',
                    'Get her sharing stories and experiences',
                    'Have her come to your location for the date',
                    'Let her talk about herself. People love that',
                  ].map((tip) => (
                    <li key={tip} className="text-body-sm text-[#A1A1AA] flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-5 rounded-xl bg-[#1A1A25] border border-[rgba(239,68,68,0.15)]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-heading-sm text-[#EF4444]">Warning Signs of Over-Investment</h4>
                  <p className="text-body-sm text-[#A1A1AA] mt-2">
                    If you're always initiating, sending longer messages, apologizing for delays, or rearranging your schedule for her, you're over-investing. Pull back and match her effort level. Scarcity increases perceived value.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════ SECTION 4: TEXTING STRATEGIES ═══════════════════ */

const textingStrategies = [
  {
    icon: Target,
    title: 'The 3-Message Rule',
    description: "Get to the point within 3 exchanges. Don't linger in small talk. Build rapport then pivot to a meetup quickly.",
    color: '#E11D48',
  },
  {
    icon: Star,
    title: 'Emotional Peaks',
    description: "End conversations on a high note. She'll associate you with good feelings and look forward to the next interaction.",
    color: '#F59E0B',
  },
  {
    icon: RefreshCw,
    title: 'Callback Humor',
    description: "Reference inside jokes from previous conversations. Builds rapport and shows you pay attention.",
    color: '#8B5CF6',
  },
  {
    icon: TrendingUp,
    title: 'The Takeaway',
    description: "Occasionally pull back. Scarcity increases value. Being always available makes you taken for granted.",
    color: '#14B8A6',
  },
  {
    icon: Compass,
    title: 'Leading the Dance',
    description: "Always be moving the interaction forward. Have a destination in mind for every conversation.",
    color: '#FB7185',
  },
  {
    icon: Layers,
    title: 'Calibration',
    description: "Match her energy and investment level. Mirror then slightly exceed to maintain leadership.",
    color: '#3B82F6',
  },
]

function TextingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="texting" className="py-24 lg:py-32 px-6 bg-[#12121A]">
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel text="DIGITAL GAME" color="text-[#FB7185]" />
          <h2 className="text-display-subsection font-medium text-[#F5F5F7] mt-4">
            The Art of Texting
          </h2>
          <p className="text-body-lg text-[#A1A1AA] mt-4 max-w-[600px] mx-auto">
            Strategic messaging that builds attraction instead of killing it
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {textingStrategies.map((strategy) => (
            <motion.div
              key={strategy.title}
              variants={staggerItem}
              className="glass-card p-7 group hover:-translate-y-2 hover:shadow-glow-rose transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${strategy.color}15` }}
              >
                <strategy.icon className="w-6 h-6" style={{ color: strategy.color }} />
              </div>
              <h3 className="text-heading-md text-[#F5F5F7] mt-5">{strategy.title}</h3>
              <p className="text-body-sm text-[#A1A1AA] mt-3 leading-relaxed">
                {strategy.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════ SECTION 5: RELATIONSHIP PHASES ═══════════════════ */

const phases = [
  {
    number: '01',
    title: 'Initial Spark',
    context: 'Dating App',
    description: 'Stand out from 100s of matches. Be different. Your opener and first 3 messages determine everything.',
    metrics: 'Response rate, match-to-reply ratio',
    mistakes: 'Generic openers, complimenting looks, being boring',
    color: '#E11D48',
  },
  {
    number: '02',
    title: 'Building Rapport',
    context: 'Getting Number',
    description: "Create enough trust that she wants to continue elsewhere. This is the first milestone.",
    metrics: 'Message count before transition, engagement level',
    mistakes: 'Staying on the app too long, not creating enough comfort',
    color: '#F59E0B',
  },
  {
    number: '03',
    title: 'Deepening Connection',
    context: 'Pre-Date',
    description: 'Build anticipation and comfort for the meeting. She should feel like she knows you a little.',
    metrics: 'Response speed, length of replies, initiative taken',
    mistakes: 'Over-texting, revealing too much, killing mystery',
    color: '#8B5CF6',
  },
  {
    number: '04',
    title: 'The Meeting',
    context: 'First Date',
    description: 'Convert digital chemistry to real-world attraction. The in-person vibe is what seals it.',
    metrics: 'Date quality rating, second date conversion',
    mistakes: 'Interview-style questions, no physical escalation, being too nice',
    color: '#14B8A6',
  },
  {
    number: '05',
    title: 'Maintenance',
    context: 'Relationship',
    description: 'Keep the spark alive through continued growth and novelty. Complacency kills attraction.',
    metrics: 'Emotional connection depth, mutual investment',
    mistakes: 'Becoming predictable, stopping effort, taking her for granted',
    color: '#3B82F6',
  },
]

function PhasesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="phases" className="py-24 lg:py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel text="THE JOURNEY" color="text-[#3B82F6]" />
          <h2 className="text-display-subsection font-medium text-[#F5F5F7] mt-4">
            From First Text to Relationship
          </h2>
          <p className="text-body-lg text-[#A1A1AA] mt-4 max-w-[600px] mx-auto">
            Every successful connection progresses through these five phases
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[5%] right-[5%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-[#E11D48] via-[#8B5CF6] to-[#3B82F6] opacity-20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
            {phases.map((phase) => (
              <motion.div
                key={phase.number}
                variants={staggerItem}
                className="glass-card p-6 text-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{
                      background: `${phase.color}15`,
                      color: phase.color,
                      border: `2px solid ${phase.color}40`,
                    }}
                  >
                    {phase.number}
                  </div>
                </div>

                <span
                  className="text-caption uppercase tracking-wider"
                  style={{ color: phase.color }}
                >
                  {phase.context}
                </span>

                <h3 className="text-heading-sm text-[#F5F5F7] mt-2">{phase.title}</h3>
                <p className="text-body-sm text-[#A1A1AA] mt-3 leading-relaxed">
                  {phase.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-2">
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-[#52525B] mt-0.5 flex-shrink-0" />
                    <span className="text-caption text-[#A1A1AA]">{phase.metrics}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] mt-0.5 flex-shrink-0" />
                    <span className="text-caption text-[#A1A1AA]">{phase.mistakes}</span>
                  </div>
                </div>

                {/* Arrow connector - hidden on last item */}
                {phase.number !== '05' && (
                  <div className="hidden lg:flex absolute right-[-12px] top-[60px] z-20 w-6 h-6 items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-[#52525B]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════ SECTION 6: QUICK TIPS ═══════════════════ */

const dos = [
  'Ask open-ended questions',
  'Use her name in conversation',
  'Share stories, not just facts',
  'Be specific in compliments',
  'Have a clear call-to-action',
  'Match then exceed her energy',
]

const donts = [
  'Double text without response',
  'Send walls of text',
  'Over-compliment',
  'Be always available',
  'Apologize for delayed responses',
  'Ask boring interview questions',
]

function TipsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="tips" className="py-24 lg:py-32 px-6 bg-[#12121A]">
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel text="QUICK REFERENCE" color="text-[#52525B]" />
          <h2 className="text-display-subsection font-medium text-[#F5F5F7] mt-4">
            Quick Reference: Do's and Don'ts
          </h2>
          <p className="text-body-lg text-[#A1A1AA] mt-4 max-w-[600px] mx-auto">
            Print this section. Internalize it. Apply it.
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto"
        >
          {/* DO */}
          <motion.div variants={staggerItem} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              </div>
              <h3 className="text-heading-lg text-[#10B981]">DO</h3>
            </div>
            <ul className="space-y-4">
              {dos.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-body text-[#F5F5F7]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* DON'T */}
          <motion.div variants={staggerItem} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#EF4444]/15 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-[#EF4444]" />
              </div>
              <h3 className="text-heading-lg text-[#EF4444]">DON'T</h3>
            </div>
            <ul className="space-y-4">
              {donts.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <span className="text-body text-[#F5F5F7]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════ CTA SECTION ═══════════════════ */

function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="py-24 lg:py-32 px-6 relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-[640px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          <h2 className="text-display-subsection font-semibold text-[#F5F5F7]">
            Ready to Practice?
          </h2>
        </motion.div>

        <motion.p
          className="text-body-lg text-[#A1A1AA] mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
        >
          Apply these principles in realistic simulations with lifelike personas
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25, ease: easeOutExpo }}
        >
          <button
            onClick={() => navigate('/create')}
            className="btn-gradient text-[#F5F5F7] text-body font-semibold px-10 py-4 rounded-full inline-flex items-center gap-3"
          >
            Start Practicing
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */

export default function Science() {
  return (
    <div className="bg-[#0A0A0F]">
      <HeroSection />
      <AttachmentSection />
      <AttractionSection />
      <ConversationSection />
      <TextingSection />
      <PhasesSection />
      <TipsSection />
      <CTASection />
    </div>
  )
}
