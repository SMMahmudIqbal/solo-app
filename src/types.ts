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

export const INITIAL_TASKS: Task[] = [];

export const COMPLETED_HISTORY: Task[] = [];
