// components/LoadingAnimation.tsx
"use client";

import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading-animation.json';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Lottie 
        animationData={loadingAnimation} 
        loop={true} 
        style={{ width: 350, height: 350 }} 
      />
      <p className="text-white text-center italic mt-2 drop-shadow-md">Generating your list...</p>
    </div>
  );
}