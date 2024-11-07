'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/signup')
  }

  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
      <div className="container mx-auto px-4">
        {/* Hero Text Content */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Master Math with AI-Powered Learning</h1>
          <p className="text-xl mb-8">Practice, explain, and get instant feedback to improve your math skills.</p>
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
}