// @ts-nocheck
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
  Sparkles,
  MessageCircle,
  Sliders,
  Brain,
  Eye,
  Heart,
  Zap,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react'
import Pricing from './Pricing'

/* ─── easing shortcut ─── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]
const easeSpring = [0.34, 1.56, 0.64, 1] as [number, number, number, number]

/* ═══════════════════════════════════════════
   Section 1: Hero
   ═══════════════════════════════════════════ */
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0])
  const y = useTransform(scrollYProgress, [0.6, 1], [0, -40])
  const bgScale = useTransform(scrollYProgress, [0.8, 1], [1, 1.05])

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.12, ease: easeOutExpo },
    }),
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: bgScale }}>
        <img
          src="/hero-bg-mesh.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(10,10,15,0.6)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url(/noise-texture.png)' }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-[900px] mx-auto px-6 text-center flex flex-col items-center"
        style={{ opacity, y }}
      >
        {/* Brand Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glow-border mb-8"
          style={{ background: 'rgba(18,18,26,0.6)', backdropFilter: 'blur(12px)' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FB7185]" />
          <span className="text-caption text-[#FB7185] uppercase tracking-[0.1em]">
            Smart Dating Coach
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-display-hero text-4xl md:text-5xl lg:text-7xl text-text-primary mb-2"
        >
          Master the Conversation.
        </motion.h1>
        <motion.h1
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-display-hero text-4xl md:text-5xl lg:text-7xl gradient-text-rose mb-8"
        >
          Win the Date.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-body-lg text-base md:text-lg text-text-secondary max-w-[90%] md:max-w-[640px] mb-10 leading-[1.7]"
        >
          Practice real conversations with different personalities. Get instant feedback on every
          message, learn what she is really saying, and build the confidence to make genuine
          connections.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center gap-4 mb-10"
        >
          <Link
            to="/create"
            className="flex items-center justify-center gap-2 btn-gradient text-text-primary text-heading-sm font-semibold px-6 md:px-8 py-4 rounded-full w-full md:w-auto"
          >
            Start Your First Conversation
            <MessageCircle className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center justify-center gap-2 text-heading-sm font-semibold text-text-secondary px-6 md:px-8 py-4 rounded-full border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.25)] transition-colors w-full md:w-auto"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Social Proof Mini */}
        <motion.div
          custom={5}
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, delay: 0.6, ease: easeSpring },
            },
          }}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center gap-3"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-bg-primary bg-bg-tertiary flex items-center justify-center overflow-hidden"
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(i * 60 + 200) % 360}, 40%, 30%), hsl(${(i * 60 + 240) % 360}, 40%, 25%))`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24]" />
              ))}
            </div>
            <span className="text-caption text-text-muted">Trusted by 8,500+ guys worldwide</span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-stone-400/30 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-stone-400"
              initial={{ height: '0%', top: '0%' }}
              animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-caption text-text-muted">Scroll to explore</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section 2: Trust Bar
   ═══════════════════════════════════════════ */
function TrustBarSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const publications = [
    { name: "Men's Health", readers: '21M+' },
    { name: 'GQ', readers: '15M+' },
    { name: 'Vice', readers: '30M+' },
    { name: 'Wired', readers: '18M+' },
    { name: 'The Atlantic', readers: '12M+' },
    { name: 'Forbes', readers: '150M+' },
    { name: 'Esquire', readers: '10M+' },
  ]

  return (
    <section
      ref={ref}
      className="relative py-12 overflow-hidden"
      style={{
        background: '#0E0E15',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <span className="text-xs md:text-caption text-text-muted uppercase tracking-[0.2em]">Trusted By Leading Publications</span>
      </motion.div>

      <div className="relative max-w-[1400px] mx-auto overflow-hidden">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #0E0E15, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #0E0E15, transparent)' }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex animate-scroll-left"
          style={{ width: 'max-content' }}
        >
          {[...publications, ...publications, ...publications, ...publications].map((pub, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-8 mx-3 py-3 rounded-xl whitespace-nowrap"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(225,29,72,0.2), rgba(139,92,246,0.2))',
                  color: '#F5F5F7',
                }}
              >
                {pub.name.charAt(0)}
              </div>
              <div>
                <div className="text-body-sm font-semibold text-text-secondary">{pub.name}</div>
                <div className="text-caption text-text-muted">{pub.readers} readers</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-12 md:gap-20 mt-10 px-4 sm:px-6"
      >
        {[
          { value: '1.5K+', label: 'Active Users' },
          { value: '15K+', label: 'Conversations Practiced' },
          { value: '4.8', label: 'Average Rating' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-4xl md:text-[56px] font-bold text-text-primary">{stat.value}</div>
            <div className="text-caption text-text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}


/* ═══════════════════════════════════════════
   Section 3: How It Works
   ═══════════════════════════════════════════ */
function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Step 1: enters at 0.05, holds until 0.30, exits 0.30-0.35
  const step1X = useTransform(scrollYProgress, [0.30, 0.35], ['0%', '-100%'])
  const step1Op = useTransform(scrollYProgress, [0.30, 0.35], [1, 0])
  const step1Rot = useTransform(scrollYProgress, [0.30, 0.35], [0, -5])

  // ── Step 2: enters at 0.32-0.37, holds until 0.55, exits 0.55-0.60
  const step2EnterX = useTransform(scrollYProgress, [0.32, 0.37], ['100%', '0%'])
  const step2EnterOp = useTransform(scrollYProgress, [0.32, 0.37], [0, 1])
  const step2EnterRot = useTransform(scrollYProgress, [0.32, 0.37], [5, 0])
  const step2X = useTransform(scrollYProgress, [0.55, 0.60], ['0%', '-100%'])
  const step2Op = useTransform(scrollYProgress, [0.55, 0.60], [1, 0])
  const step2Rot = useTransform(scrollYProgress, [0.55, 0.60], [0, -5])

  // ── Step 3: enters at 0.57-0.62, holds until 0.80, exits 0.80-0.85
  const step3EnterX = useTransform(scrollYProgress, [0.57, 0.62], ['100%', '0%'])
  const step3EnterOp = useTransform(scrollYProgress, [0.57, 0.62], [0, 1])
  const step3EnterRot = useTransform(scrollYProgress, [0.57, 0.62], [5, 0])
  const step3X = useTransform(scrollYProgress, [0.80, 0.85], ['0%', '-100%'])
  const step3Op = useTransform(scrollYProgress, [0.80, 0.85], [1, 0])
  const step3Rot = useTransform(scrollYProgress, [0.80, 0.85], [0, -5])

  // ── Header
  const headerY = useTransform(scrollYProgress, [0, 0.05], [-40, 0])
  const headerOp = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  // ── Phase 4: all 3 cards stacked (appears after 0.88)
  const allStackedOp = useTransform(scrollYProgress, [0.88, 0.93], [0, 1])
  const allStackedY = useTransform(scrollYProgress, [0.88, 0.93], [80, 0])
  const ctaOp = useTransform(scrollYProgress, [0.93, 0.98], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.93, 0.98], [30, 0])

  const stackSteps = [
    {
      num: '01',
      icon: <Sliders className="w-8 h-8 text-[#E11D48]" />,
      title: 'Pick Your Practice Partner',
      shortDesc: 'Choose personality, difficulty, and vibe.',
      glow: 'rgba(225, 29, 72, 0.15)',
    },
    {
      num: '02',
      icon: <MessageCircle className="w-8 h-8 text-[#F59E0B]" />,
      title: "Chat Like It's Real",
      shortDesc: 'Natural back and forth with realistic responses.',
      glow: 'rgba(245, 158, 11, 0.15)',
    },
    {
      num: '03',
      icon: <Brain className="w-8 h-8 text-[#8B5CF6]" />,
      title: 'Learn What She Really Means',
      shortDesc: 'AI breaks down the hidden subtext in every message.',
      glow: 'rgba(139, 92, 246, 0.15)',
    },
  ]

  const steps = [
    {
      num: '01',
      icon: <Sliders className="w-12 h-12 text-[#E11D48]" />,
      title: 'Pick Your Practice Partner',
      desc: "Build your ideal practice partner. Choose her personality, how challenging you want the conversation to be, and what she is like. You get a unique, realistic persona every time.",
      glow: 'rgba(225, 29, 72, 0.15)',
      x: step1X,
      op: step1Op,
      rot: step1Rot,
      enterProgress: [0.05, 0.30],
    },
    {
      num: '02',
      icon: <MessageCircle className="w-12 h-12 text-[#F59E0B]" />,
      title: "Chat Like It's Real",
      desc: "Jump into a natural conversation. She responds with realistic timing, real emotions, and the kind of reactions you'd actually get on a dating app. No scripts, just genuine back and forth.",
      glow: 'rgba(245, 158, 11, 0.15)',
      x: step2EnterX,
      op: step2EnterOp,
      rot: step2EnterRot,
      exitX: step2X,
      exitOp: step2Op,
      exitRot: step2Rot,
      enterProgress: [0.37, 0.55],
    },
    {
      num: '03',
      icon: <Brain className="w-12 h-12 text-[#8B5CF6]" />,
      title: "Learn What She Really Means",
      desc: "Every message gets analyzed for hidden meaning, emotional dynamics, and what is really going on underneath. Understand the stuff most guys completely miss.",
      glow: 'rgba(139, 92, 246, 0.15)',
      x: step3EnterX,
      op: step3EnterOp,
      rot: step3EnterRot,
      exitX: step3X,
      exitOp: step3Op,
      exitRot: step3Rot,
      enterProgress: [0.62, 0.80],
    },
  ]

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative"
      style={{ height: '350vh' }}
    >
      <div className="sticky top-0 h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: '#0A0A0F' }}
      >
        {/* Radial gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(225, 29, 72, 0.08) 0%, transparent 60%)' }}
        />

        {/* Section Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOp }}
          className="absolute top-16 left-0 right-0 text-center z-10"
        >
          <h2 className="text-display-subsection text-4xl md:text-[56px] text-text-primary">How It Works</h2>
        </motion.div>

        {/* ── Individual Step Cards (Phases 1-3) — desktop only */}
        <div className="hidden md:block">
          <motion.div
            className="relative w-full max-w-[640px] mx-auto px-6"
            style={{ opacity: useTransform(scrollYProgress, [0.85, 0.88], [1, 0]) }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                style={{
                  x: step.x,
                  opacity: step.op,
                  rotateZ: step.rot,
                }}
                className={`${i > 0 ? 'relative w-full md:absolute md:inset-0' : 'relative w-full'}`}
              >
                {/* Decorative step number */}
                <div
                  className="absolute -top-20 left-1/2 -translate-x-1/2 text-display-hero text-7xl md:text-[120px] font-display pointer-events-none select-none"
                  style={{ color: 'rgba(82, 82, 91, 0.15)' }}
                >
                  {step.num}
                </div>

                <div
                  className="glass-card p-6 md:p-12"
                  style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4), 0 0 60px ${step.glow}` }}
                >
                  <div className="mb-6">{step.icon}</div>
                  <h3 className="text-heading-lg text-xl md:text-2xl text-text-primary mb-4">{step.title}</h3>
                  <p className="text-body text-sm md:text-[15px] text-text-secondary leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile: Static stacked cards */}
        <div className="md:hidden flex flex-col gap-4 mt-8 px-4">
          {stackSteps.map((step) => (
            <div
              key={step.num}
              className="glass-card p-5 flex items-start gap-4"
              style={{
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4), 0 0 40px ${step.glow}`,
              }}
            >
              <div className="flex-shrink-0 mt-0.5">{step.icon}</div>
              <div>
                <h3 className="text-heading-sm text-text-primary mb-1">{step.title}</h3>
                <p className="text-body-sm text-text-secondary">{step.shortDesc}</p>
              </div>
              <span
                className="ml-auto text-display-subsection font-display flex-shrink-0"
                style={{ color: 'rgba(82, 82, 91, 0.25)' }}
              >
                {step.num}
              </span>
            </div>
          ))}

          {/* CTA */}
          <div className="text-center mt-6">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 btn-gradient text-text-primary text-body font-semibold px-6 py-3 rounded-full"
            >
              <Sparkles className="w-4 h-4" />
              Get Started Now
            </Link>
          </div>
        </div>

        {/* ── Phase 4: All Steps Stacked — desktop only */}
        <motion.div
          className="hidden md:flex absolute inset-0 flex-col items-center justify-center px-6"
          style={{ opacity: allStackedOp, y: allStackedY }}
        >
          <p className="text-caption text-text-muted uppercase tracking-[0.12em] mb-6">
            All the steps at a glance
          </p>

          <div className="flex flex-col gap-4 w-full max-w-[520px]">
            {stackSteps.map((step) => (
              <div
                key={step.num}
                className="glass-card p-5 flex items-start gap-4"
                style={{
                  transform: 'scale(0.85)',
                  transformOrigin: 'center',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4), 0 0 40px ${step.glow}`,
                }}
              >
                <div className="flex-shrink-0 mt-0.5">{step.icon}</div>
                <div>
                  <h3 className="text-heading-sm text-text-primary mb-1">{step.title}</h3>
                  <p className="text-body-sm text-text-secondary">{step.shortDesc}</p>
                </div>
                <span
                  className="ml-auto text-display-subsection font-display flex-shrink-0"
                  style={{ color: 'rgba(82, 82, 91, 0.25)' }}
                >
                  {step.num}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="mt-8 text-center"
            style={{ opacity: ctaOp, y: ctaY }}
          >
            <p className="text-body text-text-secondary mb-4">Ready to give it a shot?</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-3 btn-gradient text-text-primary text-body-lg font-semibold px-8 py-4 rounded-full shadow-glow-rose hover:shadow-[0_0_50px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Get Started Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section 4: AI Persona Showcase
   ═══════════════════════════════════════════ */
const personas = [
  { name: 'Sophia', age: 28, ethnicity: 'Italian-American', personality: ['Warm', 'Playful'], difficulty: 'Intermediate', image: '/persona-sophia.jpg', color: '#F59E0B', hairColor: 'Brunette', hairLength: 'Long', eyeColor: 'Brown', bodyType: 'Slim', height: "Average (5'3 - 5'7)", style: 'Elegant', glasses: false, tattoos: false, piercings: true, archetype: 'The Romantic', bio: 'Sophia is a warm and playful Italian-American who loves cooking and Sunday dinners with family.', scenario: 'Dating App Match' },
  { name: 'Maya', age: 30, ethnicity: 'South Asian', personality: ['Intellectual', 'Sophisticated'], difficulty: 'Advanced', image: '/persona-maya.jpg', color: '#F97316', hairColor: 'Black', hairLength: 'Long', eyeColor: 'Dark Brown', bodyType: 'Slim', height: "Average (5'3 - 5'7)", style: 'Professional', glasses: true, tattoos: false, piercings: false, archetype: 'The Intellectual', bio: 'Maya is a sophisticated intellectual who works in finance and enjoys art galleries and wine tastings.', scenario: 'Dating App Match' },
  { name: 'Chloe', age: 24, ethnicity: 'French', personality: ['Mysterious', 'Romantic'], difficulty: 'Expert', image: '/persona-chloe.jpg', color: '#10B981', hairColor: 'Blonde', hairLength: 'Medium', eyeColor: 'Blue', bodyType: 'Athletic', height: "Petite (under 5'3)", style: 'Edgy', glasses: false, tattoos: true, piercings: true, archetype: 'The Free Spirit', bio: 'Chloe is a mysterious free spirit who travels the world, writes poetry, and lives for spontaneous adventures.', scenario: 'Dating App Match' },
  { name: 'Ava', age: 26, ethnicity: 'East Asian', personality: ['Creative', 'Artistic'], difficulty: 'Advanced', image: '/persona-ava.jpg', color: '#8B5CF6', hairColor: 'Black', hairLength: 'Long', eyeColor: 'Brown', bodyType: 'Slim', height: "Petite (under 5'3)", style: 'Bohemian', glasses: false, tattoos: false, piercings: true, archetype: 'The Girl Next Door', bio: 'Ava is a creative artist who spends her weekends at farmers markets and painting in her studio.', scenario: 'Dating App Match' },
  { name: 'Zara', age: 32, ethnicity: 'Middle Eastern', personality: ['Confident', 'Direct'], difficulty: 'Expert', image: '/persona-zara.jpg', color: '#EF4444', hairColor: 'Black', hairLength: 'Long', eyeColor: 'Hazel', bodyType: 'Curvy', height: "Tall (5'8 - 5'11)", style: 'Elegant', glasses: false, tattoos: false, piercings: false, archetype: 'The Diva', bio: 'Zara is a confident, direct woman who knows what she wants. She runs her own business and does not waste time.', scenario: 'Dating App Match' },
  { name: 'Luna', age: 22, ethnicity: 'Latina', personality: ['Energetic', 'Passionate'], difficulty: 'Beginner', image: '/persona-luna.jpg', color: '#EC4899', hairColor: 'Brunette', hairLength: 'Long', eyeColor: 'Brown', bodyType: 'Curvy', height: "Average (5'3 - 5'7)", style: 'Trendy', glasses: false, tattoos: true, piercings: true, archetype: 'The Free Spirit', bio: 'Luna is an energetic dancer who brings passion to everything she does. She loves salsa, tacos, and late night talks.', scenario: 'Dating App Match' },
  { name: 'Isabella', age: 27, ethnicity: 'Brazilian', personality: ['Passionate', 'Dancer'], difficulty: 'Intermediate', image: '/persona-isabella.jpg', color: '#D946EF', hairColor: 'Brunette', hairLength: 'Very Long', eyeColor: 'Green', bodyType: 'Athletic', height: "Tall (5'8 - 5'11)", style: 'Sporty', glasses: false, tattoos: false, piercings: true, archetype: 'The Romantic', bio: 'Isabella is a passionate Brazilian who teaches yoga, surfs on weekends, and lives for carnival season.', scenario: 'Dating App Match' },
  { name: 'Natasha', age: 31, ethnicity: 'Russian', personality: ['Direct', 'Sophisticated'], difficulty: 'Advanced', image: '/persona-natasha.jpg', color: '#6366F1', hairColor: 'Blonde', hairLength: 'Medium', eyeColor: 'Blue', bodyType: 'Slim', height: "Tall (5'8 - 5'11)", style: 'Professional', glasses: false, tattoos: false, piercings: false, archetype: 'The Intellectual', bio: 'Natasha is a sophisticated analyst who speaks three languages, skis in the Alps, and hosts dinner parties.', scenario: 'Dating App Match' },
  { name: 'Priya', age: 24, ethnicity: 'Indian', personality: ['Warm', 'Family-oriented'], difficulty: 'Beginner', image: '/persona-priya.jpg', color: '#F97316', hairColor: 'Black', hairLength: 'Long', eyeColor: 'Dark Brown', bodyType: 'Curvy', height: "Average (5'3 - 5'7)", style: 'Casual', glasses: true, tattoos: false, piercings: true, archetype: 'The Girl Next Door', bio: 'Priya is a warm family-oriented woman who balances her IT career with traditional values and modern views.', scenario: 'Dating App Match' },
  { name: 'Elena', age: 29, ethnicity: 'Spanish', personality: ['Fiery', 'Independent'], difficulty: 'Expert', image: '/persona-elena.jpg', color: '#EF4444', hairColor: 'Red', hairLength: 'Long', eyeColor: 'Hazel', bodyType: 'Athletic', height: "Average (5'3 - 5'7)", style: 'Edgy', glasses: false, tattoos: true, piercings: true, archetype: 'The Mysterious', bio: 'Elena is a fiery independent woman who left her small town to build a life in the city. She does not do boring.', scenario: 'Dating App Match' },
  { name: 'Yuki', age: 25, ethnicity: 'Japanese', personality: ['Quiet', 'Artistic'], difficulty: 'Intermediate', image: '/persona-yuki.jpg', color: '#06B6D4', hairColor: 'Black', hairLength: 'Short', eyeColor: 'Dark Brown', bodyType: 'Slim', height: "Petite (under 5'3)", style: 'Minimalist', glasses: false, tattoos: false, piercings: false, archetype: 'The Intellectual', bio: 'Yuki is a quiet artistic soul who finds beauty in simplicity. She works as a graphic designer and loves ceramics.', scenario: 'Dating App Match' },
  { name: 'Amina', age: 26, ethnicity: 'Nigerian', personality: ['Confident', 'Ambitious'], difficulty: 'Advanced', image: '/persona-amina.jpg', color: '#8B5CF6', hairColor: 'Black', hairLength: 'Medium', eyeColor: 'Brown', bodyType: 'Athletic', height: "Tall (5'8 - 5'11)", style: 'Trendy', glasses: false, tattoos: false, piercings: true, archetype: 'The Diva', bio: 'Amina is an ambitious entrepreneur building her fashion brand. Confident, stylish, and always networking.', scenario: 'Dating App Match' },
]

function PersonaCard({ persona, onSelect }: { persona: typeof personas[0]; onSelect: (p: typeof personas[0]) => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="glass-card-elevated overflow-hidden flex-shrink-0 w-[85vw] h-[420px] md:w-[280px] md:h-[400px] cursor-pointer relative"
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(persona)}
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={persona.image}
          alt={persona.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex flex-col items-center gap-2"
          >
            <Sparkles className="w-8 h-8 text-[#E11D48]" />
            <span className="text-text-primary font-semibold text-body-lg">Practice with {persona.name}</span>
            <span className="inline-flex items-center gap-1.5 btn-gradient text-text-primary text-body-sm font-semibold px-6 py-2.5 rounded-full mt-1">
              <Sparkles className="w-4 h-4" />
              Select
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-heading-sm text-lg md:text-xl text-text-primary">{persona.name}</h3>
          <span
            className="text-caption uppercase px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${persona.color}20`, color: persona.color }}
          >
            {persona.difficulty}
          </span>
        </div>
        <p className="text-body-sm text-xs md:text-sm text-text-muted mb-2">
          {persona.age}, {persona.ethnicity}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {persona.personality.map((trait) => (
            <span
              key={trait}
              className="text-body-sm text-text-secondary px-2 py-0.5 md:px-2.5 md:py-1 rounded-full"
              style={{ background: '#1A1A25', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function PersonaShowcaseSection() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [scrollPos, setScrollPos] = useState(0)
  const navigate = useNavigate()
  const setPersonaConfig = useStore((s) => s.setPersonaConfig)

  const handleSelectPersona = (persona: typeof personas[0]) => {
    setPersonaConfig({
      name: persona.name,
      age: persona.age,
      ethnicity: persona.ethnicity,
      hairColor: persona.hairColor,
      hairLength: persona.hairLength,
      eyeColor: persona.eyeColor,
      bodyType: persona.bodyType,
      height: persona.height,
      style: persona.style,
      glasses: persona.glasses,
      tattoos: persona.tattoos,
      piercings: persona.piercings,
      archetype: persona.archetype,
      bio: persona.bio,
      difficulty: persona.difficulty,
      scenario: persona.scenario,
      image: persona.image,
    })
    navigate('/create')
  }

  const row1 = personas.slice(0, 6)
  const row2 = personas.slice(6, 12)

  const scroll = (direction: number) => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.85
    scrollRef.current.scrollBy({ left: direction * amount, behavior: 'smooth' })
    setTimeout(() => setScrollPos(scrollRef.current?.scrollLeft || 0), 400)
  }

  const maxScroll = typeof window !== 'undefined' && scrollRef.current
    ? scrollRef.current.scrollWidth - scrollRef.current.clientWidth
    : 1000

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: easeOutExpo },
    }),
  }

  return (
    <section ref={ref} className="relative py-16 md:py-32" style={{ background: '#0A0A0F' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            custom={0}
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-caption text-text-muted uppercase tracking-[0.12em] block mb-4"
          >
            12 Unique Personalities
          </motion.span>
          <motion.h2
            custom={0.1}
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-display-subsection text-4xl md:text-[56px] text-text-primary mb-4"
          >
            Choose Your Practice Partner
          </motion.h2>
          <motion.p
            custom={0.2}
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-base md:text-body-lg text-text-secondary max-w-[90%] md:max-w-[560px] mx-auto"
          >
            From the girl next door to the sophisticated mystery. Each one brings a different challenge.
          </motion.p>
        </div>

        {/* Scroll Container */}
        <div className="relative">
          {/* Left Arrow */}
          {scrollPos > 10 && (
            <button
              onClick={() => scroll(-1)}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 glass-card-elevated w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:scale-110 transition-transform"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow */}
          {scrollPos < maxScroll - 10 && (
            <button
              onClick={() => scroll(1)}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 glass-card-elevated w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:scale-110 transition-transform"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={() => setScrollPos(scrollRef.current?.scrollLeft || 0)}
            className="overflow-x-auto scrollbar-hide px-4 md:px-1"
            style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
          >
            {/* Row 1 - Desktop */}
            <div className="hidden md:flex gap-4 mb-4" style={{ width: 'max-content' }}>
              {row1.map((p) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <PersonaCard persona={p} onSelect={handleSelectPersona} />
                </motion.div>
              ))}
            </div>
            {/* Row 2 - Desktop */}
            <div className="hidden md:flex gap-4" style={{ width: 'max-content' }}>
              {row2.map((p) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25, ease: easeOutExpo }}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <PersonaCard persona={p} onSelect={handleSelectPersona} />
                </motion.div>
              ))}
            </div>
            {/* Single row - Mobile */}
            <div className="flex md:hidden gap-4" style={{ width: 'max-content' }}>
              {personas.map((p) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <PersonaCard persona={p} onSelect={handleSelectPersona} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/create"
            className="group inline-flex items-center gap-3 btn-gradient text-text-primary text-body-lg font-semibold px-8 py-4 rounded-full shadow-glow-rose hover:shadow-[0_0_50px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Create Your Own Persona
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}


/* ═══════════════════════════════════════════
   Section 5: Analysis Preview
   ═══════════════════════════════════════════ */
function AnalysisPreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const labelOp = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  const p1X = useTransform(scrollYProgress, [0.20, 0.35], [60, 0])
  const p1Op = useTransform(scrollYProgress, [0.20, 0.35], [0, 1])

  const p2X = useTransform(scrollYProgress, [0.40, 0.55], [60, 0])
  const p2Op = useTransform(scrollYProgress, [0.40, 0.55], [0, 1])

  const p3X = useTransform(scrollYProgress, [0.60, 0.75], [60, 0])
  const p3Op = useTransform(scrollYProgress, [0.60, 0.75], [0, 1])

  const messages = [
    { role: 'her', text: "Hey! I had a really nice time at dinner last night :)" },
    { role: 'you', text: "Same here! We should do it again sometime. What are you up to this weekend?" },
    { role: 'her', text: "I'm not sure I'm free this weekend, I have a lot going on" },
    { role: 'you', text: "No worries, I'll be at that new spot Saturday either way. If you free up, come through, if not, another time." },
  ]

  const panels = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Hidden Subtext',
      content: "When she says 'I'm not sure I'm free this weekend,' she's testing if you'll keep pushing or give up easy. She's actually interested but wants to see confidence.",
      color: '#E11D48',
      x: p1X,
      op: p1Op,
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Emotional Dynamic',
      content: "She is in observer mode, checking out your vibe. Your response here determines whether she gets invested or checks out. This moment matters.",
      color: '#8B5CF6',
      x: p2X,
      op: p2Op,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Strategic Opportunity',
      content: "Your move: show abundance mentality and keep it low pressure. She is more likely to circle back when she doesn't feel pushed into a corner.",
      color: '#F59E0B',
      x: p3X,
      op: p3Op,
    },
  ]

  return (
    <>
      {/* Desktop: Scroll-driven sticky section */}
      <div className="hidden md:block">
        <section
          ref={containerRef}
          className="relative"
          style={{ height: '250vh' }}
        >
          <div
            className="sticky top-0 h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: '#0A0A0F' }}
          >
        {/* Background */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'url(/conversation-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-bg-primary/80" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full">
          {/* Section Label */}
          <motion.div
            style={{ opacity: labelOp }}
            className="text-center mb-8"
          >
            <span className="text-caption text-[#8B5CF6] uppercase tracking-[0.12em]">
              See What Others Are Saying
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Mock Chat (left) */}
            <motion.div
              style={{ opacity: labelOp }}
              className="flex-1 w-full md:max-w-[45%] glass-panel p-4 md:p-6 space-y-4"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  style={{
                    opacity: useTransform(scrollYProgress, [0.05 + i * 0.025, 0.10 + i * 0.025], [0, 1]),
                    x: useTransform(scrollYProgress, [0.05 + i * 0.025, 0.10 + i * 0.025], [msg.role === 'her' ? -30 : 30, 0]),
                  }}
                  className={`flex ${msg.role === 'her' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 text-body-sm ${
                      msg.role === 'her'
                        ? 'bg-[rgba(255,255,255,0.82)] text-text-primary border-l-[3px] border-[#F472B6] rounded-[0_20px_20px_20px]'
                        : 'bg-gradient-to-r from-[#E11D48] to-[#F59E0B] text-white rounded-[20px_20px_0_20px]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Analysis Panels (right) */}
            <div className="flex-1 w-full md:max-w-[50%] space-y-4">
              {panels.map((panel, i) => (
                <motion.div
                  key={i}
                  style={{ x: panel.x, opacity: panel.op }}
                  className="glass-card p-5 relative"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${panel.color}20`, color: panel.color }}
                    >
                      {panel.icon}
                    </div>
                    <div>
                      <h4 className="text-heading-md text-base md:text-lg text-text-primary mb-2">{panel.title}</h4>
                      <p className="text-body-sm text-xs md:text-[13px] text-text-secondary leading-relaxed">{panel.content}</p>
                    </div>
                  </div>
                  <div
                    className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                    style={{ backgroundColor: panel.color }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>

    {/* Mobile: Static stacked layout */}
    <div className="md:hidden py-16 px-4" style={{ background: '#0A0A0F' }}>
      <div className="text-center mb-8">
        <span className="text-caption text-[#8B5CF6] uppercase tracking-[0.12em]">
          Real-Time Analysis
        </span>
        <h2 className="text-3xl text-text-primary mt-4 mb-4">
          Understand Every Message
        </h2>
        <p className="text-base text-text-secondary">
          Get instant breakdowns of hidden meaning, emotional dynamics, and strategic opportunities.
        </p>
      </div>

      {/* Mock Chat */}
      <div className="glass-panel p-4 space-y-3 mb-6">
        {[
          { role: 'her', text: "Hey! I had a really nice time at dinner last night :)" },
          { role: 'you', text: "Same here! We should do it again sometime. What are you up to this weekend?" },
          { role: 'her', text: "I'm not sure I'm free this weekend, I have a lot going on" },
          { role: 'you', text: "No worries, I'll be at that new spot Saturday either way. If you free up, come through, if not, another time." },
        ].map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'her' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[80%] px-4 py-3 text-sm ${
                msg.role === 'her'
                  ? 'bg-[rgba(255,255,255,0.82)] text-text-primary border-l-[3px] border-[#F472B6] rounded-[0_20px_20px_20px]'
                  : 'bg-gradient-to-r from-[#E11D48] to-[#F59E0B] text-white rounded-[20px_20px_0_20px]'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Analysis Panels */}
      {[
        { icon: <Eye className="w-5 h-5" />, title: 'Hidden Subtext', content: "When she says 'I'm not sure I'm free this weekend,' she's testing if you'll keep pushing or give up easy. She's actually interested but wants to see confidence.", color: '#E11D48' },
        { icon: <Heart className="w-5 h-5" />, title: 'Emotional Dynamic', content: "She is in observer mode, checking out your vibe. Your response here determines whether she gets invested or checks out. This moment matters.", color: '#8B5CF6' },
        { icon: <Zap className="w-5 h-5" />, title: 'Strategic Opportunity', content: "Your move: show abundance mentality and keep it low pressure. She is more likely to circle back when she doesn't feel pushed into a corner.", color: '#F59E0B' },
      ].map((panel, i) => (
        <div key={i} className="glass-card p-5 relative mb-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${panel.color}20`, color: panel.color }}>
              {panel.icon}
            </div>
            <div>
              <h4 className="text-base text-text-primary mb-2">{panel.title}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{panel.content}</p>
            </div>
          </div>
          <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full" style={{ backgroundColor: panel.color }} />
        </div>
      ))}
    </div>
  </>
  )
}

/* ═══════════════════════════════════════════
   Section 6: Testimonials
   ═══════════════════════════════════════════ */
const testimonials = [
  {
    quote: "I went from getting ghosted on every app to having actual conversations that lead somewhere. The feedback on each message showed me exactly what I was doing wrong. Total game changer.",
    name: 'Marcus T.', age: 27, initials: 'MT', hue: 200,
  },
  {
    quote: "The different personalities are wild. Practicing with the 'hard to get' type built my confidence for real convos. Met my girlfriend three weeks after I started using this.",
    name: 'James R.', age: 31, initials: 'JR', hue: 280,
  },
  {
    quote: "I have social anxiety and this was the safe space I needed to practice. No real rejection, just honest feedback. The science behind each interaction made me understand people so much better.",
    name: 'David K.', age: 25, initials: 'DK', hue: 340,
  },
  {
    quote: "The profile analyzer is straight up genius. I uploaded my ex's dating profile as a joke and the breakdown was scary accurate. Now I use it before every date to prep.",
    name: 'Ryan S.', age: 29, initials: 'RS', hue: 40,
  },
  {
    quote: "I have been telling all my boys about this. The conversation scoring broke down things I never even thought about. My text game improved in like two weeks. No joke.",
    name: 'Chris M.', age: 26, initials: 'CM', hue: 160,
  },
  {
    quote: "As a divorced guy getting back into dating after ten years, I felt completely lost. This app taught me how people actually text now. Feels like having a cool older brother who gives solid advice.",
    name: 'Alex P.', age: 38, initials: 'AP', hue: 120,
  },
]

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [scrollPos, setScrollPos] = useState(0)

  const scroll = (direction: number) => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.85
    scrollRef.current.scrollBy({ left: direction * amount, behavior: 'smooth' })
    setTimeout(() => setScrollPos(scrollRef.current?.scrollLeft || 0), 400)
  }

  const maxScroll = typeof window !== 'undefined' && scrollRef.current
    ? scrollRef.current.scrollWidth - scrollRef.current.clientWidth
    : 1000

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-32"
      style={{ background: '#12121A' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="text-caption text-text-muted uppercase tracking-[0.12em] block mb-4"
          >
            Success Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="text-display-subsection text-4xl md:text-[56px] text-text-primary mb-4"
          >
            Real Guys, Real Results
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
            className="text-base md:text-body-lg text-text-secondary max-w-[90%] md:max-w-[500px] mx-auto"
          >
            Join thousands who have transformed their dating lives through practice.
          </motion.p>
        </div>

        {/* Testimonials Scroll Container */}
        <div className="relative">
          {/* Left Arrow */}
          {scrollPos > 10 && (
            <button
              onClick={() => scroll(-1)}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 glass-card-elevated w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:scale-110 transition-transform"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow */}
          {scrollPos < maxScroll - 10 && (
            <button
              onClick={() => scroll(1)}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 glass-card-elevated w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:scale-110 transition-transform"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={() => setScrollPos(scrollRef.current?.scrollLeft || 0)}
            className="overflow-x-auto scrollbar-hide px-4 md:px-1"
            style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
          >
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.12 * i, ease: easeOutExpo }}
                  className="glass-card p-4 md:p-6 w-[300px] md:w-[380px] flex-shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.div
                        key={s}
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.3 + 0.06 * s + i * 0.12, ease: easeSpring }}
                      >
                        <Star className="w-5 h-5 text-[#FBBF24] fill-[#FBBF24]" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm md:text-[15px] text-text-primary italic leading-[1.7] mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-body-sm font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, hsl(${t.hue}, 40%, 30%), hsl(${t.hue + 30}, 40%, 25%))` }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-heading-sm text-text-primary">{t.name}</div>
                      <div className="text-caption text-text-muted">{t.age} years old</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section 8: Final CTA
   ═══════════════════════════════════════════ */
function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-32 overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'url(/hero-bg-mesh.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 15, 0.9) 100%)' }}
      />

      <div className="relative z-10 max-w-[700px] mx-auto px-4 md:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="text-display-section text-3xl md:text-[48px] text-text-primary mb-4"
        >
          Your Next Great Conversation
          <br />
          <span className="gradient-text">Starts Here</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
          className="text-base md:text-body-lg text-text-secondary mb-10"
        >
          Join 1,500+ guys/girls who are practicing smarter, not harder.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
        >
          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 btn-gradient text-text-primary text-heading-sm md:text-heading-md font-semibold px-6 md:px-8 py-4 rounded-full animate-pulse-scale w-full md:w-auto"
          >
            Start Practicing Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-caption text-text-muted mt-8"
        >
          Free forever plan available. Upgrade anytime.
        </motion.p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Section Divider
   ═══════════════════════════════════════════ */
function SectionDivider() {
  return (
    <div
      className="w-full pointer-events-none md:block"
      style={{
        height: '60px',
        background: 'linear-gradient(180deg, #0A0A0F 0%, #0E0E15 50%, #0A0A0F 100%)',
      }}
    />
  )
}

/* ═══════════════════════════════════════════
   Home Page
   ═══════════════════════════════════════════ */
export default function Home() {
  return (
    <div>
      <HeroSection />
      <SectionDivider />
      <TrustBarSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <PersonaShowcaseSection />
      <SectionDivider />
      <AnalysisPreviewSection />
      <SectionDivider />
      <TestimonialsSection />
      <SectionDivider />
      <Pricing />
      <SectionDivider />
      <FinalCTASection />
    </div>
  )
}
