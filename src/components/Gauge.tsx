import React, { useEffect, useState } from 'react';

interface GaugeProps {
  score: number; // 0 to 100
  isScam: boolean;
}

export const Gauge: React.FC<GaugeProps> = ({ score, isScam }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    setAnimatedScore(0);
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;
  const strokeColor = isScam ? '#ffb4ab' : '#68f5b8';
  const glowColor = isScam ? 'rgba(255, 180, 171, 0.3)' : 'rgba(104, 245, 184, 0.3)';

  return (
    <div className="relative w-52 h-52 flex items-center justify-center mx-auto">
      {/* Ambient background glow behind gauge */}
      <div 
        className="absolute inset-4 rounded-full blur-2xl transition-all duration-1000"
        style={{ backgroundColor: glowColor }}
      ></div>

      <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
        <circle 
          className="gauge-bg" 
          cx="50" 
          cy="50" 
          r={radius}
        ></circle>
        <circle 
          className="gauge-progress" 
          cx="50" 
          cy="50" 
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          stroke={strokeColor}
        ></circle>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-5xl font-['Montserrat'] font-extrabold tracking-tight transition-all duration-700 text-white">
          {animatedScore}%
        </span>
        <span className="text-[11px] font-['Geist'] font-semibold opacity-70 uppercase tracking-[0.2em] mt-1 text-[#bbc9cd]">
          Risk Score
        </span>
      </div>
    </div>
  );
};
