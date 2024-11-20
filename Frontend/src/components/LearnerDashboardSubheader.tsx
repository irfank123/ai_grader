import React from 'react'
import Link from 'next/link'

export default function LearnerDashboardSubheader() {
  return (
    <div className="text-white py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Learning Dashboard</h1>
        <p className="text-sm mt-1">Track progress and continue learning</p>
      </div>
      <Link href="/practice">
        <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200">
          Continue Practice
        </button>
      </Link>
    </div>
  )
}