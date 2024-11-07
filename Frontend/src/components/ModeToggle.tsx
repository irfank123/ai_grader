import React from 'react'
import { Switch } from "@/components/ui/switch"

interface ModeToggleProps {
  mode: 'practice' | 'exam'
  setMode: (mode: 'practice' | 'exam') => void
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className="text-lg font-medium">Mode:</span>
      <div className="flex items-center space-x-2">
        <span className={`${mode === 'practice' ? 'text-blue-600' : 'text-gray-400'}`}>Practice</span>
        <Switch
          checked={mode === 'exam'}
          onCheckedChange={(checked) => setMode(checked ? 'exam' : 'practice')}
        />
        <span className={`${mode === 'exam' ? 'text-blue-600' : 'text-gray-400'}`}>Exam</span>
      </div>
    </div>
  )
}

export default ModeToggle