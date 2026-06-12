import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import SectionHeading from './SectionHeading'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    blurb: 'Try the full practice loop',
    features: ['3 practice conversations', '1 profile analysis', 'Coaching feedback included'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9.95',
    blurb: 'For consistent practice',
    features: ['50 conversations / month', '10 profile analyses / month', 'All personas & scenarios', 'Full progress analytics'],
    cta: 'Go Pro',
    highlight: true,
  },
  {
    name: 'Advanced',
    price: '$29.95',
    blurb: 'Unlimited, plus deep coaching',
    features: ['Unlimited everything', 'Custom personas', 'Advanced coaching modes', 'Early access to new features'],
    cta: 'Go Advanced',
    highlight: false,
  },
]

export default function PricingTeaser() {
  return (
    <section className="relative py-20 md:py-28 bg-bg-secondary border-y border-stone-900/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="Cheaper than one bad first date"
          subtitle="Start free. Upgrade when practice becomes a habit. Cancel anytime."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative flex flex-col p-7 rounded-[20px] ${
                t.highlight ? 'glass-card-elevated glow-border' : 'glass-card'
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-caption px-3 py-1 rounded-full btn-gradient text-white">
                  Most popular
                </span>
              )}
              <p className="text-heading-md text-text-primary font-display">{t.name}</p>
              <p className="mt-3">
                <span className="text-4xl font-display font-semibold text-text-primary">{t.price}</span>
                <span className="text-body-sm text-text-muted"> / month</span>
              </p>
              <p className="text-body-sm text-text-secondary mt-1">{t.blurb}</p>
              <ul className="space-y-2.5 mt-6 mb-8">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/pricing"
                className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-body-sm font-semibold transition-colors ${
                  t.highlight
                    ? 'btn-gradient text-white'
                    : 'border border-stone-900/15 text-text-primary hover:border-rose-300 hover:text-text-rose'
                }`}
              >
                {t.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-body-sm text-text-muted mt-8">
          Annual billing saves 20%. Crypto accepted.{' '}
          <Link to="/pricing" className="text-text-rose hover:underline">Compare all features →</Link>
        </p>
      </div>
    </section>
  )
}
