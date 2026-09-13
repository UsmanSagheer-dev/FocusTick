import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
  showCheckbox?: boolean;
  showDate?: boolean;
  useTouchableOpacity?: boolean;
}

const statusLabels: Record<Task['status'], string> = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  paused: 'Paused',
  expired: 'Expired',
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const TaskCard = ({
  task,
  onPress,
  showCheckbox = false,
  showDate = false,
  useTouchableOpacity = false,
}: TaskCardProps) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const completed = task.status === 'completed';

  // Update time every second for running tasks
  useEffect(() => {
    if (task.status === 'running') {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task.status]);

  // Calculate elapsed time for running tasks
  const getTaskDuration = (task: Task) => {
    if (task.status === 'running' && task.startedAt && task.durationMinutes) {
      const startTime = new Date(task.startedAt).getTime();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const elapsedMinutes = Math.ceil(elapsedSeconds / 60);
      return formatDuration(elapsedMinutes);
    }
    if (task.durationMinutes) {
      return formatDuration(task.durationMinutes);
    }
    return task.duration;
  };

  const statusBadgeStyle = getStatusBadgeStyle(task.status);
  const statusTextStyle = getStatusTextStyle(task.status);

  const CardComponent = useTouchableOpacity ? TouchableOpacity : Pressable;

  return (
    <CardComponent
      onPress={() => onPress(task)}
      activeOpacity={0.8}
      style={styles.taskCard}
    >
      <View style={styles.taskRow}>
        {/* LEFT */}
        <View style={styles.taskLeft}>
          {/* Checkbox (optional) */}
          {showCheckbox && (
            <View
              style={[
                styles.checkbox,
                completed && styles.checkboxCompleted,
              ]}
            >
              {completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
          )}

          <View style={styles.taskInfo}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, statusBadgeStyle]}>
              <Text style={[styles.statusText, statusTextStyle]}>
                {statusLabels[task.status]}
              </Text>
            </View>

            {/* Task Name */}
            <Text
              numberOfLines={1}
              style={[
                styles.taskName,
                completed && styles.completedTask,
              ]}
            >
              {task.name}
            </Text>

            {/* Project */}
            <Text style={styles.project}>{task.project}</Text>
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.taskRight}>
          <Text style={styles.duration}>
            {getTaskDuration(task)}
          </Text>

          {showDate && (
            <Text style={styles.date}>Today</Text>
          )}
        </View>
      </View>
    </CardComponent>
  );
};

const getStatusBadgeStyle = (status: Task['status']) => {
  switch (status) {
    case 'pending':
      return styles.pendingBadge;
    case 'running':
      return styles.runningBadge;
    case 'completed':
      return styles.completedBadge;
    case 'paused':
      return styles.pausedBadge;
    case 'expired':
      return styles.expiredBadge;
    default:
      return styles.pendingBadge;
  }
};

const getStatusTextStyle = (status: Task['status']) => {
  switch (status) {
    case 'pending':
      return styles.pendingText;
    case 'running':
      return styles.runningText;
    case 'completed':
      return styles.completedText;
    case 'paused':
      return styles.pausedText;
    case 'expired':
      return styles.expiredText;
    default:
      return styles.pendingText;
  }
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  checkboxCompleted: {
    borderColor: '#34d399',
    backgroundColor: '#34d399',
  },
  checkmark: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 7,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  pendingBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  pendingText: {
    color: 'rgba(255,255,255,0.45)',
  },
  runningBadge: {
    backgroundColor: 'rgba(79,124,255,0.12)',
  },
  runningText: {
    color: '#4f7cff',
  },
  completedBadge: {
    backgroundColor: 'rgba(52,211,153,0.12)',
  },
  completedText: {
    color: '#34d399',
  },
  pausedBadge: {
    backgroundColor: 'rgba(251,191,36,0.12)',
  },
  pausedText: {
    color: '#fbbf24',
  },
  expiredBadge: {
    backgroundColor: 'rgba(248,113,113,0.12)',
  },
  expiredText: {
    color: '#f87171',
  },
  taskName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
  },
  completedTask: {
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'line-through',
  },
  project: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
  taskRight: {
    alignItems: 'flex-end',
    gap: 6,
    paddingTop: 2,
  },
  duration: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
  },
});

export default TaskCard;
