import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, ArrowUp } from 'lucide-react'

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
      <h2 className="text-heading-lg text-[#F5F5F7] mb-5 border-l-[3px] border-[#E11D48] pl-4">
        {title}
      </h2>
      <div className="text-body text-[#A1A1AA] leading-[1.7] space-y-4">
        {children}
      </div>
    </motion.div>
  )
}

export default function Privacy() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0F]">
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
            style={{ background: 'rgba(18,18,26,0.6)', backdropFilter: 'blur(12px)' }}
          >
            <Shield className="w-4 h-4 text-[#FB7185]" />
            <span className="text-caption text-[#FB7185] uppercase tracking-[0.1em]">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="text-display-subsection gradient-text mb-4"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body text-[#52525B]"
          >
            Last updated: June 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-24">
        <div className="max-w-[800px] mx-auto space-y-6">
          <Section title="1. Introduction" index={0}>
            <p>
              At DatingCoach, we take your privacy seriously. This Privacy Policy explains what information we collect, 
              how we use it, and your rights regarding your personal data. We are committed to protecting your privacy 
              and handling your data with transparency and care.
            </p>
            <p>
              By using the DatingCoach service ("the Service"), you consent to the collection, use, and sharing of your 
              information as described in this Privacy Policy. If you do not agree with our practices, please do not use 
              the Service.
            </p>
          </Section>

          <Section title="2. Information We Collect" index={1}>
            <p>We collect the following categories of information:</p>

            <div className="space-y-4 mt-4">
              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-[#F5F5F7] mb-2">Account Information</h3>
                <p>
                  When you register, we collect your email address, username, and a hashed version of your password. 
                  We use industry-standard bcrypt hashing. We never store your password in plain text.
                </p>
              </div>

              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-[#F5F5F7] mb-2">Conversation Data</h3>
                <p>
                  We store the messages you exchange with simulated personas, along with AI-generated scores, analyses, 
                  and feedback. This data is stored encrypted at rest using AES-256 encryption and is used to provide 
                  the Service and improve our algorithms.
                </p>
              </div>

              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-[#F5F5F7] mb-2">Usage Data</h3>
                <p>
                  We collect information about how you interact with the Service, including features used, time spent, 
                  session duration, and click patterns. This data is used for product improvement and understanding 
                  user engagement.
                </p>
              </div>

              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-[#F5F5F7] mb-2">Device Information</h3>
                <p>
                  We collect technical information about your device, including browser type, operating system, screen 
                  resolution, and IP address. This helps us optimize the Service for different devices and troubleshoot 
                  technical issues.
                </p>
              </div>

              <div className="glass-card-elevated p-5">
                <h3 className="text-heading-sm text-[#F5F5F7] mb-2">Payment Information</h3>
                <p>
                  All payment processing is handled by Stripe, our third-party payment processor. We do not store or 
                  have access to your full credit card numbers or bank account details. Stripe provides us with the 
                  last four digits of your card, expiration date, and billing country for your receipt and account 
                  management purposes.
                </p>
              </div>
            </div>
          </Section>

          <Section title="3. How We Use Information" index={2}>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-[#F5F5F7]">Provide the Service</strong>. To operate, maintain, and deliver 
                the features and functionality of DatingCoach, including generating AI persona responses and conversation analysis.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Improve our algorithms</strong>. To train and refine our AI models, 
                scoring systems, and feedback mechanisms. All training data is anonymized and aggregated.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Send important updates</strong>. To notify you of changes to the 
                Service, security alerts, billing matters, and other administrative messages. You may opt out of 
                non-essential communications.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Fraud prevention</strong>. To detect, prevent, and address 
                fraudulent transactions, unauthorized access, and other illegal activities.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Customer support</strong>. To respond to your inquiries, 
                troubleshoot issues, and provide assistance when you contact us.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Storage & Security" index={3}>
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-[#F5F5F7]">AES-256 encryption</strong>. All sensitive data, including 
                conversation data, is encrypted at rest using AES-256 encryption.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">TLS/SSL encryption</strong>. All data transmitted between 
                your device and our servers is encrypted using industry-standard TLS/SSL protocols.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Cloud infrastructure</strong>. We use leading cloud providers 
                with SOC 2 Type II certified infrastructure, offering robust physical and network security.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Regular security audits</strong>. We conduct periodic security 
                assessments, vulnerability scans, and penetration testing to identify and address potential risks.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Access controls</strong>. Employee access to user data is 
                strictly limited and granted on a need-to-know basis only. All access is logged and audited.
              </li>
            </ul>
            <p>
              While we take these precautions, no method of electronic transmission or storage is 100% secure. We 
              cannot guarantee absolute security of your data.
            </p>
          </Section>

          <Section title="5. Data Sharing" index={4}>
            <p className="text-[#F5F5F7] font-semibold">
              We do NOT sell your personal data to third parties. Period.
            </p>
            <p>
              We may share your information only in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-[#F5F5F7]">Stripe</strong>. For payment processing. Stripe's use of your 
                information is governed by their{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FB7185] hover:text-[#F59E0B] transition-colors">
                  Privacy Policy
                </a>.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Analytics providers</strong>. We use anonymous, aggregated 
                usage data with analytics providers to understand how users interact with the Service. No personally 
                identifiable information is shared.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Legal compliance</strong>. We may disclose information if 
                required by law, court order, or government request, or if we believe disclosure is necessary to 
                protect our rights, property, or safety, or that of our users or the public.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Business transfers</strong>. In the event of a merger, 
                acquisition, or sale of assets, user information may be transferred as part of that transaction. 
                We will notify you before your information becomes subject to a different privacy policy.
              </li>
            </ul>
          </Section>

          <Section title="6. Cookies" index={5}>
            <p>
              We use cookies and similar tracking technologies to provide and improve the Service. Here's how we 
              categorize them:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-[#F5F5F7]">Essential cookies</strong>. Required for login authentication, 
                security, and basic functionality. These cookies cannot be disabled as the Service would not function 
                without them.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Analytics cookies</strong>. Help us understand how users 
                interact with the platform. You can opt out of these cookies through your browser settings or our 
                cookie preference center.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Marketing cookies</strong>. Used for targeted advertising 
                and promotional purposes. These are only placed with your explicit consent. You can opt in or out 
                at any time.
              </li>
            </ul>
            <p>
              For more details, please see our{' '}
              <a href="/cookies" className="text-[#FB7185] hover:text-[#F59E0B] transition-colors">
                Cookie Policy
              </a>.
            </p>
          </Section>

          <Section title="7. Your Rights" index={6}>
            <p>
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-[#F5F5F7]">Access</strong>. Request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Correction</strong>. Request that we correct inaccurate or incomplete data.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Deletion</strong>. Request that we delete your personal data ("right to be forgotten").
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Portability</strong>. Request a machine-readable copy of your data for transfer to another service.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Restriction</strong>. Request that we limit how we use your data.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">Objection</strong>. Object to certain types of processing, such as direct marketing.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please email us at{' '}
              <a href="mailto:privacy@datingcoach.site" className="text-[#FB7185] hover:text-[#F59E0B] transition-colors">
                privacy@datingcoach.site
              </a>. 
              We will respond to all requests within 30 days. For EU residents, these rights are granted under the 
              General Data Protection Regulation (GDPR). For California residents, certain rights are granted under 
              the California Consumer Privacy Act (CCPA).
            </p>
          </Section>

          <Section title="8. Data Retention" index={7}>
            <p>
              <strong className="text-[#F5F5F7]">Active accounts:</strong> We retain your personal data for as long 
              as your account remains active. This includes your account information, conversation history, and usage data.
            </p>
            <p>
              <strong className="text-[#F5F5F7]">Deleted accounts:</strong> When you delete your account, we begin 
              a comprehensive deletion process. Your personal data is permanently removed from our active systems within 
              30 days. Some anonymized, aggregated data may be retained for analytical purposes, but this data cannot 
              be linked back to you.
            </p>
            <p>
              We may retain certain information longer where required by law, for legal proceedings, or to prevent fraud 
              or abuse.
            </p>
          </Section>

          <Section title="9. Children's Privacy" index={8}>
            <p>
              The Service is intended for users who are 18 years of age or older. We do not knowingly collect personal 
              information from anyone under the age of 18. If we become aware that we have collected personal data from 
              a child under 18, we will take immediate steps to delete that information.
            </p>
            <p>
              If you believe we may have inadvertently collected information from a minor, please contact us immediately 
              at{' '}
              <a href="mailto:privacy@datingcoach.site" className="text-[#FB7185] hover:text-[#F59E0B] transition-colors">
                privacy@datingcoach.site
              </a>.
            </p>
          </Section>

          <Section title="10. International Transfers" index={9}>
            <p>
              DatingCoach is operated from the United States. If you are accessing the Service from outside the US, 
              please be aware that your information will be transferred to, stored, and processed in the United States 
              and potentially other countries where our service providers operate.
            </p>
            <p>
              <strong className="text-[#F5F5F7]">For EU users:</strong> We comply with the GDPR through the use of 
              Standard Contractual Clauses (SCCs) approved by the European Commission for transferring personal data 
              outside the European Economic Area (EEA). These contractual safeguards ensure that your data receives 
              an adequate level of protection regardless of where it is processed.
            </p>
            <p>
              You have the right to request a copy of the Standard Contractual Clauses we use by contacting us at{' '}
              <a href="mailto:privacy@datingcoach.site" className="text-[#FB7185] hover:text-[#F59E0B] transition-colors">
                privacy@datingcoach.site
              </a>.
            </p>
          </Section>

          <Section title="11. Changes to This Policy" index={10}>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes via email 
              to the address associated with your account at least 30 days before the changes take effect.
            </p>
            <p>
              Your continued use of the Service after the effective date of the revised Privacy Policy constitutes 
              your acceptance of the changes. We encourage you to review this page periodically for the latest 
              information on our privacy practices.
            </p>
          </Section>

          <Section title="12. Contact" index={11}>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <div className="glass-card-elevated p-6 mt-4">
              <p className="text-[#F5F5F7] font-semibold mb-1">DatingCoach, Inc., Data Protection</p>
              <p className="text-[#A1A1AA] mb-1">
                Email:{' '}
                <a href="mailto:privacy@datingcoach.site" className="text-[#FB7185] hover:text-[#F59E0B] transition-colors">
                  privacy@datingcoach.site
                </a>
              </p>
              <p className="text-[#52525B] text-body-sm">
                We aim to respond to all privacy-related inquiries within 48 business hours.
              </p>
            </div>
          </Section>
        </div>

        {/* Back to top */}
        <div className="max-w-[800px] mx-auto mt-16 text-center">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-[#FB7185] hover:text-[#F59E0B] transition-colors text-body-sm font-semibold"
          >
            <ArrowUp className="w-4 h-4" />
            Back to top
          </button>
        </div>
      </section>
    </div>
  )
}
