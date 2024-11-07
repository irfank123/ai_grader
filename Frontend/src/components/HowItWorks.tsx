export default function HowItWorks() {
    const steps = [
      { number: 1, title: "Sign Up", description: "Create your account" },
      { number: 2, title: "Practice", description: "Solve math problems" },
      { number: 3, title: "Explain", description: "Record your thought process" },
      { number: 4, title: "Improve", description: "Get AI feedback and learn" }
    ]
  
    return (
      <section id="how-it-works" className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How AI Grader Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            {steps.map((step, index) => (
              <div key={index} className="w-full md:w-1/5 text-center mb-8 md:mb-0">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-blue-500">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }