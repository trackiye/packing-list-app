"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface GenerationAnimationProps {
  onComplete?: boolean;
}

export default function GenerationAnimation({ onComplete }: GenerationAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Analyzing your trip...");

  const stages = [
    { percent: 20, text: "Analyzing your trip..." },
    { percent: 40, text: "Checking weather conditions..." },
    { percent: 60, text: "Considering accommodation..." },
    { percent: 80, text: "Adding activity-specific gear..." },
    { percent: 95, text: "Finalizing your list..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // If data arrived (onComplete = true), jump to 100%
        if (onComplete && prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        
        // Normal progression - slow down as we approach 95%
        if (prev >= 95) {
          clearInterval(interval);
          return 95; // Stay at 95% until data arrives
        }
        
        // Speed based on current progress (slower as we get higher)
        let increment = 5;
        if (prev >= 80) increment = 2;
        if (prev >= 90) increment = 1;
        
        const newProgress = Math.min(prev + increment, 95);
        
        const currentStage = stages.find(s => newProgress >= s.percent && newProgress < s.percent + 20);
        if (currentStage) setStage(currentStage.text);
        
        return newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2">
          Creating Your Perfect List
        </h3>
        
        <p className="text-white/70 text-center mb-6">{stage}</p>

        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full transition-all duration-300 bg-[length:200%_100%] animate-gradient"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-white/50 text-center text-sm">{progress}% complete</p>
      </div>
    </div>
  );
}
