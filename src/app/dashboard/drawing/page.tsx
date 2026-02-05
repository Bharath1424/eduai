'use client';

import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, PenTool } from 'lucide-react';

export default function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // For high DPI displays
    const scale = window.devicePixelRatio;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    const resizeCanvas = () => {
      if(canvas.parentElement){
        const parentWidth = canvas.parentElement.clientWidth;
        const parentHeight = canvas.parentElement.clientHeight;
        canvas.width = Math.floor(parentWidth * scale);
        canvas.height = Math.floor(parentHeight * scale);
        
        const context = canvas.getContext('2d');
        if (context) {
          context.scale(scale, scale);
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.strokeStyle = color;
          context.lineWidth = brushSize;
          contextRef.current = context;
        }
      }
    }
    
    // We need a slight delay to ensure parentElement has correct dimensions
    const resizeTimeout = setTimeout(resizeCanvas, 10);
    
    window.addEventListener('resize', resizeCanvas);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', resizeCanvas);
    }
  }, []);
  
  useEffect(() => {
      if(contextRef.current){
          contextRef.current.strokeStyle = color;
      }
  }, [color]);

  useEffect(() => {
      if(contextRef.current){
          contextRef.current.lineWidth = brushSize;
      }
  }, [brushSize]);


  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const context = contextRef.current;
    if (!context) return;
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const context = contextRef.current;
    if (!context) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    const context = contextRef.current;
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (context && canvas) {
      // The canvas is scaled, so we need to use the scaled dimensions to clear
      context.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-headline">Drawing Tool</h2>
        <p className="text-muted-foreground">A simple canvas for your ideas.</p>
      </div>
      <Card className="flex-grow flex flex-col overflow-hidden">
        <CardHeader className="flex-row items-center justify-between flex-none">
          <div className="space-y-1.5">
            <CardTitle>Canvas</CardTitle>
            <CardDescription>Draw freely below. Use the controls to customize.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="color-picker" className="text-sm font-medium">Color</label>
              <Input
                id="color-picker"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-8 p-1 cursor-pointer"
              />
            </div>
             <div className="flex items-center gap-2">
                <label htmlFor="brush-size" className="text-sm font-medium">Size: {brushSize}</label>
                <Input
                    id="brush-size"
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-24"
                />
            </div>
            <Button variant="outline" size="icon" onClick={clearCanvas} title="Clear Canvas">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear Canvas</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0 relative bg-white rounded-b-lg border-t">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="absolute top-0 left-0"
          />
        </CardContent>
      </Card>
    </div>
  );
}
