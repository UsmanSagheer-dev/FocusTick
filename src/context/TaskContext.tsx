import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { Task, TaskStatus } from '../types';

interface TaskContextValue {
  tasks: Task[];
  activeTask: Task | null;

  addTask: (task: Task) => void;
  startTask: (task: Task) => void;
  focusTask: (id: string) => void;
  completeTask: (id: string, elapsedSeconds?: number) => void;
  pauseActiveTask: () => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const activeTask = useMemo(
    () => tasks.find(t => t.status === 'running') ?? null,
    [tasks],
  );

  // Add a brand new task (e.g. "Save Task" from CreateTask)
  const addTask = useCallback((task: Task) => {
    setTasks(prev => [task, ...prev]);
  }, []);

  // Add a task AND immediately make it the running one
  // (e.g. "Start Timer" from CreateTask)
  const startTask = useCallback((task: Task) => {
    const now = new Date().toISOString();

    setTasks(prev => {
      const pausedRest = prev.map(t =>
        t.status === 'running' ? { ...t, status: 'paused' as TaskStatus } : t,
      );

      const exists = pausedRest.some(t => t.id === task.id);

      if (exists) {
        return pausedRest.map(t =>
          t.id === task.id
            ? { ...t, ...task, status: 'running' as TaskStatus, startedAt: now }
            : t,
        );
      }

      return [
        { ...task, status: 'running' as TaskStatus, startedAt: now },
        ...pausedRest,
      ];
    });
  }, []);

  // Resume/Start focus on an existing task (from TaskDetails / Home)
  // When resuming a paused task, calculate new startedAt based on remaining time
  const focusTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          // If task was paused, adjust startedAt based on remaining time
          if (t.status === 'paused' && t.remainingTime !== undefined && t.durationMinutes) {
            const totalSeconds = t.durationMinutes * 60;
            const elapsedSeconds = totalSeconds - t.remainingTime;
            const now = Date.now();
            // Set startedAt so that elapsed time is correct
            const adjustedStartedAt = new Date(now - elapsedSeconds * 1000).toISOString();

            return {
              ...t,
              status: 'running' as TaskStatus,
              startedAt: adjustedStartedAt,
              remainingTime: undefined,
            };
          }
          return {
            ...t,
            status: 'running' as TaskStatus,
            startedAt: t.startedAt ?? new Date().toISOString(),
            remainingTime: undefined,
          };
        }
        if (t.status === 'running') {
          // Pause currently running task
          if (t.startedAt && t.durationMinutes) {
            const startTime = new Date(t.startedAt).getTime();
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const totalSeconds = t.durationMinutes * 60;
            const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

            return { ...t, status: 'paused' as TaskStatus, remainingTime: remainingSeconds };
          }
          return { ...t, status: 'paused' as TaskStatus };
        }
        return t;
      }),
    );
  }, []);

  const completeTask = useCallback((id: string, elapsedSeconds?: number) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updates: Partial<Task> = { status: 'completed' as TaskStatus };
          // If elapsed time is provided, update durationMinutes to reflect actual time spent
          if (elapsedSeconds !== undefined) {
            updates.durationMinutes = Math.ceil(elapsedSeconds / 60);
          }
          return { ...t, ...updates };
        }
        return t;
      }),
    );
  }, []);

  const pauseActiveTask = useCallback(() => {
    setTasks(prev =>
      prev.map(t => {
        if (t.status === 'running' && t.startedAt && t.durationMinutes) {
          const startTime = new Date(t.startedAt).getTime();
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - startTime) / 1000);
          const totalSeconds = t.durationMinutes * 60;
          const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

          return { ...t, status: 'paused' as TaskStatus, remainingTime: remainingSeconds };
        }
        return t.status === 'running' ? { ...t, status: 'paused' as TaskStatus } : t;
      }),
    );
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      activeTask,
      addTask,
      startTask,
      focusTask,
      completeTask,
      pauseActiveTask,
      updateTaskStatus,
      removeTask,
    }),
    [
      tasks,
      activeTask,
      addTask,
      startTask,
      focusTask,
      completeTask,
      pauseActiveTask,
      updateTaskStatus,
      removeTask,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextValue => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return ctx;
};