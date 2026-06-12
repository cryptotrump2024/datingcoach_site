import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import SectionHeading from './SectionHeading'

const testimonials = [
  {
    quote: 'I went from getting ghosted on every app to having actual conversations that lead somewhere. The feedback on each message showed me exactly what I was doing wrong.',
    name: 'Marcus T.', age: 27, hue: 200,
  },
  {
    quote: "Practicing with the 'hard to get' personas built my confidence for real conversations. Met my girlfriend three weeks after I started.",
    name: 'James R.', age: 31, hue: 280,
  },
  {
    quote: 'I have social anxiety and this was the safe space I needed. No real rejection, just honest feedback — and the psychology notes helped me understand people better.',
    name: 'David K.', age: 25, hue: 340,
  },
  {
    quote: 'The profile analyzer breakdown was scary accurate. Fixed my photos and bio the same night and matches noticeably picked up.',
    name: 'Ryan S.', age: 29, hue: 40,
  },
  {
    quote: 'The conversation scoring broke down things I never even thought about. My text game improved in like two weeks. No joke.',
    name: 'Chris M.', age: 26, hue: 160,
  },
  {
    quote: 'Divorced and back in dating after ten years — I felt completely lost. This taught me how people actually text now. Like a cool older brother with solid advice.',
    name: 'Alex P.', age: 38, hue: 120,
  },
]

export default function Testimonials() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Early users"
          title="People are getting better at this"
          subtitle="From beta users practicing daily — lightly edited for length."
        />
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="glass-card p-6 break-inside-avoid"
            >
              <Quote className="w-5 h-5 text-rose-300 mb-3" aria-hidden="true" />
              <blockquote className="text-body text-text-primary leading-relaxed">{t.quote}</blockquote>
              <figcaption className="flex items-center gap-3 mt-5">
                <div
                  aria-hidden="true"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-caption font-bold"
                  style={{ background: `linear-gradient(135deg, hsl(${t.hue}, 55%, 55%), hsl(${t.hue + 35}, 50%, 45%))` }}
                >
                  {t.name.split(' ').map((w) => w[0]).join('')}
                </div>
                <span className="text-body-sm text-text-secondary">{t.name}, {t.age}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
