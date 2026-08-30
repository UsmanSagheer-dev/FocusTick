import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { Task } from '../../screens/TaskDetailsScreen';

interface TodaysTasksProps {
  tasks: Task[];
  onTaskDetails: (task: Task) => void;
}

const statusLabels: Record<Task['status'], string> = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  paused: 'Paused',
  expired: 'Expired',
};

const TodaysTasks = ({
  tasks,
  onTaskDetails,
}: TodaysTasksProps) => {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Today's Tasks
        </Text>

        <Text style={styles.taskCount}>
          {tasks.length} tasks
        </Text>
      </View>

      {/* Tasks */}
      <View style={styles.taskList}>
        {tasks.map((task) => {
          const completed = task.status === 'completed';

          return (
            <Pressable
              key={task.id}
              onPress={() => onTaskDetails(task)}
              style={({ pressed }) => [
                styles.taskCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.taskContent}>

                {/* Left */}
                <View style={styles.leftSection}>

                  {/* Checkbox */}
                  <View
                    style={[
                      styles.checkbox,
                      completed && styles.checkboxCompleted,
                    ]}
                  >
                    {completed && (
                      <Text style={styles.checkmark}>
                        ✓
                      </Text>
                    )}
                  </View>

                  {/* Task Info */}
                  <View style={styles.taskInfo}>
                    <Text
                      style={[
                        styles.taskName,
                        completed && styles.completedTaskName,
                      ]}
                      numberOfLines={1}
                    >
                      {task.name}
                    </Text>

                    <Text style={styles.project}>
                      {task.project}
                    </Text>
                  </View>

                </View>

                {/* Right */}
                <View style={styles.rightSection}>

                  <View
                    style={[
                      styles.statusBadge,
                      getStatusStyle(task.status),
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        getStatusTextStyle(task.status),
                      ]}
                    >
                      {statusLabels[task.status]}
                    </Text>
                  </View>

                  <Text style={styles.duration}>
                    {task.duration}
                  </Text>

                </View>

              </View>
            </Pressable>
          );
        })}
      </View>

    </View>
  );
};

export default TodaysTasks;

/* ---------------- Status Styles ---------------- */

const getStatusStyle = (
  status: Task['status']
) => {
  switch (status) {
    case 'completed':
      return styles.statusCompleted;

    case 'running':
      return styles.statusRunning;

    case 'paused':
      return styles.statusPaused;

    case 'expired':
      return styles.statusExpired;

    default:
      return styles.statusPending;
  }
};

const getStatusTextStyle = (
  status: Task['status']
) => {
  switch (status) {
    case 'completed':
      return styles.statusCompletedText;

    case 'running':
      return styles.statusRunningText;

    case 'paused':
      return styles.statusPausedText;

    case 'expired':
      return styles.statusExpiredText;

    default:
      return styles.statusPendingText;
  }
};

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
  
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },

  taskCount: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
  },

  taskList: {
    gap: 10,
  },

  taskCard: {
    width: '100%',
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
  },

  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 10,
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

  taskInfo: {
    flex: 1,
  },

  taskName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },

  completedTaskName: {
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'line-through',
  },

  project: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    marginTop: 2,
  },

  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },

  duration: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
  },

  /* Pending */
  statusPending: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  statusPendingText: {
    color: 'rgba(255,255,255,0.45)',
  },

  /* Running */
  statusRunning: {
    backgroundColor: 'rgba(79,124,255,0.12)',
  },

  statusRunningText: {
    color: '#4f7cff',
  },

  /* Completed */
  statusCompleted: {
    backgroundColor: 'rgba(52,211,153,0.12)',
  },

  statusCompletedText: {
    color: '#34d399',
  },

  /* Paused */
  statusPaused: {
    backgroundColor: 'rgba(251,191,36,0.12)',
  },

  statusPausedText: {
    color: '#fbbf24',
  },

  /* Expired */
  statusExpired: {
    backgroundColor: 'rgba(248,113,113,0.12)',
  },

  statusExpiredText: {
    color: '#f87171',
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});