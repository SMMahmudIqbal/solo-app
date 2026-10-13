// Developed by S. M. Mahmud Iqbal

export interface Task {
  id: string;
  title: string;
  createdAt: number;
  completedAt?: number;
  priorityScore: number; // Higher number = surfaced earlier
  estimatedMinutes?: number;
  source: 'MANUAL' | 'QUICK_CAPTURE' | 'VOICE_MOCK' | 'SYSTEM';
  abandoned?: boolean;
}

export type ViewMode = 'BILLBOARD' | 'QUEUE_DRAWER' | 'CAPTURE_MODAL' | 'HISTORY_LOG' | 'WIDGET_PREVIEW';

export type Theme = 'dark' | 'light';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'FINALIZE THE HARDWARE PROTOTYPE CASING SCHEMATICS',
    createdAt: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    priorityScore: 100,
    estimatedMinutes: 45,
    source: 'QUICK_CAPTURE',
  },
  {
    id: 'task-2',
    title: 'AUDIT BATTERY DISCHARGE RATE ON STANDBY MODE',
    createdAt: Date.now() - 1000 * 60 * 60 * 26, // 1 day ago
    priorityScore: 90,
    estimatedMinutes: 30,
    source: 'MANUAL',
  },
  {
    id: 'task-3',
    title: 'DEPLOY FIRMWARE BUILD V1.4 TO TEST BENCH UNITS',
    createdAt: Date.now() - 1000 * 60 * 60 * 50, // 2 days ago
    priorityScore: 80,
    estimatedMinutes: 20,
    source: 'SYSTEM',
  },
  {
    id: 'task-4',
    title: 'REVIEW THERMAL SENSOR TELEMETRY LOGS ACROSS BATCH B',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8, // 8 days ago (over 7 days -> untouched red signal)
    priorityScore: 70,
    estimatedMinutes: 60,
    source: 'MANUAL',
  },
  {
    id: 'task-5',
    title: 'CALIBRATE HAPTIC FEEDBACK FREQUENCY PROFILE FOR KEYPRESS',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    priorityScore: 60,
    estimatedMinutes: 15,
    source: 'QUICK_CAPTURE',
  }
];

export const COMPLETED_HISTORY: Task[] = [
  {
    id: 'task-c1',
    title: 'INITIALIZE DOT MATRIX GLYPH RENDER PIPELINE',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    completedAt: Date.now() - 1000 * 60 * 60 * 48,
    priorityScore: 110,
    estimatedMinutes: 40,
    source: 'SYSTEM',
  },
  {
    id: 'task-c2',
    title: 'STRIP ALL COLOR PALETTES TO STRICT MONOCHROME BASE',
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    completedAt: Date.now() - 1000 * 60 * 60 * 10,
    priorityScore: 105,
    estimatedMinutes: 25,
    source: 'MANUAL',
  }
];
