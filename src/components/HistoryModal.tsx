import React from 'react';
import type { Task } from '../types';
import { X, CheckCircle2, Clock } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasks: Task[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  completedTasks,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-black border border-white p-6 relative select-none animate-slide-in flex flex-col max-h-[85vh]"
        role="dialog"
        aria-labelledby="history-title"
      >
        {/* Crosshair corners */}
        <span className="absolute -top-2.5 -left-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -top-2.5 -right-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -bottom-2.5 -left-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -bottom-2.5 -right-2.5 font-mono-tech text-xs text-white">+</span>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-dot text-lg text-white tracking-widest">EXECUTED LOG</span>
            <span className="font-mono-tech text-[10px] text-neutral-400 px-2 py-0.5 border border-neutral-800">
              {completedTasks.length} DONE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* List of completed tasks */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
          {completedTasks.length === 0 ? (
            <div className="py-16 text-center font-mono-tech text-xs text-neutral-600">
              NO COMPLETED RECORDS IN CURRENT BUFFER.
            </div>
          ) : (
            completedTasks.map((t, idx) => (
              <div
                key={t.id}
                className="p-3 border border-neutral-900 bg-neutral-950/60 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-body text-xs sm:text-sm text-neutral-300 uppercase font-medium line-through decoration-neutral-600">
                      {t.title}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 font-mono-tech text-[10px] text-neutral-500">
                      <span>COMPLETED: {t.completedAt ? new Date(t.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'LOGGED'}</span>
                      {t.estimatedMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {t.estimatedMinutes}M
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-mono-tech text-[10px] text-neutral-600">
                  #{String(completedTasks.length - idx).padStart(2, '0')}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex justify-between items-center font-mono-tech text-[10px]">
          <button
            onClick={onClearHistory}
            disabled={completedTasks.length === 0}
            className="text-neutral-500 hover:text-[#D71921] transition-colors disabled:opacity-20 cursor-pointer"
          >
            [PURGE ARCHIVE]
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-neutral-800 hover:border-white text-white cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
