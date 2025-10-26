// components/LoadingAnimation.tsx
"use client";

import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading-animation.json'; // Import your animation

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Lottie 
        animationData={loadingAnimation} 
        loop={true} 
        // --- SIZE IS FIXED HERE ---
        style={{ width: 350, height: 350 }} 
      />
      <p className="text-gray-500 text-center italic mt-2">Generating your list...</p>
    </div>
  );
}