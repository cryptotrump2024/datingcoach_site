import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { MessageCircle, Brain, Shield, ArrowRight, Users, Globe, Calendar, MessageSquare } from 'lucide-react'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const chapters = [
  { label: 'The Problem', text: 'We have all been there. You match with someone incredible. The photos are perfect. The moment arrives to send that first message, and your mind goes blank. You type "hey" and stare at the screen. Hours pass. She does not reply. Another match lost to awkward silence.' },
  { label: 'The Realization', text: 'It was not just us. Looking around at our friends, we saw the same pattern. Smart, successful, genuinely good people who just could not translate their real-life personality into a text conversation. The dating world moved digital, but our communication skills did not evolve with it.' },
  { label: 'The Journey', text: 'We spent years studying what actually works. We read psychology research on attraction, analyzed thousands of successful conversations, talked to dating coaches, and interviewed people about what makes them actually want to respond. The patterns were clear, but learning them took YEARS of trial, error, and painful rejection.' },
  { label: 'The Solution', text: 'We built DatingCoach to shortcut that journey. Instead of learning through real rejection, you practice in a safe space with lifelike personas that react exactly like real people would. Every message you send gets analyzed. Every conversation teaches you something. You build real skills, not gimmicks, not pickup lines, just genuine confidence in your ability to connect.' },
  { label: 'The Mission', text: 'Today, thousands of people use DatingCoach to transform their dating lives. Not because they want to be someone they are not, but because they want to be the best version of themselves when it matters most. If you have ever stared at your phone wondering what to say, you are exactly who we built this for.' },
]

const stats = [
  { icon: <Calendar className="w-6 h-6" />, value: '2024', label: 'Founded' },
  { icon: <Users className="w-6 h-6" />, value: '1.5K+', label: 'Active Users' },
  { icon: <Globe className="w-6 h-6" />, value: '40+', label: 'Countries' },
  { icon: <MessageSquare className="w-6 h-6" />, value: '15K+', label: 'Conversations' },
]

const team = [
  { role: 'The Conversation Analyst', desc: 'Years studying the patterns that make people connect and the mistakes that push them apart.', hue: 345 },
  { role: 'The Psychology Researcher', desc: 'Academic background in behavioral psychology. Maps the science of attraction to practical strategies.', hue: 270 },
  { role: 'The Product Builder', desc: 'Obsessed with building tools that actually work. Believes technology should make us better humans.', hue: 30 },
]

const values = [
  { icon: <MessageCircle className="w-8 h-8" />, title: 'Authenticity Over Gimmicks', desc: 'We teach genuine connection, not manipulation. Real confidence comes from being your best self, not pretending to be someone else.', color: '#E11D48' },
  { icon: <Brain className="w-8 h-8" />, title: 'Science-Backed Methods', desc: 'Every technique we teach is grounded in peer-reviewed psychology research on communication, attraction, and relationship dynamics.', color: '#7C3AED' },
  { icon: <Shield className="w-8 h-8" />, title: 'Privacy First', desc: 'Your conversations and data are encrypted and never sold. What you practice here stays here. Period.', color: '#059669' },
]

export default function About() {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const ref4 = useRef<HTMLDivElement>(null)
  const iv1 = useInView(ref1, { once: true, margin: '-10% 0px' })
  const iv2 = useInView(ref2, { once: true, margin: '-10% 0px' })
  const iv3 = useInView(ref3, { once: true, margin: '-10% 0px' })
  const iv4 = useInView(ref4, { once: true, margin: '-10% 0px' })

  return (
    <div className="min-h-[100dvh]" style={{ background: '#FDFBF7' }}>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(225, 29, 72, 0.08) 0%, transparent 60%)' }} />
        <div className="relative max-w-[800px] mx-auto px-6 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOutExpo }} className="text-caption uppercase tracking-[0.15em] block mb-4" style={{ color: '#A8A29E' }}>Our Story</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }} className="text-display-section gradient-text mb-6">Why We Built DatingCoach</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }} className="text-body-lg" style={{ color: '#57534E' }}>
            We were just regular people who could not figure out what to text. So we studied the science, practiced relentlessly, and built the tool we wished we had years ago.
          </motion.p>
        </div>
      </section>

      <section ref={ref1} className="relative py-32" style={{ background: '#FDFBF7' }}>
        <div className="max-w-[800px] mx-auto px-6">
          {chapters.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 50 }} animate={iv1 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15, ease: easeOutExpo }} className="mb-16 last:mb-0">
              <span className="text-caption uppercase tracking-[0.15em] font-medium block mb-3" style={{ color: '#E11D48' }}>{c.label}</span>
              <p className="text-body-lg leading-[1.75]" style={{ color: '#57534E' }}>{c.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section ref={ref2} className="relative py-24" style={{ background: '#F6F1E9' }}>
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={iv2 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1, ease: easeOutExpo }} className="text-center glass-card p-6">
                <div className="flex justify-center mb-3" style={{ color: '#BE123C' }}>{s.icon}</div>
                <div className="text-heading-xl font-bold text-text-primary">{s.value}</div>
                <div className="text-caption mt-1" style={{ color: '#A8A29E' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ref3} className="relative py-32" style={{ background: '#FDFBF7' }}>
        <div className="max-w-[1000px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={iv3 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: easeOutExpo }} className="text-center mb-16">
            <h2 className="text-display-subsection gradient-text mb-4">The Team Behind DatingCoach</h2>
            <p className="text-body-lg" style={{ color: '#57534E' }}>Anonymous by design. Our work speaks for itself.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <motion.div key={m.role} initial={{ opacity: 0, y: 40 }} animate={iv3 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 * i, ease: easeOutExpo }} className="glass-card p-8 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white" style={{ background: `linear-gradient(135deg, hsl(${m.hue}, 50%, 35%), hsl(${m.hue + 30}, 40%, 25%))` }}>{m.role.charAt(4)}</div>
                <h3 className="text-heading-md text-text-primary mb-3">{m.role}</h3>
                <p className="text-body-sm" style={{ color: '#57534E' }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ref4} className="relative py-32" style={{ background: '#F6F1E9' }}>
        <div className="max-w-[1000px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={iv4 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: easeOutExpo }} className="text-center mb-16">
            <h2 className="text-display-subsection gradient-text mb-4">What We Stand For</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 40 }} animate={iv4 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.12 * i, ease: easeOutExpo }} className="glass-card p-8" style={{ borderLeft: `3px solid ${v.color}` }}>
                <div className="mb-4" style={{ color: v.color }}>{v.icon}</div>
                <h3 className="text-heading-md text-text-primary mb-3">{v.title}</h3>
                <p className="text-body-sm leading-relaxed" style={{ color: '#57534E' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32" style={{ background: '#FDFBF7' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(225, 29, 72, 0.1) 0%, transparent 50%)' }} />
        <div className="relative max-w-[600px] mx-auto px-6 text-center">
          <h2 className="text-display-subsection text-text-primary mb-4">Ready to Start Your Journey?</h2>
          <p className="text-body-lg mb-8" style={{ color: '#57534E' }}>Every expert was once a beginner. Your first conversation practice is free.</p>
          <Link to="/create" className="inline-flex items-center gap-2 btn-gradient text-text-primary text-body-lg font-semibold px-8 py-4 rounded-full shadow-glow-rose hover:scale-105 transition-transform">
            Start Practicing Now<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
