'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Sparkles, Cloud, MapPin, Calendar } from 'lucide-react';

interface GenerationAnimationProps {
  onComplete: boolean;
  tripDetails?: {
    destination?: string;
    duration?: number;
    accommodation?: string;
    season?: string;
  };
  streamingContent?: string;
}

interface AnalysisStep {
  id: string;
  icon: any;
  text: string;
  duration: number;
}

export default function GenerationAnimation({ onComplete, tripDetails, streamingContent = '' }: GenerationAnimationProps) {
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showAnalysis, setShowAnalysis] = useState(true);

  // Generate personalized analysis steps
  useEffect(() => {
    const steps: AnalysisStep[] = [
      {
        id: 'weather',
        icon: Cloud,
        text: tripDetails?.destination 
          ? `Analyzing ${tripDetails.destination}'s ${tripDetails.season || 'current'} weather...`
          : 'Analyzing destination weather patterns...',
        duration: 500,
      },
      {
        id: 'accommodation',
        icon: MapPin,
        text: tripDetails?.accommodation
          ? `Checking ${tripDetails.accommodation} amenities...`
          : 'Checking accommodation details...',
        duration: 500,
      },
      {
        id: 'duration',
        icon: Calendar,
        text: tripDetails?.duration
          ? `Planning for ${tripDetails.duration}-day trip...`
          : 'Optimizing for trip duration...',
        duration: 500,
      },
      {
        id: 'consulting',
        icon: Sparkles,
        text: 'Starting packing list generation...',
        duration: 500,
      },
    ];

    setAnalysisSteps(steps);
  }, [tripDetails]);

  // Animate through analysis steps FAST
  useEffect(() => {
    if (analysisSteps.length === 0) return;

    let currentDelay = 0;
    analysisSteps.forEach((step) => {
      setTimeout(() => {
        setCompletedSteps((prev) => new Set([...prev, step.id]));
      }, currentDelay);
      currentDelay += step.duration;
    });

    // Hide analysis section after all steps complete
    setTimeout(() => {
      setShowAnalysis(false);
    }, currentDelay + 500);
  }, [analysisSteps]);

  // Parse streaming content into categories
  const parseStreamingContent = (content: string) => {
    if (!content) return [];
    
    const lines = content.split('\n');
    const items: Array<{ text: string; isCategory: boolean }> = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      if (trimmed.startsWith('##')) {
        items.push({ text: trimmed.replace('##', '').trim(), isCategory: true });
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        items.push({ text: trimmed.replace(/^[-•]\s*/, ''), isCategory: false });
      }
    });
    
    return items;
  };

  const parsedItems = parseStreamingContent(streamingContent);
  const hasStreamingContent = parsedItems.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative glass-strong rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl border-2 border-white/20">
        
        {/* Show analysis steps only at the beginning */}
        {showAnalysis && (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-white text-center mb-2">
              ✨ Packing Your Adventure...
            </h3>

            <p className="text-white/70 text-center mb-6">
              Analyzing your trip details with AI
            </p>

            <div className="space-y-3 mb-6">
              {analysisSteps.map((step) => {
                const Icon = step.icon;
                const isComplete = completedSteps.has(step.id);
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      isComplete
                        ? 'bg-green-500/20 border border-green-500/50'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-cyan-400 flex-shrink-0 animate-spin" />
                    )}
                    
                    <span className={`text-sm transition-colors duration-300 ${
                      isComplete ? 'text-green-300' : 'text-white/80'
                    }`}>
                      {step.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Show streaming content as it arrives */}
        {hasStreamingContent && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <h3 className="text-2xl font-bold text-white">
                Generating Your List...
              </h3>
            </div>

            <div className="space-y-3 bg-white/5 rounded-xl p-6 border border-white/10">
              {parsedItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    item.isCategory ? 'text-xl font-bold text-cyan-400 mt-4 first:mt-0' : 'text-white/90 ml-4'
                  }`}
                >
                  {item.isCategory ? (
                    <span>📦 {item.text}</span>
                  ) : (
                    <span>✓ {item.text}</span>
                  )}
                </div>
              ))}
              
              {/* Blinking cursor */}
              <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-4" />
            </div>
          </>
        )}

        <p className="text-white/40 text-xs text-center mt-4">
          Powered by AI • Streaming live results
        </p>
      </div>
    </div>
  );
}
