import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import BentoFeatures from '@/components/home/BentoFeatures'
import HowItWorks from '@/components/home/HowItWorks'
import PersonaShowcase from '@/components/home/PersonaShowcase'
import ScenarioTeaser from '@/components/home/ScenarioTeaser'
import Testimonials from '@/components/home/Testimonials'
import PricingTeaser from '@/components/home/PricingTeaser'
import HomeFAQ from '@/components/home/HomeFAQ'
import FinalCTA from '@/components/home/FinalCTA'

export default function Home() {
  return (
    <div className="bg-bg-primary">
      <Hero />
      <TrustStrip />
      <BentoFeatures />
      <HowItWorks />
      <PersonaShowcase />
      <ScenarioTeaser />
      <Testimonials />
      <PricingTeaser />
      <HomeFAQ />
      <FinalCTA />
    </div>
  )
}
