import React from 'react'

interface FeedbackContentProps {
  grade: string
  writtenFeedback: string
  spokenFeedback: string
}

const FeedbackContent: React.FC<FeedbackContentProps> = ({ grade, writtenFeedback, spokenFeedback }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Your Grade</h2>
        <p className="text-4xl font-bold text-blue-600">{grade}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Written Solution Feedback</h3>
        <p className="text-gray-700">{writtenFeedback}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Spoken Explanation Feedback</h3>
        <p className="text-gray-700">{spokenFeedback}</p>
      </div>
    </div>
  )
}

export default FeedbackContent