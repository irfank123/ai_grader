import LandingPageHeader from '@/components/LandingPageHeader'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <LandingPageHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}