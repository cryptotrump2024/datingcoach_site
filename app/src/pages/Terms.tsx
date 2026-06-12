import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileText, ArrowUp } from 'lucide-react'

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

export default function Terms() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

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
            <FileText className="w-4 h-4 text-[#BE123C]" />
            <span className="text-caption text-[#BE123C] uppercase tracking-[0.1em]">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="text-display-subsection gradient-text mb-4"
          >
            Terms of Service
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
          <Section title="1. Acceptance of Terms" index={0}>
            <p>
              By accessing or using DatingCoach ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, you may not access or use the Service. These Terms constitute a legally 
              binding agreement between you and DatingCoach, Inc. ("DatingCoach," "we," "us," or "our").
            </p>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of material changes via email 
              or through the Service. Your continued use of the Service after such changes constitutes acceptance of the 
              updated Terms.
            </p>
          </Section>

          <Section title="2. Description of Service" index={1}>
            <p>
              DatingCoach is a conversation practice platform that uses simulated AI personas to help users improve their 
              dating and social communication skills. The Service provides simulated conversations, message analysis, 
              feedback scoring, and educational content.
            </p>
            <p>
              <strong className="text-text-primary">Important:</strong> DatingCoach is <em>not</em> a dating service, 
              matchmaking platform, or social networking site. The personas are entirely simulated and do not represent 
              real people. The Service is designed for educational and practice purposes only.
            </p>
            <p>
              DatingCoach is <em>not</em> a substitute for professional advice, including but not limited to mental health 
              counseling, therapy, or legal advice. If you are experiencing emotional distress or mental health concerns, 
              please consult a qualified professional.
            </p>
          </Section>

          <Section title="3. User Accounts" index={2}>
            <p>
              To use certain features of the Service, you must register for an account. You agree to provide accurate, 
              current, and complete information during registration and to keep your account information updated.
            </p>
            <p>
              <strong className="text-text-primary">Age Requirement:</strong> You must be at least 18 years of age to use 
              the Service. By creating an account, you represent and warrant that you are 18 years of age or older. We 
              do not knowingly permit individuals under 18 to register for accounts.
            </p>
            <p>
              <strong className="text-text-primary">Account Security:</strong> You are responsible for maintaining the 
              confidentiality of your account credentials and for all activities that occur under your account. You agree 
              to notify us immediately at{' '}
              <a href="mailto:support@datingcoach.site" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                support@datingcoach.site
              </a>{' '}
              of any unauthorized use of your account.
            </p>
          </Section>

          <Section title="4. Subscriptions & Payments" index={3}>
            <p>
              DatingCoach offers multiple subscription tiers. All prices are in USD and billed on a recurring monthly basis 
              unless otherwise stated:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-text-primary">Free Tier</strong>. Limited conversations and basic feedback at no cost.</li>
              <li><strong className="text-text-primary">Pro ($9.95/month)</strong>. Unlimited conversations, detailed analysis, and advanced scoring.</li>
              <li><strong className="text-text-primary">Advanced ($29.95/month)</strong>. All Pro features plus persona builder, profile analyzer, and priority support.</li>
            </ul>
            <p>
              Payments are processed through our third-party payment processor, Stripe. By subscribing, you authorize us 
              to charge your payment method on a recurring basis until you cancel.
            </p>
            <p>
              <strong className="text-text-primary">Cancellation:</strong> You may cancel your subscription at any time 
              through your account settings or by emailing us at{' '}
              <a href="mailto:support@datingcoach.site" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                support@datingcoach.site
              </a>. 
              Cancellation takes effect at the end of your current billing cycle. You will continue to have access to 
              paid features until the end of that cycle.
            </p>
          </Section>

          <Section title="5. Refund Policy" index={4}>
            <p>
              We offer a <strong className="text-text-primary">7-day money-back guarantee</strong> for first-time subscribers. 
              If you are not satisfied with the Service, you may request a full refund within 7 days of your initial 
              subscription purchase.
            </p>
            <p>
              To request a refund, contact us at{' '}
              <a href="mailto:support@datingcoach.site" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                support@datingcoach.site
              </a>{' '}
              with your account email and the reason for your request.
            </p>
            <p>
              <strong className="text-text-primary">No refunds</strong> will be issued after the 7-day period, for 
              subscription renewals, or for users who have previously received a refund and re-subscribed. We reserve 
              the right to evaluate refund requests on a case-by-case basis at our discretion.
            </p>
          </Section>

          <Section title="6. User Conduct" index={5}>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Harass, abuse, or threaten any person, including simulated personas in ways that promote harmful behavior toward real individuals.</li>
              <li>Upload, post, or transmit any content that is illegal, defamatory, obscene, or otherwise objectionable.</li>
              <li>Attempt to reverse engineer, decompile, or disassemble any aspect of the Service or its underlying technology.</li>
              <li>Use automated scripts, bots, scrapers, or other automated means to access or interact with the Service.</li>
              <li>Interfere with or disrupt the integrity or performance of the Service or its infrastructure.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
              <li>Use the Service for any commercial purpose without our prior written consent.</li>
            </ul>
            <p>
              We reserve the right to investigate and take appropriate action against anyone who violates these rules, 
              including removing content, suspending accounts, and reporting violations to law enforcement authorities.
            </p>
          </Section>

          <Section title="7. Intellectual Property" index={6}>
            <p>
              All content, software, technology, personas, designs, text, graphics, logos, and other materials provided 
              through the Service ("DatingCoach Content") are owned by or licensed to DatingCoach and are protected by 
              copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, 
              revocable license to access and use the Service for personal, non-commercial purposes.
            </p>
            <p>
              <strong className="text-text-primary">Your Content:</strong> You retain all rights to the conversations, 
              messages, and other content you create through the Service ("Your Content"). By using the Service, you 
              grant us a limited license to process Your Content solely for the purpose of providing and improving the 
              Service. We do not claim ownership of Your Content.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit 
              DatingCoach Content without our prior written consent.
            </p>
          </Section>

          <Section title="8. Disclaimer of Warranties" index={7}>
            <p className="uppercase tracking-wide text-text-primary font-semibold">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR 
              IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
              PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, error-free, secure, or free of viruses or other 
              harmful components. We do not warrant that the results obtained from using the Service will be accurate 
              or reliable.
            </p>
            <p>
              DatingCoach is a practice and educational tool. We make no claims, promises, or guarantees about your 
              dating outcomes, relationship success, or social results from using the Service. Simulated conversations 
              are for educational purposes and may not reflect real-world interactions.
            </p>
          </Section>

          <Section title="9. Limitation of Liability" index={8}>
            <p className="uppercase tracking-wide text-text-primary font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL DATINGCOACH, ITS OFFICERS, DIRECTORS, EMPLOYEES, 
              OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT 
              OF OR RELATING TO YOUR USE OF THE SERVICE.
            </p>
            <p>
              Our total liability to you for all claims arising out of or relating to these Terms or the Service shall 
              not exceed the amount you have paid to DatingCoach in the 12 months preceding the event giving rise to 
              liability, or $100, whichever is greater.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations 
              may not apply to you.
            </p>
          </Section>

          <Section title="10. Termination" index={9}>
            <p>
              We reserve the right to suspend or terminate your account and access to the Service at any time, with or 
              without notice, for any reason, including violation of these Terms, fraudulent activity, or behavior that 
              we determine to be harmful to the Service or other users.
            </p>
            <p>
              You may delete your account at any time through your account settings or by contacting us at{' '}
              <a href="mailto:support@datingcoach.site" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                support@datingcoach.site
              </a>. 
              Upon account deletion, your personal data will be handled in accordance with our{' '}
              <a href="/privacy" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                Privacy Policy
              </a>.
            </p>
            <p>
              All provisions of these Terms that by their nature should survive termination shall survive, including 
              intellectual property provisions, warranty disclaimers, and limitations of liability.
            </p>
          </Section>

          <Section title="11. Changes to Terms" index={10}>
            <p>
              We may update these Terms from time to time. We will notify you of material changes via email to the 
              address associated with your account or through a prominent notice within the Service at least 30 days 
              before the changes take effect.
            </p>
            <p>
              Your continued use of the Service after the effective date of the revised Terms constitutes your acceptance 
              of the changes. If you do not agree to the revised Terms, you must stop using the Service.
            </p>
          </Section>

          <Section title="12. Governing Law" index={11}>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United 
              States, without regard to its conflict of law principles.
            </p>
            <p>
              Any dispute arising out of or relating to these Terms or the Service shall be resolved exclusively in the 
              state or federal courts located in Delaware. You consent to the personal jurisdiction and venue of these courts.
            </p>
          </Section>

          <Section title="13. Contact" index={12}>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="glass-card-elevated p-6 mt-4">
              <p className="text-text-primary font-semibold mb-1">DatingCoach, Inc.</p>
              <p className="text-text-secondary mb-1">
                Email:{' '}
                <a href="mailto:support@datingcoach.site" className="text-[#BE123C] hover:text-[#F59E0B] transition-colors">
                  support@datingcoach.site
                </a>
              </p>
              <p className="text-text-muted text-body-sm">
                We aim to respond to all inquiries within 48 business hours.
              </p>
            </div>
          </Section>
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
