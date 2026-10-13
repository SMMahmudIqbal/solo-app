// Developed by S. M. Mahmud Iqbal
import React from 'react';

import { hardwareAudio } from '../utils/audio';

interface DotMatrixCheckboxProps {
  isCompleting: boolean;
  onTrigger: () => void;
  size?: number; // size in px, default 40
}

/**
 * A 4x4 or 5x5 dot-matrix square that fills cell-by-cell on completion.
 * The only playful moment in the app according to Nothing OS principles.
 */
export const DotMatrixCheckbox: React.FC<DotMatrixCheckboxProps> = ({
  isCompleting,
  onTrigger,
  size = 44,
}) => {
  // 4x4 grid = 16 dots
  // Order of dots filling up: spiral or snake pattern
  const totalDots = 16;
  const [filledDots, setFilledDots] = React.useState<number>(0);

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isCompleting) {
      let current = 0;
      timer = setInterval(() => {
        current += 1;
        setFilledDots(current);
        hardwareAudio.playDotTick(1 + current * 0.05);
        if (current >= totalDots) {
          clearInterval(timer);
        }
      }, 25); // fills in ~400ms
    } else {
      setFilledDots(0);
    }
    return () => clearInterval(timer);
  }, [isCompleting]);

  return (
    <button
      type="button"
      onClick={onTrigger}
      disabled={isCompleting}
      aria-label="Complete current task"
      className="group relative flex items-center justify-center p-2 rounded-none border border-neutral-700 hover:border-white transition-colors duration-150 cursor-pointer bg-black/40 focus:outline-none focus:ring-1 focus:ring-white"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 4x4 Dot Matrix */}
      <div className="grid grid-cols-4 gap-[3px] w-full h-full p-[2px]">
        {Array.from({ length: totalDots }).map((_, i) => {
          const isFilled = i < filledDots;
          return (
            <div
              key={i}
              className={`w-full h-full rounded-[1px] transition-all duration-75 ${
                isFilled
                  ? 'bg-white scale-105'
                  : 'bg-neutral-800 group-hover:bg-neutral-600'
              }`}
            />
          );
        })}
      </div>
    </button>
  );
};
