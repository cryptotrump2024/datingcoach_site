import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import SectionHeading from './SectionHeading'

const faqs = [
  {
    q: 'Is this just another app that writes my texts for me?',
    a: "No — the opposite. Reply generators make you dependent; DatingCoach is a flight simulator. You write every message yourself, the coach tells you how it landed and why, and the skill stays with you when you put your phone down.",
  },
  {
    q: 'Who is DatingCoach for?',
    a: "Anyone who wants to get better at dating conversations: app daters tired of chats going nowhere, people getting back into dating after a long relationship, and anyone whose confidence needs reps more than it needs pep talks.",
  },
  {
    q: 'Is my practice private?',
    a: 'Completely. Practice conversations are visible only to you. Without an account, everything stays on your device; with one, your history is stored encrypted and protected so only you can access it. Nothing is ever posted or shared.',
  },
  {
    q: 'How realistic are the personas?',
    a: "Each persona has a distinct personality, texting style and difficulty level — higher levels push back, test you and lose interest if you coast, because that's what real conversations do. They're built on dating psychology research, and they don't hand out easy wins.",
  },
  {
    q: 'What do I get without paying?',
    a: 'The full experience at a smaller volume: three practice conversations, one profile analysis, and coaching feedback on every message — no credit card required.',
  },
]

export default function HomeFAQ() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Questions"
          title="Fair questions, straight answers"
        />
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-card px-6 border-stone-900/10 data-[state=open]:shadow-elevated"
            >
              <AccordionTrigger className="text-left text-heading-sm text-text-primary hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-body text-text-secondary pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="text-center text-body-sm text-text-muted mt-8">
          More questions? <Link to="/faq" className="text-text-rose hover:underline">Visit the help center</Link>
        </p>
      </div>
    </section>
  )
}
