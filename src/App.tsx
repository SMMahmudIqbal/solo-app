import { useState, useEffect } from 'react';
import type { Task, Theme } from './types';
import { INITIAL_TASKS, COMPLETED_HISTORY } from './types';
import { DotMatrixCheckbox } from './components/DotMatrixCheckbox';
import { DotMatrixStamp } from './components/DotMatrixStamp';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { QueueDrawer } from './components/QueueDrawer';
import { HistoryModal } from './components/HistoryModal';
import { WidgetPreviewModal } from './components/WidgetPreviewModal';
import { Plus, LayoutGrid, History, Sun, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hardwareAudio } from './utils/audio';

export function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('solo_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_TASKS;
  });

  const [history, setHistory] = useState<Task[]>(() => {
    const saved = localStorage.getItem('solo_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return COMPLETED_HISTORY;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('solo_theme') as Theme) || 'dark';
  });

  // Modal / Drawer states
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isWidgetPreviewOpen, setIsWidgetPreviewOpen] = useState(false);

  // Completion animation states
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebrationStamp, setShowCelebrationStamp] = useState(false);
  const [slideAnimationKey, setSlideAnimationKey] = useState(0);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('solo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('solo_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('solo_theme', theme);
  }, [theme]);

  // Current active task is the top of the queue
  const currentTask = tasks.length > 0 ? tasks[0] : null;
  const remainingCount = tasks.length > 0 ? tasks.length - 1 : 0;

  // Global hotkeys (N for quick capture, Q for queue, Space/Enter for complete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'c' || e.key === 'C' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsCaptureOpen(true);
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setIsQueueOpen(prev => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsHistoryOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsCaptureOpen(false);
        setIsQueueOpen(false);
        setIsHistoryOpen(false);
        setIsWidgetPreviewOpen(false);
        setShowCelebrationStamp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Completion trigger flow
  const handleTriggerComplete = () => {
    if (!currentTask || isCompleting) return;

    setIsCompleting(true);

    // After 400ms matrix square fills up
    setTimeout(() => {
      // Trigger subtle monochrome particle confetti
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#888888', '#000000', '#d71921'],
        shapes: ['square'],
        scalar: 0.8,
      });

      // Play satisfying mechanical stamp impact sound & haptics
      hardwareAudio.playStampImpact();

      // Show stamp celebration
      setShowCelebrationStamp(true);
      setIsCompleting(false);

      // Slide task to completed history
      const finished: Task = {
        ...currentTask,
        completedAt: Date.now(),
      };

      setTasks(prev => prev.slice(1));
      setHistory(prev => [finished, ...prev]);
      setSlideAnimationKey(prev => prev + 1);
    }, 450);
  };

  // Quick Task Capture
  const handleAddTask = (title: string, estimatedMinutes?: number, makeTop?: boolean) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.toUpperCase(),
      createdAt: Date.now(),
      priorityScore: makeTop ? 999 : 50,
      estimatedMinutes,
      source: 'QUICK_CAPTURE',
    };

    if (makeTop) {
      setTasks(prev => [newTask, ...prev]);
      setSlideAnimationKey(prev => prev + 1);
    } else {
      setTasks(prev => [...prev, newTask]);
    }
  };

  // Reordering in Queue
  const handleReorder = (taskId: string, direction: 'UP' | 'DOWN') => {
    setTasks(prev => {
      const index = prev.findIndex(t => t.id === taskId);
      if (index === -1) return prev;
      const targetIndex = direction === 'UP' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
    setSlideAnimationKey(prev => prev + 1);
  };

  // Abandon Task - Rare Signal Red Action
  const handleAbandon = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSlideAnimationKey(prev => prev + 1);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Check if current task has aged over 7 days
  const isCurrentUntouchedOver7Days = currentTask
    ? Date.now() - currentTask.createdAt > 7 * 24 * 60 * 60 * 1000
    : false;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between p-4 sm:p-8 md:p-12 bg-black text-white selection:bg-white selection:text-black">
      {/* Background dot matrix grid */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-40" />

      {/* TOP STATUS BAR: Hardware aesthetic annotations */}
      <header className="relative z-10 flex items-center justify-between border-b border-neutral-900 pb-4">
        {/* Left: Brand & REC dot */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt="SOLO Logo" 
            className="w-7 h-7 border border-neutral-700 object-cover shrink-0" 
          />
          <span className="font-dot text-xl sm:text-2xl text-white tracking-widest">
            SOLO
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 border border-neutral-800 font-mono-tech text-[10px] text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-[#D71921] inline-block animate-pulse-red" />
            <span>FOCUS MODE</span>
          </div>
        </div>

        {/* Right: Technical meta & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono-tech text-[10px] text-neutral-500">
            <span>SYS // V1.0</span>
            <span>·</span>
            <span>SYS_TIME {new Date().toISOString().slice(11, 16)}</span>
          </div>

          {/* Action buttons */}
          <button
            onClick={() => setIsWidgetPreviewOpen(true)}
            className="p-2 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="View Homescreen Widget Emulation"
            aria-label="View Nothing OS Widget"
          >
            <LayoutGrid size={15} />
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="View History Log [H]"
            aria-label="View Completed History"
          >
            <History size={15} />
          </button>

          {/* Download APK direct link */}
          <a
            href="/SOLO-v1.0.apk"
            download="SOLO-v1.0.apk"
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-800 hover:border-white font-mono-tech text-[10px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Download Android APK (SOLO-v1.0.apk)"
          >
            <span>APK · 4.1MB</span>
          </a>

          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="p-2 border border-neutral-800 hover:border-white text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle theme (Dark / Off-white)"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Quick Capture Button */}
          <button
            onClick={() => setIsCaptureOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-mono-tech text-xs font-bold uppercase hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>CAPTURE [N]</span>
          </button>
        </div>
      </header>

      {/* CENTER: THE BILLBOARD — SHOWS EXACTLY ONE THING */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-12 md:py-20 text-center max-w-5xl mx-auto w-full">
        {currentTask ? (
          <div 
            key={slideAnimationKey} 
            className="w-full flex flex-col items-center animate-slide-in select-text"
          >
            {/* Top Annotation of the Billboard */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono-tech text-[10px] sm:text-xs text-neutral-500 mb-6 sm:mb-10 tracking-widest uppercase">
              <span className="px-2 py-0.5 border border-neutral-900">
                ACTIVE FOCUS · 01 OF {tasks.length}
              </span>
              {currentTask.estimatedMinutes && (
                <span className="px-2 py-0.5 border border-neutral-900">
                  EST: {currentTask.estimatedMinutes} MIN
                </span>
              )}
              {isCurrentUntouchedOver7Days && (
                <span className="px-2 py-0.5 border border-[#D71921]/40 text-[#D71921] font-bold">
                  UNTOUCHED &gt;7 DAYS
                </span>
              )}
            </div>

            {/* Giant Dot-Matrix Task Title Billboard */}
            <h1 className="font-dot text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-[0.14em] leading-[1.15] max-w-4xl mx-auto px-4 uppercase font-normal break-words">
              {currentTask.title}
            </h1>

            {/* Interactive Dot Matrix Checkbox & Technical Action */}
            <div className="mt-12 sm:mt-16 flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <DotMatrixCheckbox
                  isCompleting={isCompleting}
                  onTrigger={handleTriggerComplete}
                  size={48}
                />
                <button
                  onClick={handleTriggerComplete}
                  disabled={isCompleting}
                  className="px-6 py-3 border border-neutral-700 hover:border-white font-mono-tech text-xs tracking-widest text-neutral-300 hover:text-white uppercase transition-colors cursor-pointer"
                >
                  {isCompleting ? 'EXECUTING...' : 'MARK COMPLETE'}
                </button>
              </div>
              <p className="font-mono-tech text-[10px] text-neutral-500 tracking-wider uppercase">
                TAP CHECKBOX TO COMMIT COMPLETION STAMP
              </p>
            </div>
          </div>
        ) : (
          /* Empty State: Calm dot-matrix glyph */
          <div className="flex flex-col items-center justify-center max-w-md mx-auto animate-fadeIn">
            <div className="relative mb-6">
              <img 
                src="/logo.jpg" 
                alt="SOLO Logo" 
                className="w-20 h-20 border border-neutral-700 object-cover shadow-2xl" 
              />
              <span className="absolute -top-1.5 -left-1.5 font-mono-tech text-[10px] text-white">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono-tech text-[10px] text-white">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono-tech text-[10px] text-white">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono-tech text-[10px] text-white">+</span>
            </div>
            <div className="font-dot text-2xl text-white tracking-widest mb-2 uppercase">
              BUFFER EMPTY
            </div>
            <p className="font-mono-tech text-xs text-neutral-500 tracking-wider mb-8 uppercase text-center max-w-xs">
              NO TASKS IN QUEUE. TAP BELOW OR PRESS [N] TO CAPTURE YOUR NEXT FOCUS ITEM.
            </p>
            <button
              onClick={() => setIsCaptureOpen(true)}
              className="px-6 py-2.5 bg-white text-black font-mono-tech text-xs font-bold uppercase hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus size={14} />
              CAPTURE FIRST TASK
            </button>
          </div>
        )}
      </main>

      {/* BOTTOM FOOTER: ONE TAP QUEUE PEEK & SUBTLE ATTRIBUTION */}
      <footer className="relative z-10 flex flex-col items-center gap-4 pt-6 border-t border-neutral-900">
        {/* Single muted monospace line at bottom for the queue */}
        <button
          onClick={() => setIsQueueOpen(true)}
          className="group flex items-center gap-2 font-mono-tech text-xs sm:text-sm text-neutral-500 hover:text-white transition-colors cursor-pointer px-4 py-2 border border-transparent hover:border-neutral-800"
        >
          <span className="tracking-widest">QUEUE</span>
          <span>·</span>
          <span className="text-white group-hover:text-white font-bold">
            {remainingCount} NEXT
          </span>
          <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400">
            [PEEK]
          </span>
        </button>

        {/* Developer Attribution - Discrete bottom scroll area */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono-tech text-neutral-700 tracking-widest pt-2">
          <span>HARDWARE SPEC // NOTHING OS UI ENGINE</span>
          <span className="mt-1 sm:mt-0">Developed by S. M. Mahmud Iqbal</span>
        </div>
      </footer>

      {/* DRAWERS & MODALS */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        tasks={tasks}
        onReorder={handleReorder}
        onAbandon={handleAbandon}
      />

      <QuickCaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onAdd={handleAddTask}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        completedTasks={history}
        onClearHistory={handleClearHistory}
      />

      <WidgetPreviewModal
        isOpen={isWidgetPreviewOpen}
        onClose={() => setIsWidgetPreviewOpen(false)}
        currentTask={currentTask}
        totalInQueue={tasks.length}
        onCompleteCurrent={handleTriggerComplete}
      />

      {/* FULL-SCREEN DOT-MATRIX CELEBRATION STAMP */}
      {showCelebrationStamp && (
        <DotMatrixStamp onDismiss={() => setShowCelebrationStamp(false)} />
      )}
    </div>
  );
}

export default App;
