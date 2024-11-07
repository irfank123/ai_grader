import React from 'react'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'

interface SolutionProps {
  solution: string
}

const Solution: React.FC<SolutionProps> = ({ solution }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Solution:</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <Latex>{solution}</Latex>
      </div>
    </div>
  )
}

export default Solution