'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { Button } from "@/components/ui/button"
import FeedbackPageHeader from '@/components/FeedbackPageHeader'
import FeedbackContent from '@/components/FeedbackContent'
import Solution from '@/components/Solution'
import Footer from '@/components/Footer'

// define the structure for question data used on the feedback page
interface QuestionData {
  index: number
  question: string
  answer: string
  solution: string
  written_feedback: string
  spoken_feedback: string
  grade: string
}

export default function FeedbackPage() {
  const router = useRouter() // initialize the router for navigation
  const [questionData, setQuestionData] = useState<QuestionData | null>(null) // state for current question data
  const [error, setError] = useState<string | null>(null) // state to handle any loading errors
  const [totalQuestions, setTotalQuestions] = useState(0) // store total number of questions in the dataset

  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        // fetch the CSV file containing question data
        const response = await fetch('/mock_data.csv')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const csvData = await response.text()
        
        // parse the CSV data and store the total number of questions
        const parsedData = Papa.parse<QuestionData>(csvData, { header: true }).data
        setTotalQuestions(parsedData.length)

        // retrieve the current question index from localStorage
        const storedIndex = localStorage.getItem('currentQuestionIndex')
        if (storedIndex === null) {
          throw new Error('No question index found')
        }

        const questionIndex = parseInt(storedIndex, 10) // parse the index from storage

        // find and set the current question data based on the index
        const currentQuestion = parsedData[questionIndex]
        if (currentQuestion) {
          setQuestionData(currentQuestion)
        } else {
          setError(`Question with index ${questionIndex} not found`) // set error if question is missing
        }
      } catch (error) {
        console.error('Error loading question data:', error)
        setError('Failed to load question data. Please try again.') // set a general error message
      }
    }

    loadQuestionData() // call function to load data on component mount
  }, [])

  // handler for "Try Another Question" button
  const handleTryAnotherQuestion = () => {
    // get the current question index from localStorage
    const currentIndex = parseInt(localStorage.getItem('currentQuestionIndex') || '0', 10)
    // determine the next index, looping back if at the end
    const nextIndex = (currentIndex + 1) % totalQuestions
    localStorage.setItem('currentQuestionIndex', nextIndex.toString()) // store the new index
    router.push('/practice') // navigate to the practice page
  }

  // display error message if there's an error loading the question data
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  // display a loading message if data is still being fetched
  if (!questionData) {
    return <div className="p-4">Loading...</div>
  }

  // render the feedback page with question details, feedback, and navigation options
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <FeedbackPageHeader /> {/* header component */}
          <div className="p-6 space-y-8">
            <FeedbackContent 
              grade={questionData.grade}
              writtenFeedback={questionData.written_feedback}
              spokenFeedback={questionData.spoken_feedback}
            />
            <Solution solution={questionData.solution} />
            <Button 
              onClick={handleTryAnotherQuestion} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Another Question
            </Button>
          </div>
        </div>
      </div>
      <Footer /> {/* footer component */}
    </div>
  )
}
