import React from 'react';
import type { Task } from '../types';
import { ArrowUp, ArrowDown, X, Clock, AlertTriangle } from 'lucide-react';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onReorder: (taskId: string, direction: 'UP' | 'DOWN') => void;
  onAbandon: (taskId: string) => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  tasks,
  onReorder,
  onAbandon,
}) => {
  if (!isOpen) return null;

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="fixed inset-0 z-40 bg-black/85 flex justify-end">
      {/* Background click to close */}
      <div className="flex-1" onClick={onClose} />

      <div 
        className="w-full max-w-md bg-black border-l border-neutral-800 h-full flex flex-col p-6 overflow-hidden select-none animate-slide-in relative"
        role="region"
        aria-label="Task Queue Drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="font-dot text-lg tracking-wider text-white">TASK QUEUE</span>
            <span className="font-mono-tech text-xs text-neutral-400 px-2 py-0.5 border border-neutral-800">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Queue"
          >
            <X size={16} />
          </button>
        </div>

        {/* Informational Subtext */}
        <p className="font-mono-tech text-[10px] text-neutral-500 my-3 tracking-wider uppercase">
          INDEX 00 IS ACTIVE BILLBOARD · LOWER TASKS SLEEP IN CALM BUFFER
        </p>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
          {tasks.length === 0 ? (
            <div className="py-20 text-center font-mono-tech text-xs text-neutral-600">
              QUEUE BUFFER EMPTY. CAPTURE TASKS TO POPULATE.
            </div>
          ) : (
            tasks.map((task, index) => {
              const isUntouchedOver7Days = now - task.createdAt > sevenDaysMs;
              const isActive = index === 0;

              return (
                <div
                  key={task.id}
                  className={`p-3 border transition-colors ${
                    isActive
                      ? 'border-white bg-neutral-950'
                      : 'border-neutral-900 bg-black hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-tech text-[10px] text-neutral-500">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        {isActive && (
                          <span className="font-mono-tech text-[9px] bg-white text-black px-1 font-bold">
                            CURRENT
                          </span>
                        )}
                        {isUntouchedOver7Days && (
                          <span className="font-mono-tech text-[9px] text-[#D71921] border border-[#D71921]/40 px-1 flex items-center gap-1">
                            <AlertTriangle size={10} />
                            &gt;7D IDLE
                          </span>
                        )}
                      </div>
                      
                      <div className="font-body text-xs sm:text-sm uppercase text-neutral-200 line-clamp-2 tracking-wide font-medium">
                        {task.title}
                      </div>

                      {/* Technical metadata line */}
                      <div className="flex items-center gap-3 mt-2 font-mono-tech text-[10px] text-neutral-500">
                        {task.estimatedMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {task.estimatedMinutes}M
                          </span>
                        )}
                        <span>SRC: {task.source}</span>
                        <span>
                          {new Date(task.createdAt).toLocaleDateString(undefined, {
                            month: 'numeric',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Reorder and Abandon */}
                    <div className="flex flex-col gap-1 items-end">
                      <div className="flex gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => onReorder(task.id, 'UP')}
                          className="p-1 border border-neutral-800 hover:border-white disabled:opacity-20 text-neutral-400 hover:text-white cursor-pointer"
                          aria-label="Move task up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          disabled={index === tasks.length - 1}
                          onClick={() => onReorder(task.id, 'DOWN')}
                          className="p-1 border border-neutral-800 hover:border-white disabled:opacity-20 text-neutral-400 hover:text-white cursor-pointer"
                          aria-label="Move task down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      {/* Abandon Task button - red signal */}
                      <button
                        onClick={() => onAbandon(task.id)}
                        className="mt-2 text-[10px] font-mono-tech text-neutral-500 hover:text-[#D71921] transition-colors cursor-pointer"
                        title="Abandon Task"
                      >
                        [ABANDON]
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer controls */}
        <div className="pt-4 border-t border-neutral-800 flex justify-between items-center font-mono-tech text-[10px] text-neutral-500">
          <span>PRIORITY ENGINE ACTIVE</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-neutral-800 hover:border-white text-white cursor-pointer"
          >
            DISMISS [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
