import React from 'react'
import { BookOpen, GraduationCap, Award } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className="mr-4 text-blue-500">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard icon={<BookOpen className="h-8 w-8" />} title="Questions Attempted" value="15" />
      <StatCard icon={<GraduationCap className="h-8 w-8" />} title="Topics Practiced" value="5" />
      <StatCard icon={<Award className="h-8 w-8" />} title="Highest Grade" value="A" />
    </div>
  )
}

export default StatCards