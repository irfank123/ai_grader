"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import PracticePageHeader from "@/components/PracticePageHeader";
import ModeToggle from "@/components/ModeToggle";
import Question from "@/components/Question";
import Canvas from "@/components/Canvas";
import Footer from "@/components/Footer";
import SubmitButton from "@/components/ui/submit-button";
import QuestionNavigation from "@/components/QuestionNavigation";

// define the structure for question data items
interface QuestionData {
  index: number;
  question: string;
  answer: string;
  solution: string;
  ai_solution: string;
  written_feedback: string;
  spoken_feedback: string;
}

export default function PracticePage() {
  // state to manage mode (either "practice" or "exam")
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  // state to hold the list of questions loaded from CSV
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  // state to track the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const router = useRouter(); // useRouter for navigation within the app

  // load questions from the CSV file when the component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // fetch the CSV file containing questions
        const response = await fetch("/mock_data.csv");
        const csvData = await response.text();
        // parse CSV data into question objects
        const parsedData = Papa.parse<QuestionData>(csvData, { header: true });
        setQuestions(parsedData.data);

        // check for a previously stored question index in localStorage
        const storedIndex = localStorage.getItem("currentQuestionIndex");
        if (storedIndex !== null) {
          const parsedIndex = parseInt(storedIndex, 10);
          // validate stored index and set it if valid
          if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < parsedData.data.length) {
            setCurrentQuestionIndex(parsedIndex);
          }
        }
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };
    loadQuestions();
  }, []);

  // handle submit action, store current question index, and navigate to feedback page
  const handleSubmit = () => {
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
    router.push("/feedback");
  };

  // navigate to the next question
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      // determine the next question index, looping back to the start if needed
      const nextIndex = prevIndex === questions.length - 1 ? 0 : prevIndex + 1;
      localStorage.setItem("currentQuestionIndex", nextIndex.toString()); // update stored index
      return nextIndex;
    });
  };

  // navigate to the previous question
  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      // determine the previous question index, looping to the last if at the start
      const newIndex = prevIndex === 0 ? questions.length - 1 : prevIndex - 1;
      localStorage.setItem("currentQuestionIndex", newIndex.toString()); // update stored index
      return newIndex;
    });
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <div className='flex-grow p-8'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
          <PracticePageHeader /> {/* page header component */}

          <div className='p-6'>
            {/* mode toggle component to switch between practice and exam modes */}
            <ModeToggle mode={mode} setMode={setMode} />

            {/* render the current question if questions are loaded */}
            {questions.length > 0 && (
              <Question question={questions[currentQuestionIndex].question} />
            )}

            {/* navigation for moving between questions */}
            <QuestionNavigation
              onPreviousQuestion={handlePreviousQuestion}
              onNextQuestion={handleNextQuestion}
            />

            {/* canvas component for user to work on the solution */}
            <Canvas />

            {/* button to submit answer and navigate to feedback */}
            <SubmitButton onClick={handleSubmit} />
          </div>
        </div>
      </div>

      {/* footer component at the bottom of the page */}
      <Footer />
    </div>
  );
}
