import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { SocialProof } from '@/components/landing/SocialProof'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Guarantee } from '@/components/landing/Guarantee'
import { Testimonials } from '@/components/landing/Testimonials'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Guarantee />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
