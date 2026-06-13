import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Check,
  X,
  Crown,
  Sparkles,
  Zap,
  Shield,
  Lock,
  CreditCard,
  Bitcoin,
  Copy,
  CheckCircle2,
  ChevronDown,
  Globe,
  Clock,
  RefreshCw,
  MessageCircle,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

type BillingPeriod = 'monthly' | 'annual'
type PaymentMethod = 'card' | 'crypto'
type CryptoOption = 'usdt' | 'usdc' | 'btc'

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. After cancellation, you\'ll continue to have access until the end of your current billing period. No questions asked.',
  },
  {
    question: 'What happens when I run out of credits?',
    answer: 'When you run out of credits, you can either upgrade to a higher plan or wait for your monthly reset (Pro plans get 50 credits every month). You can also purchase additional credits.',
  },
  {
    question: 'How does the 7-day money-back guarantee work?',
    answer: 'If you\'re not satisfied with DatingCoach Pro or Advanced within 7 days of your purchase, contact our support team for a full refund. No questions asked.',
  },
  {
    question: 'Can I switch between plans?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the new rate takes effect at the next billing cycle.',
  },
  {
    question: 'Are crypto payments secure?',
    answer: 'Yes, all crypto payments are processed securely on-chain. We accept USDT, USDC, and BTC. Once payment is confirmed on the blockchain, your account is upgraded automatically.',
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes! Students with a valid .edu email can get 50% off any paid plan. Contact our support team with proof of enrollment to claim your discount.',
  },
]

interface PricingFeature {
  name: string
  included: boolean
}

interface PricingTier {
  name: string
  priceMonthly: number
  priceAnnual: number
  badge: string
  badgeColor: string
  description: string
  features: PricingFeature[]
  buttonText: string
  buttonStyle: 'outline' | 'gradient-rose' | 'gradient-purple'
  icon: typeof Sparkles
  highlight?: boolean
  highlightBorder?: string
}

const tiers: PricingTier[] = [
  {
    name: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    badge: 'Get Started',
    badgeColor: 'bg-bg-tertiary text-text-secondary',
    description: 'Perfect for trying out DatingCoach',
    icon: Sparkles,
    buttonText: 'Start Free',
    buttonStyle: 'outline',
    features: [
      { name: '3 conversation simulations', included: true },
      { name: '1 profile analysis', included: true },
      { name: 'Basic message feedback', included: true },
      { name: 'Limited persona options', included: true },
      { name: 'Save conversation history', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'AI image generation', included: false },
      { name: 'Relationship coaching', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    name: 'Pro',
    priceMonthly: 9.95,
    priceAnnual: 7.95,
    badge: 'Most Popular',
    badgeColor: 'bg-[rgba(225,29,72,0.15)] text-[#BE123C]',
    description: 'Best for active daters',
    icon: Zap,
    buttonText: 'Get Pro',
    buttonStyle: 'gradient-rose',
    highlight: true,
    highlightBorder: 'rgba(225, 29, 72, 0.25)',
    features: [
      { name: '50 conversations/month', included: true },
      { name: '10 profile analyses/month', included: true },
      { name: 'Full message + subtext analysis', included: true },
      { name: 'All persona options', included: true },
      { name: 'Save conversation history', included: true },
      { name: 'Detailed analytics dashboard', included: true },
      { name: 'Generated persona images', included: true },
      { name: 'Relationship coaching', included: false },
      { name: 'Custom personas', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    name: 'Advanced',
    priceMonthly: 29.95,
    priceAnnual: 23.95,
    badge: 'Unlimited Power',
    badgeColor: 'bg-[rgba(139,92,246,0.15)] text-[#A78BFA]',
    description: 'For serious practitioners',
    icon: Crown,
    buttonText: 'Go Advanced',
    buttonStyle: 'gradient-purple',
    features: [
      { name: 'Unlimited conversations', included: true },
      { name: 'Unlimited profile analyses', included: true },
      { name: 'Full message + subtext analysis', included: true },
      { name: 'All personas + custom creation', included: true },
      { name: 'Save unlimited history', included: true },
      { name: 'Advanced analytics + trends', included: true },
      { name: 'AI image generation', included: true },
      { name: 'Relationship coaching', included: true },
      { name: 'Custom personas', included: true },
      { name: 'Priority support', included: true },
      { name: 'Early access to new features', included: true },
    ],
  },
]

const cryptoWallets: Record<CryptoOption, { name: string; symbol: string; address: string; color: string }> = {
  usdt: { name: 'Tether', symbol: 'USDT', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', color: '#26A17B' },
  usdc: { name: 'USD Coin', symbol: 'USDC', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', color: '#2775CA' },
  btc: { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', color: '#F7931A' },
}

export default function Pricing() {
  const navigate = useNavigate()
  const { isAuthenticated, updatePlan, user } = useAuth()
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annual')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>('usdt')
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cryptoWallets[selectedCrypto].address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Free') {
      if (isAuthenticated) {
        navigate('/dashboard')
      } else {
        navigate('/signup')
      }
      return
    }
    setSelectedPlan(planName)
    window.scrollTo({ top: document.body.scrollHeight * 0.5, behavior: 'smooth' })
  }

  const handleConfirmPayment = async () => {
    const plan = selectedPlan?.toLowerCase() as 'pro' | 'advanced'
    if (!plan || processing) return
    setProcessing(true)

    // Try real Stripe Checkout; fall back to demo upgrade if not configured.
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          billing: billingPeriod,
          userId: user?.id,
          email: user?.email,
        }),
      })
      if (res.ok) {
        const data = (await res.json()) as { url?: string }
        if (data.url) {
          window.location.href = data.url
          return
        }
      }
    } catch {
      /* fall through to demo mode */
    }

    updatePlan(plan)
    toast.success(`Upgraded to ${plan} — demo mode`, {
      description: 'Add Stripe keys in Vercel to take real payments.',
    })
    navigate('/dashboard')
    setProcessing(false)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.2) 0%, transparent 60%)' }}
      />
      <div
        className="absolute top-[40%] right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 60%)' }}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center mb-12"
        >
          <h1 className="text-display-section text-4xl md:text-[56px] text-text-primary mb-4">
            Choose Your Plan
          </h1>
          <p className="text-base md:text-body-lg text-text-secondary max-w-[90%] md:max-w-[540px] mx-auto">
            Unlock your full potential with conversation practice. Upgrade anytime to access more features.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span
            className={`text-body-sm font-medium transition-colors ${
              billingPeriod === 'monthly' ? 'text-text-primary' : 'text-text-muted'
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer"
            style={{
              background: billingPeriod === 'annual'
                ? 'linear-gradient(135deg, #E11D48, #F59E0B)'
                : '#EDE6DA',
              border: billingPeriod === 'annual' ? 'none' : '1px solid rgba(28, 25, 23, 0.1)',
            }}
          >
            <motion.div
              animate={{ x: billingPeriod === 'annual' ? 28 : 2 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
            />
          </button>
          <span
            className={`text-body-sm font-medium transition-colors ${
              billingPeriod === 'annual' ? 'text-text-primary' : 'text-text-muted'
            }`}
          >
            Annual
          </span>
          {billingPeriod === 'annual' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2.5 py-1 rounded-full text-caption font-semibold bg-emerald-500/20 text-emerald-400"
            >
              Save 20%
            </motion.span>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier, index) => {
            const Icon = tier.icon
            const price = billingPeriod === 'monthly' ? tier.priceMonthly : tier.priceAnnual
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.3 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="relative"
              >
                {tier.highlight && (
                  <div
                    className="absolute -inset-[1px] rounded-[21px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(225,29,72,0.4), rgba(245,158,11,0.2))',
                      boxShadow: '0 0 40px rgba(225, 29, 72, 0.3)',
                    }}
                  />
                )}
                <div
                  className={`relative h-full rounded-[20px] p-6 md:p-8 flex flex-col ${
                    tier.highlight ? 'glass-card-elevated' : 'glass-card'
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className={`px-3 py-1 rounded-full text-caption font-medium ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>
                    {tier.name === 'Advanced' && <Crown className="w-5 h-5 text-[#A78BFA]" />}
                  </div>

                  {/* Plan Name & Icon */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          tier.name === 'Free'
                            ? 'rgba(28, 25, 23, 0.08)'
                            : tier.name === 'Pro'
                              ? 'linear-gradient(135deg, rgba(225,29,72,0.2), rgba(245,158,11,0.15))'
                              : 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(225,29,72,0.15))',
                      }}
                    >
                      <Icon className="w-5 h-5 text-text-primary" />
                    </div>
                    <div>
                      <h3 className="text-heading-md text-text-primary">{tier.name}</h3>
                      <p className="text-caption text-text-muted">{tier.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span className="text-display-subsection text-4xl md:text-[56px] text-text-primary">
                      ${price === 0 ? '0' : price.toFixed(price % 1 === 0 ? 0 : 2)}
                    </span>
                    <span className="text-body text-text-muted ml-1">/ month</span>
                    {billingPeriod === 'annual' && price > 0 && (
                      <p className="text-caption text-emerald-400 mt-1">
                        Billed annually (${(price * 12).toFixed(0)}/year)
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-2.5">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                        )}
                        <span
                          className={`text-xs md:text-body-sm ${
                            feature.included ? 'text-text-secondary' : 'text-text-muted'
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(tier.name)}
                    className={`w-full py-3 rounded-xl font-semibold text-body transition-all duration-200 cursor-pointer ${
                      tier.buttonStyle === 'outline'
                        ? 'border border-[rgba(255,255,255,0.12)] text-text-primary hover:bg-[rgba(28, 25, 23, 0.06)] hover:border-[rgba(255,255,255,0.2)]'
                        : tier.buttonStyle === 'gradient-rose'
                          ? 'btn-gradient text-white'
                          : 'text-white hover:scale-[1.03] active:scale-[0.98]'
                    }`}
                    style={
                      tier.buttonStyle === 'gradient-purple'
                        ? {
                            background: 'linear-gradient(135deg, #8B5CF6, #E11D48)',
                            boxShadow: '0 0 40px rgba(139, 92, 246, 0.2)',
                          }
                        : undefined
                    }
                  >
                    {tier.buttonText}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Payment Section */}
        <AnimatePresence>
          {selectedPlan && selectedPlan !== 'Free' && (
            <motion.div
              initial={{ opacity: 0, y: 40, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="mb-16 overflow-hidden"
            >
              <div className="glass-card-elevated p-8 max-w-[680px] mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-heading-xl text-text-primary mb-2">
                    Choose Your Payment Method
                  </h2>
                  <p className="text-body text-text-secondary">
                    You selected <span className="text-[#BE123C] font-semibold">{selectedPlan}</span>. Complete your upgrade
                  </p>
                </div>

                {/* Payment Tabs */}
                <div className="flex gap-2 p-1 rounded-xl bg-bg-tertiary mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-body-sm font-medium transition-all duration-200 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#2A2A35] text-text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-body-sm font-medium transition-all duration-200 cursor-pointer ${
                      paymentMethod === 'crypto'
                        ? 'bg-[#2A2A35] text-text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    <Bitcoin className="w-4 h-4" />
                    Crypto
                  </button>
                </div>

                {/* Card Payment Form */}
                <AnimatePresence mode="wait">
                  {paymentMethod === 'card' && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        {/* Card Number */}
                        <div>
                          <label className="block text-body-sm font-medium text-text-secondary mb-2">
                            Card Number
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                            <input
                              type="text"
                              placeholder="4242 4242 4242 4242"
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] text-text-primary text-body placeholder-text-muted focus:outline-none focus:border-[rgba(225,29,72,0.4)] transition-all"
                            />
                          </div>
                        </div>

                        {/* Expiry & CVC */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-body-sm font-medium text-text-secondary mb-2">
                              Expiry
                            </label>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] text-text-primary text-body placeholder-text-muted focus:outline-none focus:border-[rgba(225,29,72,0.4)] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-body-sm font-medium text-text-secondary mb-2">
                              CVC
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] text-text-primary text-body placeholder-text-muted focus:outline-none focus:border-[rgba(225,29,72,0.4)] transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-body-sm font-medium text-text-secondary mb-2">
                            Country
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                            <select className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] text-text-primary text-body focus:outline-none focus:border-[rgba(225,29,72,0.4)] transition-all appearance-none cursor-pointer">
                              <option>United States</option>
                              <option>United Kingdom</option>
                              <option>Canada</option>
                              <option>Australia</option>
                              <option>Germany</option>
                              <option>France</option>
                              <option>Japan</option>
                              <option>Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Secure Badge */}
                        <div className="flex items-center gap-2 text-caption text-text-muted">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Secure payment powered by Stripe</span>
                        </div>

                        {/* Submit */}
                        <motion.button
                          whileHover={processing ? {} : { scale: 1.02 }}
                          whileTap={processing ? {} : { scale: 0.98 }}
                          onClick={handleConfirmPayment}
                          disabled={processing}
                          className="w-full py-3.5 rounded-xl btn-gradient text-white font-semibold text-body cursor-pointer disabled:opacity-60"
                        >
                          {processing
                            ? 'Starting checkout…'
                            : `Pay $${
                                billingPeriod === 'monthly'
                                  ? tiers.find((t) => t.name === selectedPlan)?.priceMonthly.toFixed(2)
                                  : tiers.find((t) => t.name === selectedPlan)?.priceAnnual.toFixed(2)
                              }${billingPeriod === 'monthly' ? '/month' : '/month (billed annually)'}`}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'crypto' && (
                    <motion.div
                      key="crypto"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Crypto Options */}
                      <div className="flex gap-2 mb-6">
                        {(Object.keys(cryptoWallets) as CryptoOption[]).map((key) => {
                          const crypto = cryptoWallets[key]
                          return (
                            <button
                              key={key}
                              onClick={() => setSelectedCrypto(key)}
                              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                                selectedCrypto === key
                                  ? 'border-[rgba(255,255,255,0.12)] bg-[rgba(28, 25, 23, 0.06)]'
                                  : 'border-transparent bg-transparent hover:bg-[rgba(255,255,255,0.02)]'
                              }`}
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-caption font-bold"
                                style={{ backgroundColor: crypto.color }}
                              >
                                {crypto.symbol[0]}
                              </div>
                              <span className="text-body-sm text-text-primary font-medium">{crypto.symbol}</span>
                            </button>
                          )
                        })}
                      </div>

                      {/* Selected Crypto Payment Details */}
                      <div className="p-5 rounded-xl bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] mb-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: cryptoWallets[selectedCrypto].color }}
                          >
                            {cryptoWallets[selectedCrypto].symbol[0]}
                          </div>
                          <div>
                            <p className="text-body-sm text-text-primary font-medium">
                              {cryptoWallets[selectedCrypto].name}
                            </p>
                            <p className="text-caption text-text-muted">
                              {cryptoWallets[selectedCrypto].symbol}
                            </p>
                          </div>
                        </div>

                        {/* QR Code Placeholder */}
                        <div className="w-40 h-40 mx-auto mb-4 rounded-xl bg-white p-3 flex items-center justify-center">
                          <div
                            className="w-full h-full rounded-lg flex items-center justify-center"
                            style={{
                              background: `repeating-conic-gradient(#000 0% 25%, transparent 0% 50%) 50% / 20px 20px`,
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: cryptoWallets[selectedCrypto].color }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Wallet Address */}
                        <div className="mb-4">
                          <label className="block text-caption text-text-muted mb-1.5">Wallet Address</label>
                          <div className="flex gap-2">
                            <div className="flex-1 px-3 py-2.5 rounded-lg bg-bg-secondary border border-[rgba(28, 25, 23, 0.06)] text-mono text-text-secondary truncate">
                              {cryptoWallets[selectedCrypto].address}
                            </div>
                            <button
                              onClick={handleCopyAddress}
                              className="px-3 py-2.5 rounded-lg bg-[#2A2A35] border border-[rgba(28, 25, 23, 0.1)] text-text-secondary hover:text-text-primary hover:bg-[#33333F] transition-all cursor-pointer"
                            >
                              {copiedAddress ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 text-amber-400">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span className="text-caption">Waiting for payment confirmation...</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmPayment}
                        className="w-full py-3.5 rounded-xl font-semibold text-body text-white cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, #8B5CF6, #E11D48)',
                          boxShadow: '0 0 40px rgba(139, 92, 246, 0.2)',
                        }}
                      >
                        I&apos;ve Completed the Payment
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-16"
        >
          <div className="flex items-center gap-2 text-body-sm text-text-muted">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Secure SSL encryption</span>
          </div>
          <div className="flex items-center gap-2 text-body-sm text-text-muted">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2 text-body-sm text-text-muted">
            <Shield className="w-4 h-4 text-[#8B5CF6]" />
            <span>7-day money-back guarantee</span>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="max-w-[720px] mx-auto"
        >
          <div className="text-center mb-8">
            <MessageCircle className="w-8 h-8 text-[#BE123C] mx-auto mb-3" />
            <h2 className="text-heading-xl text-text-primary">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index + 0.8 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="text-body font-medium text-text-primary pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-body-sm text-text-secondary leading-relaxed border-t border-[rgba(28, 25, 23, 0.06)] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
