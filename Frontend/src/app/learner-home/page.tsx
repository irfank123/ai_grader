import React from 'react'
import LearnerHeader from '@/components/LearnerHeader'
import LearnerDashboardSubheader from '@/components/LearnerDashboardSubheader'
import StatCards from '@/components/StatCards'
import ProgressSection from '@/components/ProgressSection'
import RecentQuestions from '@/components/RecentQuestions'
import Footer from '@/components/Footer'

const LearnerHome: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <LearnerHeader />
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="container mx-auto px-4">
          <LearnerDashboardSubheader />
        </div>
      </div>
      <main className="flex-grow container mx-auto px-4 py-8">
        <StatCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProgressSection />
          <RecentQuestions />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LearnerHome