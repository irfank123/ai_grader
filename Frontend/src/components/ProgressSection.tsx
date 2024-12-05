import React from 'react'

interface ProgressItemProps {
  label: string
  value: number
  color: string
}

const ProgressItem: React.FC<ProgressItemProps> = ({ label, value, color }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

const ProgressSection: React.FC = () => {
  const topics = [
    "Exponential Equations",
    "Systems of Equations",
    "Functions",
    "Trigonometric Functions",
    "Logarithms",
    "Polynomial Equations",
    "Rational Expressions",
    "Complex Numbers",
    "Matrices",
    "Sequences and Series"
  ]

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Progress</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {topics.map((topic, index) => (
          <ProgressItem 
            key={topic} 
            label={topic} 
            value={Math.floor(Math.random() * 101)} 
            color={colors[index % colors.length]} 
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressSection