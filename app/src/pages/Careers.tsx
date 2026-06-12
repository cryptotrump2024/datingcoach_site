import { motion } from 'framer-motion'
import { Rocket, Users, Globe, Zap, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const values = [
  { icon: <Rocket className="w-6 h-6" />, title: 'Move Fast', desc: 'We ship quickly and iterate based on what our users tell us.' },
  { icon: <Users className="w-6 h-6" />, title: 'User Obsessed', desc: 'Every decision starts with: what do our users need most right now?' },
  { icon: <Globe className="w-6 h-6" />, title: 'Remote First', desc: 'Work from anywhere. Results matter more than which desk you sit at.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Learn Constantly', desc: 'The dating world changes fast. We stay curious and keep evolving.' },
]

const openings = [
  { title: 'Full-Stack Developer', type: 'Remote', department: 'Engineering', desc: 'Build new features across our React frontend and Node backend. Work on real-time chat, profile analysis, and our conversation engine.' },
  { title: 'Growth Marketing Manager', type: 'Remote', department: 'Marketing', desc: 'Drive user acquisition through TikTok, Instagram, and influencer partnerships. Experiment, measure, and scale what works.' },
  { title: 'Content Creator', type: 'Part-time / Remote', department: 'Content', desc: 'Create engaging short-form video content demonstrating the app. Film screen recordings, write scripts, and grow our social presence.' },
]

export default function Careers() {
  return (
    <div className="min-h-[100dvh] pt-[72px]" style={{ background: '#FDFBF7' }}>
      <section className="relative pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(225, 29, 72, 0.06) 0%, transparent 60%)' }} />
        <div className="relative max-w-[800px] mx-auto px-6 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOutExpo }} className="text-caption uppercase tracking-[0.15em] block mb-4" style={{ color: '#A8A29E' }}>Join the Team</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }} className="text-display-section gradient-text mb-4">Careers at DatingCoach</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }} className="text-body-lg" style={{ color: '#57534E' }}>
            We are a small team building something big. If you are passionate about helping people connect, we want to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * i, ease: easeOutExpo }} className="glass-card p-6 text-center">
                <div className="flex justify-center mb-3" style={{ color: '#BE123C' }}>{v.icon}</div>
                <h3 className="text-heading-sm text-text-primary mb-2">{v.title}</h3>
                <p className="text-body-sm" style={{ color: '#57534E' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOutExpo }} className="text-center mb-10">
            <h2 className="text-display-subsection text-text-primary mb-2">Open Positions</h2>
            <p className="text-body" style={{ color: '#57534E' }}>No open roles at the moment, but we are always on the lookout for great people.</p>
          </motion.div>

          <div className="space-y-4 mb-16">
            {openings.map((job, i) => (
              <motion.div key={job.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 * i, ease: easeOutExpo }} className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-heading-md text-text-primary">{job.title}</h3>
                      <span className="text-caption font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(225,29,72,0.15)', color: '#BE123C' }}>{job.type}</span>
                    </div>
                    <p className="text-caption mb-2" style={{ color: '#A8A29E' }}>{job.department}</p>
                    <p className="text-body-sm" style={{ color: '#57534E' }}>{job.desc}</p>
                  </div>
                  <Link to="/contact" className="flex-shrink-0 btn-gradient text-text-primary text-body-sm font-semibold px-6 py-2.5 rounded-full text-center">Apply</Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }} className="glass-card p-8 text-center">
            <h3 className="text-heading-md text-text-primary mb-3">Do not see your role?</h3>
            <p className="text-body mb-6" style={{ color: '#57534E' }}>We are always open to meeting talented people. Send us a note telling us what you would bring to the team.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 btn-gradient text-text-primary text-body font-semibold px-6 py-3 rounded-full">
              <Mail className="w-4 h-4" />Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
