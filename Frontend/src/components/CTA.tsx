import { Button } from "@/components/ui/button";


export default function CTA() {
  return (
    <section className="bg-blue-500 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Math Skills?</h2>
        <p className="text-xl mb-8">Join AI Grader today and experience the future of math learning.</p>
        <Button className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300">
          Get Started for Free
        </Button>
      </div>
    </section>
  )
}

