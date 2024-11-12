'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
});

export default function P5Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());
  const [currentSection, setCurrentSection] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [buttonText, setButtonText] = useState("Next Section");

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.touchAction = isDrawing ? 'none' : 'auto';
    }
  }, [isDrawing]);

  const setup = (p5: any, canvasParentRef: Element) => {
    const canvasWidth = canvasParentRef.clientWidth;
    const canvasHeight = 500;
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    canvasRef.current = canvasParentRef.querySelector('canvas') as HTMLCanvasElement;

    p5.background(255);
    p5.strokeWeight(4);
    p5.stroke(0);
    p5.noFill();

    p5.touchStarted = () => {
      setIsDrawing(true);
      return false;
    };
    p5.touchEnded = () => {
      setIsDrawing(false);
      return false;
    };
    p5.mousePressed = () => {
      setIsDrawing(true);
    };
    p5.mouseReleased = () => {
      setIsDrawing(false);
    };
  };

  const draw = (p5: any) => {
    p5.background(255);
    
    // Draw content based on current section
    if (currentSection === 0) {
      p5.fill(200, 100, 100);
      p5.rect(0, 0, p5.width, p5.height);
      p5.fill(255);
      p5.textSize(32);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(`Section 1`, p5.width / 2, p5.height / 2);
    } else {
      p5.fill(100, 100, 200);
      p5.rect(0, 0, p5.width, p5.height);
      p5.fill(255);
      p5.textSize(32);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(`Section 2`, p5.width / 2, p5.height / 2);
    }

    if (isDrawing) {
      const x = p5.mouseX;
      const y = p5.mouseY;
      p5.line(p5.pmouseX, p5.pmouseY, x, y);
    }
  };

  const switchSection = () => {
    setCurrentSection((prev) => (prev + 1) % 2);
    setButtonText((prev) => prev === "Next Section" ? "Prev Section" : "Next Section");
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const event = new Event('redraw');
      window.dispatchEvent(event);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveAudio = () => {
    if (audioChunks.length === 0) return;

    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'recorded_audio.webm';
    link.click();

    setAudioChunks([]);
  };

  useEffect(() => {
    const handleRedraw = () => {
      if (canvasRef.current) {
        const p5Instance = (window as any).p5instance;
        if (p5Instance) {
          p5Instance.redraw();
        }
      }
    };
    window.addEventListener('redraw', handleRedraw);
    return () => {
      window.removeEventListener('redraw', handleRedraw);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
      }
    };
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: '500px',
          width: '100%',
          border: '1px solid gray',
        }}
      >
        <Sketch setup={setup} draw={draw} />
      </div>
      <div className="mt-4 space-x-4" style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          onClick={switchSection}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          style={{ marginRight: '10px' }}
        >
          {buttonText}
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded"
          style={{ marginRight: '10px' }}
        >
          Clear Canvas
        </button>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 ${isRecording ? 'bg-yellow-500' : 'bg-green-500'} text-white rounded`}
          style={{ marginRight: '10px' }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button
          onClick={saveAudio}
          className="px-4 py-2 bg-purple-500 text-white rounded"
          disabled={audioChunks.length === 0}
        >
          Save Audio
        </button>
      </div>
    </div>
  );
}