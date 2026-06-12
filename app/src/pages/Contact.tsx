import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Clock, Send } from 'lucide-react'

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-[100dvh] pt-[72px]" style={{ background: '#FDFBF7' }}>
      <section className="relative pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(225, 29, 72, 0.06) 0%, transparent 60%)' }} />
        <div className="relative max-w-[700px] mx-auto px-6 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOutExpo }} className="text-caption uppercase tracking-[0.15em] block mb-4" style={{ color: '#A8A29E' }}>Get in Touch</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }} className="text-display-section gradient-text mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }} className="text-body-lg" style={{ color: '#57534E' }}>Questions, feedback, or just want to say hi? We read every message.</motion.p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-[700px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: <Mail className="w-6 h-6" />, title: 'Email', text: 'support@datingcoach.site', sub: 'We reply within 24 hours' },
              { icon: <MessageSquare className="w-6 h-6" />, title: 'Live Chat', text: 'In-app messaging', sub: 'Available for Pro users' },
              { icon: <Clock className="w-6 h-6" />, title: 'Hours', text: 'Mon-Fri, 9am-6pm EST', sub: 'Weekend support via email' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 * i, ease: easeOutExpo }} className="glass-card p-6 text-center">
                <div className="flex justify-center mb-3" style={{ color: '#BE123C' }}>{item.icon}</div>
                <h3 className="text-heading-sm text-text-primary mb-1">{item.title}</h3>
                <p className="text-body-sm text-text-primary font-medium">{item.text}</p>
                <p className="text-caption" style={{ color: '#A8A29E' }}>{item.sub}</p>
              </motion.div>
            ))}
          </div>

          <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }} onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
            {submitted && (
              <div className="p-4 rounded-xl text-center text-body-sm font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                Message sent! We will get back to you within 24 hours.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-caption block mb-2" style={{ color: '#57534E' }}>Your Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[rgba(28, 25, 23, 0.06)] border border-[rgba(28, 25, 23, 0.1)] rounded-xl px-4 py-3 text-body text-text-primary outline-none focus:border-[#E11D48] transition-colors" placeholder="John Doe" required />
              </div>
              <div>
                <label className="text-caption block mb-2" style={{ color: '#57534E' }}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[rgba(28, 25, 23, 0.06)] border border-[rgba(28, 25, 23, 0.1)] rounded-xl px-4 py-3 text-body text-text-primary outline-none focus:border-[#E11D48] transition-colors" placeholder="john@example.com" required />
              </div>
            </div>
            <div>
              <label className="text-caption block mb-2" style={{ color: '#57534E' }}>Subject</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-[rgba(28, 25, 23, 0.06)] border border-[rgba(28, 25, 23, 0.1)] rounded-xl px-4 py-3 text-body text-text-primary outline-none focus:border-[#E11D48] transition-colors" required>
                <option value="">Select a topic</option>
                <option value="general">General Question</option>
                <option value="billing">Billing / Subscription</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-caption block mb-2" style={{ color: '#57534E' }}>Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-[rgba(28, 25, 23, 0.06)] border border-[rgba(28, 25, 23, 0.1)] rounded-xl px-4 py-3 text-body text-text-primary outline-none focus:border-[#E11D48] transition-colors resize-none" rows={5} placeholder="Tell us what is on your mind..." required />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 btn-gradient text-text-primary text-body font-semibold px-6 py-3.5 rounded-full">
              <Send className="w-4 h-4" />Send Message
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
