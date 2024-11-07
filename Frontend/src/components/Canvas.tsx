'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function P5Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [audioData, setAudioData] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const [lastSaveTime, setLastSaveTime] = useState(Date.now())
  const [currentCanvasIndex, setCurrentCanvasIndex] = useState(0) // track current canvas index
  const [canvases, setCanvases] = useState<string[]>([]) // store each canvas as an image
  const [isDrawing, setIsDrawing] = useState(false) // track drawing state

  // Prevent page scrolling only while drawing
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      document.removeEventListener('touchmove', preventScroll)
    }
  }, [isDrawing])

  // p5 setup function to initialize the canvas
  const setup = (p5: any, canvasParentRef: Element) => {
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef)
    canvasRef.current = canvasParentRef.querySelector('canvas') as HTMLCanvasElement
    p5.background(255)
    p5.strokeWeight(4)
    p5.stroke(0)
    p5.noFill()
    canvas.touchStarted(() => {
      setIsDrawing(true) // enable drawing mode
      return false
    })
    canvas.touchEnded(() => {
      setIsDrawing(false) // disable drawing mode
      return false
    })
  }

  // p5 draw function to handle drawing
  const draw = (p5: any) => {
    if (Date.now() - lastSaveTime > 10000) {
      saveCanvasToMongoDB()
      setLastSaveTime(Date.now())
    }

    if (p5.mouseIsPressed || p5.touches.length > 0) {
      const x = p5.touches.length > 0 ? p5.touches[0].x : p5.mouseX
      const y = p5.touches.length > 0 ? p5.touches[0].y : p5.mouseY
      p5.line(p5.pmouseX, p5.pmouseY, x, y)
    }
  }

  // save the canvas as a base64 string to the MongoDB
  const saveCanvasToMongoDB = async () => {
    if (canvasRef.current) {
      const blob = await new Promise<Blob>((resolve) => canvasRef.current!.toBlob(resolve as BlobCallback))
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64data = reader.result as string

        const response = await fetch("http://localhost:3000/api/v1/users/", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvas: base64data, audio: audioData })
        })

        if (response.ok) {
          console.log('Canvas and audio saved to MongoDB')
        } else {
          console.error('Error saving to MongoDB')
        }
      }
      reader.readAsDataURL(blob)
    }
  }

  // save the current canvas and move to a new screen
  const saveCurrentCanvas = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png') // get canvas as image
      setCanvases((prev) => {
        const updatedCanvases = [...prev]
        updatedCanvases[currentCanvasIndex] = imageData // save image to current canvas index
        return updatedCanvases
      })
      clearCanvas() // clear the canvas after saving
    }
  }

  // switch to a new or saved canvas screen
  const goToCanvas = (index: number) => {
    if (index < 0 || index >= canvases.length) return // prevent out-of-bounds access
    setCurrentCanvasIndex(index)
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      const image = new Image()
      image.src = canvases[index] // load saved image data
      image.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height) // clear canvas
        ctx.drawImage(image, 0, 0) // draw saved canvas data
      }
    }
  }

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d')
    ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
  }

  const handleAudioRecording = () => {
    if (!isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
    setIsRecording(!isRecording)
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const newRecorder = new MediaRecorder(stream)
    const audioChunks: Blob[] = []

    newRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    newRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      const reader = new FileReader()
      reader.onloadend = () => {
        setAudioData(reader.result as string)
      }
      reader.readAsDataURL(audioBlob)
    }

    newRecorder.start()
    setRecorder(newRecorder)
  }

  const stopRecording = () => {
    recorder?.stop()
  }

  // cleanup function to save current canvas when component unmounts
  useEffect(() => {
    return () => {
      saveCanvasToMongoDB()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Sketch setup={setup} draw={draw} />
      <div className="mt-4 space-x-4">
        <button onClick={saveCanvasToMongoDB} className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit Answer
        </button>
        <button onClick={clearCanvas} className="px-4 py-2 bg-red-500 text-white rounded">
          Clear Canvas
        </button>
        <button onClick={handleAudioRecording} className={`px-4 py-2 ${isRecording ? 'bg-gray-500' : 'bg-green-500'} text-white rounded`}>
          {isRecording ? 'Stop Recording' : 'Record Audio'}
        </button>
        <button onClick={() => goToCanvas(currentCanvasIndex - 1)} className="px-4 py-2 bg-gray-400 text-white rounded">
          Previous Canvas
        </button>
        <button onClick={() => {
          saveCurrentCanvas()
          goToCanvas(currentCanvasIndex + 1)
        }} className="px-4 py-2 bg-gray-400 text-white rounded">
          Next Canvas
        </button>
      </div>
    </div>
  )
}
