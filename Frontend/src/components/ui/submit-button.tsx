import React from 'react'
import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  onClick?: () => void
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  return (
    <Button 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      onClick={onClick}
    >
      Submit Answer
    </Button>
  )
}

export default SubmitButton