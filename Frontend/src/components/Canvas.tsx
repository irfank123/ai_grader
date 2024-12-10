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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
    };
  }, [preventScroll]);

  useEffect(() => {
    if (!isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);

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
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, []);

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // const downloadImage = () => {
  //   if (!canvasRef.current) return;

  //   const canvas = canvasRef.current;
  //   const link = document.createElement('a');
  //   link.download = 'canvas_sections.png';
  //   link.href = canvas.toDataURL('image/png');
  //   link.click();
  // };

  // const saveAudio = () => {
  //   if (audioChunksRef.current.length > 0) {
  //     const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
  //     downloadFile(audioBlob, 'recorded_audio.wav');
  //   } else {
  //     console.log('No audio recorded yet');
  //   }
  // };

  
  const saveAudio = async () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
  
      const formData1 = new FormData();
      const formData2 = new FormData();
      
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '');
      const fileName = `recorded_audio_${formattedDate}_${formattedTime}.wav`;
      
      // Append to both FormData objects
      formData1.append('file', audioBlob, fileName);
      formData2.append('file', audioBlob, fileName);
  
      try {
        // Upload to both storages in parallel
        const [regularResponse, researchResponse] = await Promise.all([
          // Regular storage upload
          fetch('http://localhost:3000/api/v1/upload/audio', {
            method: 'POST',
            body: formData1,
          }),
          // Research storage upload
          fetch('http://localhost:3000/api/v1/upload/research/audio', {
            method: 'POST',
            body: formData2,
          })
        ]);
  
        // Download the file locally
        downloadFile(audioBlob, fileName);
          // Log the raw responses for debugging
        console.log('Regular Response Status:', regularResponse.status);
        console.log('Research Response Status:', researchResponse.status);
  
        try {
          // Try to parse responses individually to identify which one fails
          const regularData = await regularResponse.text(); // Use text() instead of json()
          const researchData = await researchResponse.text();
          
          console.log('Regular Response:', regularData);
          console.log('Research Response:', researchData);
  
          // Try parsing the text as JSON
          const regularJson = regularData ? JSON.parse(regularData) : null;
          const researchJson = researchData ? JSON.parse(researchData) : null;
  
          if (regularResponse.ok && researchResponse.ok) {
            console.log('Regular storage upload:', regularJson?.publicUrl);
            console.log('Research storage upload:', researchJson?.publicUrl);
          } else {
            console.error('Failed to upload to one or more locations:', {
              regular: regularResponse.ok ? 'Success' : 'Failed',
              research: researchResponse.ok ? 'Success' : 'Failed',
              regularStatus: regularResponse.status,
              researchStatus: researchResponse.status
            });
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
      } catch (error) {
        console.error('Error making upload request:', error);
      }
    } else {
      console.log('No audio recorded yet');
    }
  
  };
  // const saveAudio = async () => {
  //   if (audioChunksRef.current.length > 0) {
  //     const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
  
  //     const formData = new FormData();
  //     //const timestamp = Date.now();
  //     const currentDate = new Date();
  //     const formattedDate = currentDate.toISOString().split('T')[0];
  //     const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '');
  //     //formData.append('file', audioBlob, '8888recorded_audio.mp3');

  //     const fileName = `recorded_audio_${formattedDate}_${formattedTime}.wav`;
  //     formData.append('file', audioBlob, fileName);
  
  //     try {
  //       const response = await fetch('http://localhost:3000/api/v1/upload/audio', {
  //         method: 'POST',
  //         body: formData,
  //       });
  //       downloadFile(audioBlob, fileName);
  
  //       const data = await response.json();
  //       if (response.ok) {
  //         console.log('Audio uploaded successfully:', data.publicUrl);
  //       } else {
  //         console.error('Failed to upload audio:', data.message || 'Unknown error');
  //       }
  //     } catch (error) {
  //       console.error('Error uploading audio:', error);
  //     }
  //   } else {
  //     console.log('No audio recorded yet');
  //   }

  // };
  

  // const saveImage = () => {
  //   downloadImage();
  // };
  // const saveImage = async () => {
  //   const canvasBlob = await getCanvasBlob();
  //   if (canvasBlob) {
  //     const url = URL.createObjectURL(canvasBlob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'canvas_sections.png';
  //     link.click();
  //     URL.revokeObjectURL(url);
  //   } else {
  //     console.error('Failed to retrieve canvas content.');
  //   }
  // };
  
  const saveImage = async () => {
    const canvasBlob = await getCanvasBlob();
    if (canvasBlob) {
      const formData = new FormData();
      formData.append('file', canvasBlob, 'c333anvasImage.png');
  
      try {
        const response = await fetch('http://localhost:3000/api/v1/upload/image', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log('Image uploaded successfully:', data.publicUrl);
        } else {
          console.error('Failed to upload image:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.error('Failed to retrieve canvas content.');
    }
  };
  
  

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getCanvasBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (canvasRef.current) {
        canvasRef.current.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      } else {
        resolve(null);
      }
    });
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
          onClick={handleRecordingToggle}
          variant={isRecording ? "outline" : "default"}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <Button onClick={saveImage} variant="default">
          Save Image
        </Button>
        <Button onClick={saveAudio} variant="default">
          Save Audio
        </Button>
      </div>
    </div>
  );
}


