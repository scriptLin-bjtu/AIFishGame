import React, { useState, useEffect, useRef } from 'react';
import { Rod, FishSpecies } from '../types';

interface MinigameProps {
  rod: Rod;
  targetFish: FishSpecies;
  onSuccess: () => void;
  onFail: () => void;
}

const Minigame: React.FC<MinigameProps> = ({ rod, targetFish, onSuccess, onFail }) => {
  const [barPos, setBarPos] = useState(50); // 0 to 100 (bottom to top)
  const [fishPos, setFishPos] = useState(50);
  const [progress, setProgress] = useState(30); // Start with some progress
  const [isHolding, setIsHolding] = useState(false);
  
  // Game loop refs to avoid dependency staleness
  const gameStateRef = useRef({
    barPos: 50,
    fishPos: 50,
    progress: 30,
    velocity: 0,
    fishVelocity: 0,
    fishTarget: 50,
    time: 0
  });

  const requestRef = useRef<number>(0);

  // Determine bar size based on rod power vs fish difficulty
  // Higher difficulty = smaller bar. Higher rod power = bigger bar.
  // Base size increased to 25% (was 20%) and min size to 15% (was 10%) for easier difficulty
  const barSize = Math.max(15, 25 + (rod.power / 5) - (targetFish.difficulty / 5));

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        if (!e.repeat) {
          setIsHolding(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsHolding(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const state = gameStateRef.current;
      state.time += 0.016;

      // 1. User Physics (Bar)
      // Gravity pulls down, holding pulls up
      if (isHolding) {
        state.velocity += 0.5;
      } else {
        state.velocity -= 0.5;
      }
      
      // Dampening/Friction
      state.velocity *= 0.9;
      
      // Update Bar Position
      state.barPos += state.velocity;
      
      // Bounce off walls
      if (state.barPos < 0) {
        state.barPos = 0;
        state.velocity = 0; // Stop bounce logic for easier control, just stick
      } else if (state.barPos > 100 - barSize) {
        state.barPos = 100 - barSize;
        state.velocity = 0;
      }

      // 2. Fish AI
      // Random movement patterns based on Perlin-ish noise or simple targets
      // Reduced frequency of changes (0.05 -> 0.03)
      if (Math.random() < 0.03) { 
        state.fishTarget = Math.random() * (100 - 10); // keep fish mostly visible
      }
      
      // Move fish towards target smoothly
      // Reduced speed multiplier (1.5 -> 0.8) and jitter (1.0 -> 0.3)
      const speed = (targetFish.difficulty / 100) * 0.8; 
      const jitter = Math.random() * 0.3;

      if (state.fishPos < state.fishTarget) {
        state.fishPos += speed + jitter;
      } else {
        state.fishPos -= speed + jitter;
      }
      
      // Clamp Fish
      if (state.fishPos < 0) state.fishPos = 0;
      if (state.fishPos > 92) state.fishPos = 92; // fish icon size approx 8%

      // 3. Progress Logic
      // Check collision
      const fishCenter = state.fishPos + 4; // Approx center
      const barTop = state.barPos + barSize;
      const barBottom = state.barPos;

      const isInside = fishCenter >= barBottom && fishCenter <= barTop;

      if (isInside) {
        state.progress += 0.5; // Catch speed increased (was 0.4)
      } else {
        state.progress -= 0.2; // Lose speed decreased (was 0.3)
      }

      // Sync React State for rendering
      setBarPos(state.barPos);
      setFishPos(state.fishPos);
      setProgress(state.progress);

      // Win/Loss Condition
      if (state.progress >= 100) {
        onSuccess();
        return; 
      } else if (state.progress <= 0) {
        onFail();
        return;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isHolding, barSize, targetFish.difficulty, onSuccess, onFail, rod.power]);

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onTouchStart={(e) => { e.preventDefault(); setIsHolding(true); }}
      onTouchEnd={(e) => { e.preventDefault(); setIsHolding(false); }}
    >
      <div className="relative w-16 h-80 bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden shadow-2xl">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-indigo-900 opacity-50"></div>

        {/* The Capture Bar (Green Zone) */}
        <div 
          className="absolute left-0 right-0 bg-green-400/60 border-y-2 border-green-300 transition-all duration-75 ease-linear box-border"
          style={{ 
            bottom: `${barPos}%`, 
            height: `${barSize}%` 
          }}
        ></div>

        {/* The Fish */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 text-2xl transition-all duration-75 ease-linear"
          style={{ bottom: `${fishPos}%` }}
        >
          {targetFish.icon}
        </div>

        {/* Progress Bar Side Indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-700">
          <div 
            className={`absolute bottom-0 left-0 right-0 transition-all duration-100 ${progress > 80 ? 'bg-green-500' : progress > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ height: `${progress}%` }}
          />
        </div>
      </div>

      <div className="absolute bottom-20 text-white font-bold text-lg animate-pulse pointer-events-none text-center w-full">
        {isHolding ? '松开空格!' : '按住空格!'}
        <div className="text-xs text-gray-400 font-normal mt-1">(鼠标/触摸也可以)</div>
      </div>
      
      <div className="absolute top-20 text-center pointer-events-none">
         <h2 className="text-white font-bold text-xl drop-shadow-md">正在收杆!</h2>
         <p className="text-sm text-gray-300">保持鱼在绿条内</p>
      </div>
    </div>
  );
};

export default Minigame;