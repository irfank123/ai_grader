"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { Button } from "@/components/ui/button";
import FeedbackPageHeader from "@/components/FeedbackPageHeader";
import FeedbackContent from "@/components/FeedbackContent";
import Footer from "@/components/Footer";

interface QuestionData {
  _id: string;
  index: number;
  question: string;
  topic: string;
  answer: string;
  ai_solution: string;
}

interface FeedbackData {
  grade: string;
  writtenFeedback: string;
  spokenFeedback: string;
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
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const saveResponse = async (feedbackData: FeedbackData, questionId: string, userId: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          question_id: questionId,
          gpt_written_feedback: feedbackData.writtenFeedback,
          gpt_spoken_feedback: feedbackData.spokenFeedback,
          grade: feedbackData.grade,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error("Failed to save response:", error);
      setError(
        `Failed to save response. ${error instanceof Error ? error.message : "Please try again."}`
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          throw new Error("No user ID found");
        }
        setUserId(storedUserId);

        const questionResponse = await fetch("http://localhost:3000/api/v1/questions");
        if (!questionResponse.ok) throw new Error(`HTTP error! status: ${questionResponse.status}`);
        const questionData = await questionResponse.json();
        setTotalQuestions(questionData.length);
        const storedIndex = localStorage.getItem("currentQuestionIndex");
        if (storedIndex === null) throw new Error("No question index found");

        const questionIndex = parseInt(storedIndex, 10);
        const currentQuestion = questionData[questionIndex];

        if (isMounted && currentQuestion) {
          setQuestionData(currentQuestion);

          const feedbackResponse = await fetch(`http://localhost:3000/api/v1/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questionId: currentQuestion._id,
              userId: storedUserId,
            }),
          });

          if (feedbackResponse.ok) {
            const feedbackData = await feedbackResponse.json();
            setFeedbackData(feedbackData);
            await saveResponse(feedbackData, currentQuestion._id, storedUserId);
          } else {
            throw new Error(`HTTP error! status: ${feedbackResponse.status}`);
          }
        } else if (isMounted) {
          setError(`Question with index ${questionIndex} not found`);
        }
      } catch (error) {
        if (isMounted) setError("Failed to load data. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTryAnotherQuestion = () => {
    const currentIndex = parseInt(localStorage.getItem("currentQuestionIndex") || "0", 10);
    console.log(currentIndex);
    const nextIndex = (currentIndex + 1) % totalQuestions;
    console.log(nextIndex);
    localStorage.setItem("currentQuestionIndex", nextIndex.toString());
    router.push("/practice");
  };

  const formatSolution = (solution: string) => {
    return solution
      .split("\n")
      .map((line) => {
        line = line.trim();
        if (line.startsWith("\\text{") || !line.includes("\\")) {
          return line.replace("\\text{", "").replace("}", "");
        } else {
          return `${line}`;
        }
      })
      .join("\n");
  };

  if (isLoading) {
    return <div className='p-4'>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-500 p-4'>{error}</div>;
  }

  if (!questionData || !feedbackData) {
    return <div className='p-4'>No data available</div>;
  }

  return (
    <MathJaxContext config={config}>
      <div className='min-h-screen bg-gray-100 flex flex-col'>
        <div className='flex-grow p-8'>
          <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
            <FeedbackPageHeader />
            <div className='p-6 space-y-8'>
              <FeedbackContent
                grade={feedbackData.grade}
                writtenFeedback={feedbackData.writtenFeedback}
                spokenFeedback={feedbackData.spokenFeedback}
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
