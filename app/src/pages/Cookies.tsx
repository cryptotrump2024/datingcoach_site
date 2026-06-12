import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cookie, ArrowUp, Check, Info } from 'lucide-react'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

function Section({ children, title, index }: { children: React.ReactNode; title: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easeOutExpo }}
      className="glass-card p-8 md:p-10"
    >
      <h2 className="text-heading-lg text-text-primary mb-5 border-l-[3px] border-[#E11D48] pl-4">
        {title}
      </h2>
      <div className="text-body text-text-secondary leading-[1.7] space-y-4">
        {children}
      </div>
    </motion.div>
  )
}

function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
  label,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  label: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-body-sm ${disabled ? 'text-text-muted' : 'text-text-secondary'}`}>{label}</span>
      <button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          disabled ? 'bg-[#2A2A35] cursor-not-allowed' : enabled ? 'bg-[#E11D48]' : 'bg-[#3A3A45] hover:bg-[#4A4A55]'
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        >
          {disabled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            </div>
          )}
        </div>
      </button>
    </div>
  )
}

export default function Cookies() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [preferencesEnabled, setPreferencesEnabled] = useState(true)
  const [marketingEnabled, setMarketingEnabled] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-[100dvh] bg-bg-primary">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(225, 29, 72, 0.08) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-[800px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glow-border mb-8"
            style={{ background: 'rgba(255, 255, 255, 0.82)', backdropFilter: 'blur(12px)' }}
          >
            <Cookie className="w-4 h-4 text-[#BE123C]" />
            <span className="text-caption text-[#BE123C] uppercase tracking-[0.1em]">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="text-display-subsection gradient-text mb-4"
          >
            Cookie Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body text-text-muted"
          >
            Last updated: June 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-24">
        <div className="max-w-[800px] mx-auto space-y-6">
          <Section title="1. What Are Cookies" index={0}>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you 
              visit a website. They are widely used to make websites work more efficiently, provide a better user 
              experience, and give website owners information about how visitors use their site.
            </p>
            <p>
              In addition to cookies, we use similar technologies such as local storage and pixel tags for the same 
              purposes described in this policy. When we refer to "cookies" in this policy, we mean all of these 
              technologies collectively.
            </p>
          </Section>

          <Section title="2. How We Use Cookies" index={1}>
            <p>We use different categories of cookies for different purposes:</p>

            <div className="space-y-4 mt-4">
              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-text-primary mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  Essential Cookies
                </h3>
                <p>
                  These cookies are strictly necessary for the Service to function properly. They enable core 
                  functionality such as user authentication, session management, and security features. Without these 
                  cookies, the Service cannot operate. These cookies <strong className="text-text-primary">cannot be disabled</strong>.
                </p>
                <p className="text-body-sm text-text-muted mt-2">
                  Examples: session tokens, CSRF protection tokens, login state.
                </p>
              </div>

              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-text-primary mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  Analytics Cookies
                </h3>
                <p>
                  These cookies help us understand how users interact with our platform. They collect information about 
                  which pages are visited most often, how users navigate the site, and where errors may occur. This data 
                  is aggregated and anonymized. We use services such as <strong className="text-text-primary">Google Analytics</strong> and{' '}
                  <strong className="text-text-primary">Mixpanel</strong> for this purpose.
                </p>
                <p className="text-body-sm text-text-muted mt-2">
                  You can opt out of analytics cookies through your browser settings or our cookie preference center below.
                </p>
              </div>

              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-text-primary mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  Preferences Cookies
                </h3>
                <p>
                  These cookies remember your settings and preferences to enhance your experience. They enable the 
                  Service to remember choices you make, such as your preferred theme, difficulty level selections, 
                  and display preferences.
                </p>
                <p className="text-body-sm text-text-muted mt-2">
                  Examples: dark mode preference, persona difficulty default, language selection.
                </p>
              </div>

              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-text-primary mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                  Marketing Cookies
                </h3>
                <p>
                  These cookies are used to deliver targeted advertisements and measure the effectiveness of our 
                  marketing campaigns. They track your browsing habits across websites and are only placed with your 
                  explicit consent. You can opt in or out at any time.
                </p>
                <p className="text-body-sm text-text-muted mt-2">
                  Examples: ad conversion tracking, campaign attribution.
                </p>
              </div>
            </div>
          </Section>

          <Section title="3. Third-Party Cookies" index={2}>
            <p>
              Some cookies are placed by third parties on our behalf to provide specific services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-text-primary">Stripe</strong>. Our payment processor uses cookies to process 
                payments securely and detect fraudulent transactions.
              </li>
              <li>
                <strong className="text-text-primary">Google Analytics</strong>. Provides anonymous, aggregated 
                statistics about website traffic and user behavior.
              </li>
              <li>
                <strong className="text-text-primary">Mixpanel</strong>. Helps us understand product usage patterns 
                through anonymous event tracking.
              </li>
            </ul>
            <p>
              These third parties may use cookies in accordance with their own privacy policies. We encourage you to 
              review their policies for more information.
            </p>
          </Section>

          <Section title="4. Managing Cookies" index={3}>
            <p>
              You have several options for controlling cookies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-text-primary">Browser settings</strong>. Most web browsers allow you to manage 
                cookies through their settings. You can usually find these settings in the "Options," "Preferences," or 
                "Settings" menu. You can choose to block all cookies, allow all cookies, or be notified when a cookie 
                is set. Note that blocking essential cookies may prevent the Service from functioning.
              </li>
              <li>
                <strong className="text-text-primary">Our cookie preference center</strong>. You can manage your 
                non-essential cookie preferences using the Cookie Preference UI at the bottom of this page.
              </li>
              <li>
                <strong className="text-text-primary">Industry opt-out tools</strong>. You can opt out of targeted 
                advertising through industry programs such as the{' '}
                <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                  Digital Advertising Alliance
                </a>{' '}
                or the{' '}
                <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                  European Interactive Digital Advertising Alliance
                </a>.
              </li>
            </ul>
          </Section>

          <Section title="5. Cookie Duration" index={4}>
            <p>
              Cookies can remain on your device for different periods of time:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-text-primary">Session cookies</strong>. These are temporary cookies that are 
                deleted when you close your browser. They are used to maintain your session state as you navigate the 
                Service and are essential for basic functionality.
              </li>
              <li>
                <strong className="text-text-primary">Persistent cookies</strong>. These remain on your device for a 
                set period or until you manually delete them. They help us recognize you on subsequent visits and remember 
                your preferences. Persistent cookies on our Service typically expire within{' '}
                <strong className="text-text-primary">1 year</strong> of being set, though some may have shorter or 
                longer lifespans depending on their purpose.
              </li>
            </ul>
          </Section>

          <Section title="6. Contact" index={5}>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <div className="glass-card-elevated p-6 mt-4">
              <p className="text-text-primary font-semibold mb-1">DatingCoach, Inc.</p>
              <p className="text-text-secondary mb-1">
                Email:{' '}
                <a href="mailto:privacy@datingcoach.site" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                  privacy@datingcoach.site
                </a>
              </p>
              <p className="text-text-muted text-body-sm">
                We aim to respond to all inquiries within 48 business hours.
              </p>
            </div>
          </Section>

          {/* Cookie Preference Mock UI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="glass-card-elevated p-8 md:p-10 mt-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[rgba(225,29,72,0.15)]">
                <Cookie className="w-5 h-5 text-[#E11D48]" />
              </div>
              <h2 className="text-heading-lg text-text-primary">Cookie Preferences</h2>
            </div>

            <p className="text-body-sm text-text-muted mb-6">
              Manage your cookie preferences below. Essential cookies cannot be disabled as they are required for the Service to function.
            </p>

            <div className="space-y-4">
              {/* Essential - always on */}
              <div className="glass-card p-4">
                <ToggleSwitch
                  label="Essential"
                  enabled={true}
                  onChange={() => {}}
                  disabled={true}
                />
                <p className="text-caption text-text-muted mt-2 pl-0">
                  Required for login, security, and basic functionality. Cannot be disabled.
                </p>
              </div>

              {/* Analytics */}
              <div className="glass-card p-4">
                <ToggleSwitch
                  label="Analytics"
                  enabled={analyticsEnabled}
                  onChange={setAnalyticsEnabled}
                />
                <p className="text-caption text-text-muted mt-2 pl-0">
                  Helps us understand how users interact with the platform. Includes Google Analytics and Mixpanel.
                </p>
              </div>

              {/* Preferences */}
              <div className="glass-card p-4">
                <ToggleSwitch
                  label="Preferences"
                  enabled={preferencesEnabled}
                  onChange={setPreferencesEnabled}
                />
                <p className="text-caption text-text-muted mt-2 pl-0">
                  Remembers your settings like theme and difficulty preferences.
                </p>
              </div>

              {/* Marketing */}
              <div className="glass-card p-4">
                <ToggleSwitch
                  label="Marketing"
                  enabled={marketingEnabled}
                  onChange={setMarketingEnabled}
                />
                <p className="text-caption text-text-muted mt-2 pl-0">
                  Used for targeted advertising. Only enabled with your consent.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSave}
                className="btn-gradient text-text-primary text-body-sm font-semibold px-6 py-3 rounded-full"
              >
                Save Preferences
              </button>

              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-body-sm text-[#10B981]"
                >
                  <Check className="w-4 h-4" />
                  Saved
                </motion.div>
              )}
            </div>

            <div className="flex items-start gap-2 mt-4 text-body-sm text-text-muted">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Note: This is a demonstration interface. Changes here do not affect actual cookie behavior 
                and are for illustrative purposes only.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Back to top */}
        <div className="max-w-[800px] mx-auto mt-16 text-center">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-[#BE123C] hover:text-[#F59E0B] transition-colors text-body-sm font-semibold"
          >
            <ArrowUp className="w-4 h-4" />
            Back to top
          </button>
        </div>
      </section>
    </div>
  )
}
