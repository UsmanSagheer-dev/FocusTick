import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Task } from '../../types';

interface CurrentSessionProps {
  activeTask: Task | null;
  timerDisplay: string;
  timerProgress: number;
  onOpenFocus: () => void;
  onTaskDetails: (task: Task) => void;
  onCreateTask: () => void;
}

const CurrentSession = ({
  activeTask,
  timerDisplay,
  timerProgress,
  onOpenFocus,
  onTaskDetails,
  onCreateTask,
}: CurrentSessionProps) => {
  return (
    <View style={styles.container}>
      {activeTask ? (
        <View style={styles.sessionCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.currentSession}>CURRENT SESSION</Text>

            <View style={styles.pulseDot} />
          </View>

          {/* Task Info */}
          <Text style={styles.taskName}>{activeTask.name}</Text>

          <Text style={styles.project}>{activeTask.project}</Text>

          {/* Timer */}
          <Text style={styles.timer}>{timerDisplay}</Text>

          {/* Progress */}
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progress,
                {
                  width: `${timerProgress}%`,
                },
              ]}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Pressable
              onPress={onOpenFocus}
              style={({ pressed }) => [
                styles.resumeButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.resumeText}>Resume Focus</Text>
            </Pressable>

            <Pressable
              onPress={() => onTaskDetails(activeTask)}
              style={({ pressed }) => [
                styles.detailsButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.detailsText}>Details</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.readyCard}>
          <Text style={styles.readyTitle}>Ready to focus?</Text>

          <Text style={styles.readySubtitle}>Start a new focus session</Text>

          <Pressable
            onPress={onCreateTask}
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.startText}>+ Start Task</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CurrentSession;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // Active Session
  sessionCard: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(79, 124, 255, 0.2)',
    borderRadius: 24,
    padding: 20,
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  currentSession: {
    fontSize: 10,
    color: '#6f8bdf',
    letterSpacing: 2,
    fontWeight: '500',
  },

  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4f7cff',
  },

  taskName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },

  project: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },

  timer: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'monospace',
  },

  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },

  progress: {
    height: '100%',
    backgroundColor: '#4f7cff',
    borderRadius: 10,
  },

  // Buttons
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },

  resumeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#4f7cff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resumeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  detailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailsText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },

  // Ready State
  readyCard: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 20,
  },

  readyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },

  readySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },

  startButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#4f7cff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  startText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});