'use client'

import Link from 'next/link'

export default function LandingPageHeader() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo and Brand Name */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full mr-3"></div>
          <span className="text-xl font-bold text-gray-800">AI Grader</span>
        </div>
        {/* Navigation Menu */}
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#features" className="text-gray-600 hover:text-blue-500">Features</a></li>
            <li><a href="#how-it-works" className="text-gray-600 hover:text-blue-500">How It Works</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-500">About</a></li>
            <li>
              <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Sign Up
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-gray-600 hover:text-blue-500">
                Log In
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}