'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [buttonText, setButtonText] = useState("Next Section");
  const p5InstanceRef = useRef<p5Types | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);

  const preventScroll = useCallback((e: TouchEvent) => {
    if (isDrawing) {
      e.preventDefault();
    }
  }, [isDrawing]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.touchAction = 'none';
    }

    document.body.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isDrawing, preventScroll, isRecording]);

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
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      audioChunksRef.current = [];

      processorRef.current.onaudioprocess = (e) => {
        const channel = e.inputBuffer.getChannelData(0);
        audioChunksRef.current.push(new Float32Array(channel));
      };

      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (processorRef.current && audioContextRef.current) {
      processorRef.current.disconnect();
      audioContextRef.current.close();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    setIsRecording(false);

    // Convert audio data to WAV format
    const audioData = mergeBuffers(audioChunksRef.current);
    const wavBlob = createWaveBlob(audioData);

    // Create download link
    const url = URL.createObjectURL(wavBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recorded_audio.wav';
    link.click();
  };

  const mergeBuffers = (bufferArray: Float32Array[]): Float32Array => {
    let totalLength = 0;
    for (let buffer of bufferArray) {
      totalLength += buffer.length;
    }
    const result = new Float32Array(totalLength);
    let offset = 0;
    for (let buffer of bufferArray) {
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  };

  const createWaveBlob = (audioData: Float32Array): Blob => {
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioData.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');

    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // subchunk1size
    view.setUint16(20, 1, true); // audio format
    view.setUint16(22, 1, true); // num of channels
    view.setUint32(24, 44100, true); // sample rate
    view.setUint32(28, 44100 * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample

    // Data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, audioData.length * 2, true);

    // Write PCM
    const length = audioData.length;
    const index = 44;
    const volume = 1;
    for (let i = 0; i < length; i++) {
      view.setInt16(index + i * 2, audioData[i] * (0x7FFF * volume), true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const writeUTFBytes = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'canvas_sections.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const saveAll = () => {
    downloadImage();
    if (isRecording) {
      stopRecording();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div
        ref={containerRef}
        className="w-full border border-gray-300 rounded-lg overflow-hidden"
        style={{ height: '500px' }}
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
      <div className="flex flex-wrap justify-center gap-2 mt-4">
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
        <Button onClick={saveAll} variant="default">
          Save All
        </Button>
      </div>
    </div>
  );
}