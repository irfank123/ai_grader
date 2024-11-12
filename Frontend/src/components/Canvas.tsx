'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import p5Types from 'p5';

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
});

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [buttonText, setButtonText] = useState("Next Section");
  const p5InstanceRef = useRef<p5Types | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.touchAction = isDrawing ? 'none' : 'auto';
    }
  }, [isDrawing]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5InstanceRef.current = p5;
    const canvasWidth = canvasParentRef.clientWidth * 2;
    const canvasHeight = 500;

    const canvas = p5.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(canvasParentRef);
    canvasRef.current = canvas.elt;
    p5.background(255);

    p5.noFill();
    p5.strokeWeight(4);
    p5.stroke(0);
  };

  const draw = (p5: p5Types) => {
    if (isDrawing) {
      const halfWidth = p5.width / 2;
      const adjustedMouseX = p5.mouseX - (currentSection * halfWidth);
      const adjustedPMouseX = p5.pmouseX - (currentSection * halfWidth);
      
      if (adjustedMouseX >= 0 && adjustedMouseX < halfWidth) {
        p5.line(
          adjustedPMouseX + (currentSection * halfWidth), 
          p5.pmouseY, 
          adjustedMouseX + (currentSection * halfWidth), 
          p5.mouseY
        );
      }
    }
  };

  const mousePressed = (p5: p5Types) => {
    const halfWidth = p5.width / 2;
    const adjustedMouseX = p5.mouseX - (currentSection * halfWidth);
    
    if (adjustedMouseX >= 0 && adjustedMouseX < halfWidth) {
      setIsDrawing(true);
    }
  };

  const mouseReleased = () => {
    setIsDrawing(false);
  };

  const touchStarted = (p5: p5Types) => {
    const halfWidth = p5.width / 2;
    if (p5.touches && p5.touches.length > 0) {
      const touch = p5.touches[0] as p5Types.Vector;
      const adjustedTouchX = touch.x - (currentSection * halfWidth);
      
      if (adjustedTouchX >= 0 && adjustedTouchX < halfWidth) {
        setIsDrawing(true);
      }
    }
    return false;
  };

  const touchEnded = () => {
    setIsDrawing(false);
    return false;
  };

  const switchSection = () => {
    const newSection = (currentSection + 1) % 2;
    setCurrentSection(newSection);
    setButtonText((prev) => prev === "Next Section" ? "Prev Section" : "Next Section");

    if (containerRef.current) {
      containerRef.current.scrollLeft = newSection * (containerRef.current.clientWidth);
    }
  };

  const clearCanvas = () => {
    if (p5InstanceRef.current) {
      const p5 = p5InstanceRef.current;
      const halfWidth = p5.width / 2;
      p5.fill(255);
      p5.noStroke();
      p5.rect(currentSection * halfWidth, 0, halfWidth, p5.height);
      p5.noFill();
      p5.stroke(0);
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

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'canvas_sections.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: '500px',
          width: '100%',
          border: '1px solid gray',
          overflow: 'hidden',
        }}
      >
        <Sketch 
          setup={setup} 
          draw={draw}
          mousePressed={mousePressed}
          mouseReleased={mouseReleased}
          touchStarted={touchStarted}
          touchEnded={touchEnded}
        />
      </div>
      <div className="mt-4 space-x-4" style={{ textAlign: 'center', marginTop: '10px' }}>
        <Button onClick={switchSection} variant="secondary">
          {buttonText}
        </Button>
        <Button onClick={clearCanvas} variant="destructive">
          Clear Canvas
        </Button>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "outline" : "default"}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <Button
          onClick={saveAudio}
          variant="secondary"
          disabled={audioChunks.length === 0}
        >
          Save Audio
        </Button>
        <Button onClick={downloadImage} variant="secondary">
          Download Image
        </Button>
      </div>
    </div>
  );
}