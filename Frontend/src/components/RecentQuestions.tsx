import React from 'react'
import Link from 'next/link'
import Question from '@/components/Question'

interface RecentQuestion {
  id: string
  question: string
  topic: string
  grade: string
  date: string
}

const RecentQuestions: React.FC = () => {
  const recentQuestions: RecentQuestion[] = [
    { id: '1', question: 'Solve the equation $$e^{2x} - 4e^x - 5 = 0$$', topic: 'Exponential Equations', grade: 'A', date: '2023-11-15' },
    { id: '2', question: 'Solve the system of equations: $$2x + y = 5$$, $$x - y = 1$$', topic: 'Systems of Equations', grade: 'A-', date: '2023-11-14' },
    { id: '3', question: 'Find the domain and range of $$f(x) = \\sqrt{x - 2}$$', topic: 'Functions', grade: 'B+', date: '2023-11-13' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Questions</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recentQuestions.map((question) => (
          <div key={question.id} className="flex justify-between items-center border-b pb-4">
            <div className="w-full">
              <Question question={question.question} />
              <p className="text-sm text-gray-500">{question.topic} • {question.date}</p>
            </div>
            <div className="flex items-center ml-4">
              <span className="mr-2 text-gray-800 font-semibold">{question.grade}</span>
              <Link href={`/feedback/${question.id}`}>
                <button className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1 rounded border border-blue-500 text-sm">
                  Review
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentQuestions