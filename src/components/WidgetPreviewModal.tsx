import React from 'react';
import type { Task } from '../types';
import { X, Check } from 'lucide-react';

interface WidgetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTask: Task | null;
  totalInQueue: number;
  onCompleteCurrent: () => void;
}

export const WidgetPreviewModal: React.FC<WidgetPreviewModalProps> = ({
  isOpen,
  onClose,
  currentTask,
  totalInQueue,
  onCompleteCurrent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-black border border-white p-6 relative select-none animate-slide-in flex flex-col"
        role="dialog"
        aria-labelledby="widget-preview-title"
      >
        <span className="absolute -top-2.5 -left-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -top-2.5 -right-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -bottom-2.5 -left-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -bottom-2.5 -right-2.5 font-mono-tech text-xs text-white">+</span>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-dot text-base text-white tracking-widest">NOTHING OS WIDGET</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <p className="font-mono-tech text-[10px] text-neutral-400 mb-4 uppercase tracking-wider">
          HOMESCREEN 2x2 COMPACT GLYPH WIDGET EMULATION
        </p>

        {/* The 2x2 Nothing OS Widget Representation */}
        <div className="mx-auto w-full aspect-square max-w-[280px] bg-neutral-950 border border-neutral-800 p-5 rounded-none flex flex-col justify-between relative shadow-2xl">
          {/* Top widget bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D71921] inline-block animate-pulse-red" />
              <span className="font-dot text-xs text-white tracking-widest">SOLO</span>
            </div>
            <span className="font-mono-tech text-[10px] text-neutral-500">
              Q · {totalInQueue}
            </span>
          </div>

          {/* Center: The Single Billboard Task */}
          <div className="my-auto py-2">
            <span className="font-mono-tech text-[9px] text-neutral-500 block mb-1">
              CURRENT FOCUS
            </span>
            <div className="font-dot text-base sm:text-lg text-white leading-tight uppercase line-clamp-4">
              {currentTask ? currentTask.title : 'ALL TASKS CLEARED'}
            </div>
          </div>

          {/* Bottom of widget */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
            <div className="font-mono-tech text-[9px] text-neutral-500">
              {currentTask?.estimatedMinutes ? `${currentTask.estimatedMinutes}M EST` : 'ACTIVE'}
            </div>
            {currentTask && (
              <button
                onClick={onCompleteCurrent}
                className="p-1.5 border border-white bg-white text-black hover:bg-neutral-200 transition-colors font-mono-tech text-[9px] flex items-center gap-1 cursor-pointer font-bold"
              >
                <Check size={11} strokeWidth={3} />
                DONE
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="font-mono-tech text-[10px] text-neutral-500 uppercase">
            A real Nothing OS lockscreen / home widget displays just this single active focus item.
          </p>
        </div>
      </div>
    </div>
  );
};
