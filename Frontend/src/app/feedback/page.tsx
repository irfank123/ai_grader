"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { Button } from "@/components/ui/button";
import FeedbackPageSubheader from "@/components/FeedbackPageSubheader";
import FeedbackContent from "@/components/FeedbackContent";
import Footer from "@/components/Footer";
import LearnerHeader from "@/components/LearnerHeader";


interface QuestionData {
  _id: string;
  index: number;
  question: string;
  topic: string;
  answer: string;
  ai_solution: string;
}

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true,
  },
};

export default function FeedbackPage() {
  const router = useRouter();
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/questions");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTotalQuestions(data.length);

        const storedIndex = localStorage.getItem("currentQuestionIndex");
        if (storedIndex === null) {
          throw new Error("No question index found");
        }

        const questionIndex = parseInt(storedIndex, 10);

        const currentQuestion = data[questionIndex];
        if (currentQuestion) {
          setQuestionData(currentQuestion);
        } else {
          setError(`Question with index ${questionIndex} not found`);
        }
      } catch (error) {
        console.error("Error loading question data:", error);
        setError("Failed to load question data. Please try again.");
      }
    };

    loadQuestionData();
  }, []);

  const handleTryAnotherQuestion = () => {
    const currentIndex = parseInt(localStorage.getItem("currentQuestionIndex") || "0", 10);
    const nextIndex = (currentIndex + 1) % totalQuestions;
    localStorage.setItem("currentQuestionIndex", nextIndex.toString());
    router.push("/practice");
  };

  const formatSolution = (solution: string) => {
    return solution
      .split("\n")
      .map((line) => {
        line = line.trim();
        if (line.startsWith("\\text{") || !line.includes("\\")) {
          // Text lines
          return line.replace("\\text{", "").replace("}", "");
        } else {
          // Math lines
          return `${line}`;
        }
      })
      .join("\n");
  };

  if (error) {
    return <div className='text-red-500 p-4'>{error}</div>;
  }

  if (!questionData) {
    return <div className='p-4'>Loading...</div>;
  }

  return (
    <MathJaxContext config={config}>
      <div className='min-h-screen bg-gray-100 flex flex-col'>
      <LearnerHeader />
        <div className='flex-grow p-8'>
          <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
            <FeedbackPageSubheader />
            <div className='p-6 space-y-8'>
              <FeedbackContent
                grade='Placeholder Grade'
                writtenFeedback='Placeholder Written Feedback'
                spokenFeedback='Placeholder Spoken Feedback'
              />
              <div className='mt-6'>
                <h3 className='text-lg font-semibold mb-2'>AI Solution:</h3>
                <div className='bg-gray-100 p-4 rounded-md overflow-x-auto'>
                  <MathJax>{formatSolution(questionData.ai_solution)}</MathJax>
                </div>
              </div>
              <Button
                onClick={handleTryAnotherQuestion}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white'
              >
                Try Another Question
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </MathJaxContext>
  );
}
