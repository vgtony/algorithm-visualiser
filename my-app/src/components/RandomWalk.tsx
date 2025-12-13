import { useEffect, useRef, useState } from 'react';
import type { Point } from '../types';
import './RandomWalk.css';

// Canvas dimensions and step size for each move
const WIDTH = 800;
const HEIGHT = 600;
const STEP = 5;

const RandomWalk = () => {
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Store all points in the walk path, starting at center
  const [path, setPath] = useState<Point[]>([{ x: WIDTH / 2, y: HEIGHT / 2 }]);
  
  // Control whether the animation is running
  const [isRunning, setIsRunning] = useState(false);

  // Animation effect - runs every 50ms when isRunning is true
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPath(prev => {
        // Get the current position (last point in path)
        const current = prev[prev.length - 1];
        
        // Pick a random direction: 0=up, 1=right, 2=down, 3=left
        const direction = Math.floor(Math.random() * 4);
        
        // Start with current position
        let x = current.x;
        let y = current.y;
        
        // Move based on random direction
        if (direction === 0) y -= STEP; // Move up
        if (direction === 1) x += STEP; // Move right
        if (direction === 2) y += STEP; // Move down
        if (direction === 3) x -= STEP; // Move left
        
        // Bounce back if hitting walls
        if (x < 0) x = -x; // Bounce off left wall
        if (x > WIDTH) x = WIDTH - (x - WIDTH); // Bounce off right wall
        if (y < 0) y = -y; // Bounce off top wall
        if (y > HEIGHT) y = HEIGHT - (y - HEIGHT); // Bounce off bottom wall
        
        // Ensure position stays within bounds after bounce
        x = Math.max(0, Math.min(WIDTH, x));
        y = Math.max(0, Math.min(HEIGHT, y));
        
        // Add new position to path
        return [...prev, { x, y }];
      });
    }, 50); // Update every 50 milliseconds

    // Cleanup: stop interval when component unmounts or isRunning changes
    return () => clearInterval(interval);
  }, [isRunning]);

  // Drawing effect - runs whenever path changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the entire canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Draw the path as a green line
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y); // Start at first point
    path.forEach(p => ctx.lineTo(p.x, p.y)); // Connect all points
    ctx.stroke();
    
    // Draw current position as a red dot
    const last = path[path.length - 1];
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [path]);

  // Reset to starting position and stop animation
  const reset = () => {
    setPath([{ x: WIDTH / 2, y: HEIGHT / 2 }]);
    setIsRunning(false);
  };

  return (
    <div className="random-walk-container">
      <h1>Random Walk</h1>
      <div className="controls">
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button className="reset-button" onClick={reset}>Reset</button>
      </div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="canvas"
      />
      <p className="stats">Steps: {path.length - 1}</p>
    </div>
  );
}

export default RandomWalk;
