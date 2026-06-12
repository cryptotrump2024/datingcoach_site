import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const faqs = [
  { q: 'What is DatingCoach and how does it work?', a: 'DatingCoach is a conversation practice platform that helps you improve your dating and texting skills through realistic simulations. You create a virtual persona with specific personality traits, difficulty level, and characteristics, then engage in lifelike text conversations. After each message you send, our system analyzes your approach and provides feedback on what works, what does not, and what the other person is really communicating beneath the surface.' },
  { q: 'Is this using real people or bots?', a: 'The conversations are powered by advanced language models, not real people. This is actually the point. You can practice without the fear of real rejection, experiment with different approaches, and learn from your mistakes in a safe environment. The personas are designed to respond with realistic timing, emotional nuance, and authentic reactions based on their personality profiles.' },
  { q: 'How realistic are the conversations?', a: 'Very realistic. Each persona has a unique personality profile, communication style, and emotional range. They respond differently based on your approach, just like real people would. Some will test you with challenging questions, others will be more open from the start. The difficulty level you choose determines how forgiving or demanding the conversation partner will be.' },
  { q: 'What do I get with the free plan?', a: 'The free plan includes 3 conversation simulations and 1 profile analysis. You get access to basic message feedback and a limited selection of personas. It is designed to give you a solid taste of what the platform offers. When you are ready for unlimited practice, deeper analysis, and all persona types, you can upgrade to Pro or Advanced.' },
  { q: 'How does the Profile Analyzer work?', a: 'Upload a screenshot of any dating profile (from Tinder, Bumble, Hinge, etc.) and our system extracts and reads the visible text using optical character recognition. It then analyzes the photos, bio text, and overall presentation to give you a detailed breakdown: red flags to watch for, green flags that signal interest, suggested opening lines, and strategic recommendations for that specific match.' },
  { q: 'Can I practice specific scenarios?', a: 'Yes. You can choose from multiple conversation scenarios including Dating App Opener, Getting Their Number, First Date Planning, Deepening Connection, Ex Re-engagement, and more. Each scenario presents a different challenge and requires a different skill set. Advanced users can also create custom scenarios.' },
  { q: 'Is my data private?', a: 'Absolutely. Your conversation data is encrypted and never sold to third parties. We do not share your personal information or conversation history with anyone. Your practice conversations stay between you and the platform. For full details, see our Privacy Policy.' },
  { q: 'How is my performance scored?', a: 'After each conversation, you receive a comprehensive score (0-100) across five categories: Opening (how well you started), Engagement (how well you kept them interested), Emotional Intelligence (how well you read their signals), Attraction Building (how effectively you created chemistry), and Goal Progress (how close you got to your objective). You also get message-by-message feedback with specific advice for improvement.' },
  { q: 'What makes DatingCoach different from just using a dating app?', a: 'Dating apps are for finding matches. DatingCoach is for developing the skills to succeed with those matches. On dating apps, every mistake costs you a real connection. On DatingCoach, every mistake is a learning opportunity with detailed feedback. Think of it like a flight simulator for pilots. Practice in a safe environment, then perform confidently in the real world.' },
  { q: 'Do you offer refunds?', a: 'Yes. We offer a 7-day money-back guarantee for all first-time subscribers. If DatingCoach is not what you expected, contact us at support@datingcoach.site within 7 days of your purchase and we will issue a full refund, no questions asked. Refunds are not available for subscription renewals.' },
  { q: 'Can I use this to cheat on dating apps?', a: 'DatingCoach is a skills development tool, not a cheating tool. We teach you to be a better communicator, not to pretend to be someone you are not. The goal is genuine confidence and authentic connection. The best approach is still being genuinely interested in the person you are talking to. We just help you express that interest more effectively.' },
  { q: 'How do I cancel my subscription?', a: 'You can cancel anytime from your Account Settings page. Your subscription will remain active until the end of your current billing period. After cancellation, you will be downgraded to the free plan. No hard feelings, we are here when you need us.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards through Stripe (Visa, Mastercard, American Express). We also accept cryptocurrency payments including USDT, USDC, and Bitcoin with a 10% discount for crypto users.' },
  { q: 'Is there a mobile app?', a: 'Currently DatingCoach is a web application that works great on mobile browsers. A native mobile app for iOS and Android is on our roadmap. Sign up for our newsletter to be notified when it launches.' },
]

function AccordionItem({ item, index }: { item: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05, ease: easeOutExpo }} className="glass-card mb-3 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors">
        <span className="text-body font-medium text-[#F5F5F7] pr-4">{item.q}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ color: '#52525B' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: easeOutExpo }} className="overflow-hidden">
            <div className="px-5 pb-5 text-body leading-relaxed border-t pt-4" style={{ color: '#A1A1AA', borderColor: 'rgba(255,255,255,0.04)' }}>{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <div className="min-h-[100dvh] pt-[72px]" style={{ background: '#0A0A0F' }}>
      <section className="relative pt-24 pb-12">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(225, 29, 72, 0.06) 0%, transparent 60%)' }} />
        <div className="relative max-w-[800px] mx-auto px-6 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOutExpo }} className="text-caption uppercase tracking-[0.15em] block mb-4" style={{ color: '#52525B' }}>Help Center</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }} className="text-display-section gradient-text mb-4">Frequently Asked Questions</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }} className="text-body-lg" style={{ color: '#A1A1AA' }}>
            Everything you need to know about DatingCoach. Can not find your answer? Contact us at <a href="mailto:support@datingcoach.site" className="text-[#FB7185] hover:text-[#F59E0B] transition-colors">support@datingcoach.site</a>
          </motion.p>
        </div>
      </section>

      <section ref={ref} className="relative pb-24">
        <div className="max-w-[800px] mx-auto px-6">
          {isInView && faqs.map((item, i) => <AccordionItem key={i} item={item} index={i} />)}
        </div>
      </section>

      <section className="relative py-24" style={{ background: '#0E0E15' }}>
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h2 className="text-heading-xl text-[#F5F5F7] mb-4">Still Have Questions?</h2>
          <p className="text-body-lg mb-8" style={{ color: '#A1A1AA' }}>Our team is here to help. Reach out and we will get back to you within 24 hours.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 btn-gradient text-[#F5F5F7] text-body font-semibold px-6 py-3 rounded-full">
            Contact Support<ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
