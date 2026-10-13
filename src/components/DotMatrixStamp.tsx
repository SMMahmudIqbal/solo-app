// Developed by S. M. Mahmud Iqbal
import React from 'react';

interface StampProps {
  onDismiss: () => void;
}

export const DotMatrixStamp: React.FC<StampProps> = ({ onDismiss }) => {
  return (
    <div 
      onClick={onDismiss}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 cursor-pointer select-none animate-fadeIn"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Decorative technical stamp border */}
      <div className="relative border-2 border-white px-8 py-10 md:px-16 md:py-14 text-center max-w-lg w-full flex flex-col items-center">
        {/* Corner crosshairs */}
        <span className="absolute -top-3 -left-3 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -top-3 -right-3 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -bottom-3 -left-3 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -bottom-3 -right-3 font-mono-tech text-xs text-white">+</span>

        {/* Technical annotation */}
        <div className="flex items-center justify-between w-full font-mono-tech text-[10px] text-neutral-400 mb-6 tracking-widest border-b border-neutral-800 pb-2">
          <span>EVENT // 01</span>
          <span>STATUS: EXECUTED</span>
          <span>{new Date().toISOString().slice(11, 19)} UTC</span>
        </div>

        {/* Big Dot Matrix "DONE" or "SOLO COMPLETE" */}
        <div className="font-dot text-4xl sm:text-6xl md:text-7xl text-white tracking-[0.2em] mb-4 text-center leading-none">
          DONE.
        </div>

        {/* Small subtitle */}
        <p className="font-mono-tech text-xs text-neutral-400 uppercase tracking-widest mt-2">
          NEXT TASK READY · TAP ANYWHERE TO SLIDE
        </p>

        {/* Dot pattern bar */}
        <div className="mt-8 flex gap-1.5 opacity-60">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white" />
          ))}
        </div>
      </div>
    </div>
  );
};
