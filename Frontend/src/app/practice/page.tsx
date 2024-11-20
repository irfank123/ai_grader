"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import PracticePageSubheader from "@/components/PracticePageSubheader";
import ModeToggle from "@/components/ModeToggle";
import Canvas from "@/components/Canvas";
import Footer from "@/components/Footer";
import SubmitButton from "@/components/ui/submit-button";
import QuestionNavigation from "@/components/QuestionNavigation";
import LearnerHeader from "@/components/LearnerHeader";

interface QuestionData {
  _id: string;
  question: string;
  answer: string;
  module: string;
}

function LatexQuestion({ question }: { question: string }) {
  return (
    <div className='text-lg mb-4 overflow-x-auto p-4'>
      <MathJax>{`\$$${question}\$$`}</MathJax>
    </div>
  );
}

export default function PracticePage() {
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/v1/questions");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);

        const storedIndex = localStorage.getItem("currentQuestionIndex");
        if (storedIndex !== null) {
          const parsedIndex = parseInt(storedIndex, 10);
          if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < data.length) {
            setCurrentQuestionIndex(parsedIndex);
          }
        }
      } catch (error) {
        console.error("Error loading questions:", error);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleSubmit = () => {
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
    router.push("/feedback");
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex === questions.length - 1 ? 0 : prevIndex + 1;
      localStorage.setItem("currentQuestionIndex", nextIndex.toString());
      return nextIndex;
    });
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? questions.length - 1 : prevIndex - 1;
      localStorage.setItem("currentQuestionIndex", newIndex.toString());
      return newIndex;
    });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>Loading questions...</div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center text-red-500'>{error}</div>
    );
  }

  return (
    <MathJaxContext>
      <div className='min-h-screen bg-gray-100 flex flex-col'>
      <LearnerHeader />
        <div className='flex-grow p-8'>
          <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
            <PracticePageSubheader />

            <div className='p-6'>
              <ModeToggle mode={mode} setMode={setMode} />

              {questions.length > 0 && (
                <LatexQuestion question={questions[currentQuestionIndex].question} />
              )}

              <QuestionNavigation
                onPreviousQuestion={handlePreviousQuestion}
                onNextQuestion={handleNextQuestion}
              />
                <Canvas />
              </div>
              <br />
              <SubmitButton onClick={handleSubmit} />
          </div>
        </div>

        <Footer />
      </div>
    </MathJaxContext>
  );
}
