export type TaskStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'paused'
  | 'expired';

export interface Task {
  id: string;
  name: string;
  project: string;
  duration: string; // display string e.g. "1h 30m"
  durationMinutes?: number;
  status: TaskStatus;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  startedAt?: string;
  remainingTime?: number; // remaining seconds when paused
  expectedEnd?: string;
}