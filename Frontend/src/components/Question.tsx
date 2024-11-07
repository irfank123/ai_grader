import React from 'react'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'

interface QuestionProps {
  question: string | undefined
}

export default function Question({ question }: QuestionProps = { question: undefined }) {
  if (!question) {
    return <div className="text-lg font-semibold text-gray-700">Loading question...</div>
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">Question:</h2>
      <div className="text-lg font-semibold text-gray-700">
        <Latex>{question}</Latex>
      </div>
    </div>
  )
}