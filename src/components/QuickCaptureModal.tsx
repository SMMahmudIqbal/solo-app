// Developed by S. M. Mahmud Iqbal
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, estimatedMinutes?: number, makeTop?: boolean) => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [taskText, setTaskText] = useState('');
  const [estimate, setEstimate] = useState<number | ''>(25);
  const [makeTop, setMakeTop] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    onAdd(taskText.trim(), typeof estimate === 'number' ? estimate : undefined, makeTop);
    setTaskText('');
    setMakeTop(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-black border border-white p-6 relative select-none animate-slide-in"
        role="dialog"
        aria-labelledby="capture-title"
      >
        {/* Technical crosshairs at edges */}
        <span className="absolute -top-2.5 -left-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -top-2.5 -right-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -bottom-2.5 -left-2.5 font-mono-tech text-xs text-white">+</span>
        <span className="absolute -bottom-2.5 -right-2.5 font-mono-tech text-xs text-white">+</span>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-6">
          <div className="font-dot text-lg text-white tracking-widest uppercase">
            CAPTURE TASK
          </div>
          <div className="font-mono-tech text-[10px] text-neutral-500 tracking-wider">
            BUFFER // INPUT
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-mono-tech text-[11px] text-neutral-400 mb-2 uppercase">
              TASK DESCRIPTION
            </label>
            <input
              type="text"
              autoFocus
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="E.G. SHIP THE FIRMWARE UPDATE..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-white focus:outline-none p-3 font-body text-white text-base tracking-wide uppercase transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="w-full sm:w-auto">
              <label className="block font-mono-tech text-[11px] text-neutral-400 mb-1 uppercase">
                ESTIMATE (MIN)
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={estimate}
                onChange={(e) => setEstimate(e.target.value ? parseInt(e.target.value) : '')}
                className="w-24 bg-neutral-950 border border-neutral-800 focus:border-white focus:outline-none p-2 font-mono-tech text-white text-sm text-center"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-3 sm:pt-0">
              <input
                type="checkbox"
                checked={makeTop}
                onChange={(e) => setMakeTop(e.target.checked)}
                className="accent-white h-4 w-4 rounded-none bg-neutral-900 border border-neutral-700"
              />
              <span className="font-mono-tech text-xs text-neutral-300">
                SURFACE AS NEXT IMMEDIATELY
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-800 hover:border-neutral-500 font-mono-tech text-xs text-neutral-400 uppercase cursor-pointer"
            >
              CANCEL [ESC]
            </button>
            <button
              type="submit"
              disabled={!taskText.trim()}
              className="px-6 py-2 bg-white text-black font-mono-tech text-xs font-bold uppercase hover:bg-neutral-200 transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} />
              COMMIT TO QUEUE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
