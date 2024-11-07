import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface QuestionNavigationProps {
  onPreviousQuestion: () => void
  onNextQuestion: () => void
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  onPreviousQuestion,
  onNextQuestion
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Previous question button */}
      <Button 
        onClick={onPreviousQuestion}
        variant="outline"
        className="flex items-center"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      {/* Next question button */}
      <Button 
        onClick={onNextQuestion}
        variant="outline"
        className="flex items-center"
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

export default QuestionNavigation