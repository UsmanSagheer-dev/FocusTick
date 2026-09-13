import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Task } from '../types';
import { useTasks } from '../context/TaskContext';

type FocusModeRouteProp = RouteProp<RootStackParamList, 'FocusMode'>;

type FocusState = 'running' | 'paused' | 'finished';

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const FocusModeScreenWrapper: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<FocusModeRouteProp>();
  const { tasks, completeTask, pauseActiveTask, focusTask } = useTasks();

  // Always read the live task from context so status stays in sync.
  const initialTask = route.params.task;
  const task = tasks.find(t => t.id === initialTask.id) ?? initialTask;

  const handleDone = useCallback(
    (elapsed: number) => {
      // Pass the actual focused time (including extensions)
      completeTask(task.id, elapsed);
      navigation.goBack();
    },
    [completeTask, task.id, navigation],
  );

  const handleBack = useCallback(() => {
    // Don't auto-pause - let timer continue running in background
    navigation.goBack();
  }, [navigation]);

  const handlePause = useCallback(() => {
    pauseActiveTask();
  }, [pauseActiveTask]);

  const handleResume = useCallback(() => {
    focusTask(task.id);
  }, [focusTask, task.id]);

  return (
    <FocusMode
      task={task}
      onDone={handleDone}
      onBack={handleBack}
      onPause={handlePause}
      onResume={handleResume}
    />
  );
};

export default FocusModeScreenWrapper;

/* ================================================================== */
/* FOCUS MODE                                                         */
/* ================================================================== */

interface FocusModeProps {
  task: Task;
  onDone: (elapsed: number) => void;
  onBack: () => void;
  onPause: () => void;
  onResume: () => void;
}

export function FocusMode({ task, onDone, onBack, onPause, onResume }: FocusModeProps) {
  const totalSeconds = (task.durationMinutes ?? 25) * 60;

  // Calculate initial remaining time based on task state
  const calculateInitialRemaining = () => {
    if (task.status === 'paused' && task.remainingTime !== undefined) {
      return task.remainingTime;
    }
    if (task.startedAt && task.status === 'running') {
      const startTime = new Date(task.startedAt).getTime();
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      return Math.max(0, totalSeconds - elapsedSeconds);
    }
    return totalSeconds;
  };

  const [remaining, setRemaining] = useState(calculateInitialRemaining);
  const [localState, setLocalState] = useState<FocusState>(
    task.status === 'completed' ? 'finished' :
    task.status === 'paused' ? 'paused' : 'running'
  );
  const [showExtend, setShowExtend] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tracks the *effective* session length, growing whenever the user adds
  // time. The countdown effect must use this (not the original fixed
  // totalSeconds), otherwise an extended session snaps straight back to 0
  // because it keeps comparing elapsed time against the old duration.
  const [totalDuration, setTotalDuration] = useState(totalSeconds);

  // Track actual focused time (seconds)
  const [focusedSeconds, setFocusedSeconds] = useState(0);

  // Initialize focused time based on task state
  useEffect(() => {
    if (task.startedAt && task.status === 'running') {
      const startTime = new Date(task.startedAt).getTime();
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
      setFocusedSeconds(initialElapsed);
    } else if (task.status === 'paused' && task.remainingTime !== undefined && task.durationMinutes) {
      const totalSeconds = task.durationMinutes * 60;
      const elapsedSeconds = totalSeconds - task.remainingTime;
      setFocusedSeconds(elapsedSeconds);
    } else if (task.status === 'completed' && task.durationMinutes) {
      setFocusedSeconds(task.durationMinutes * 60);
    }
  }, [task.startedAt, task.status, task.remainingTime, task.durationMinutes]);

  // Use local state for timer management, but sync with task status
  const state: FocusState = localState;

  // Use actual focused time for display
  const elapsed = focusedSeconds;

  const progress =
    totalDuration > 0 ? ((totalDuration - remaining) / totalDuration) * 100 : 0;

  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedProgress]);

  const animatedDashOffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
  });

  // Timer effect - only run when task is running
  useEffect(() => {
    if (localState === 'running') {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          const newRemaining = Math.max(0, prev - 1);
          if (newRemaining <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setLocalState('finished');
          }
          return newRemaining;
        });
      }, 1000);
    } else {
      // Stop timer when paused or not running, preserve current remaining time
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [localState]);

  // Track actual focused time separately
  useEffect(() => {
    if (localState === 'running') {
      const focusedInterval = setInterval(() => {
        setFocusedSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(focusedInterval);
    }
  }, [localState]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(
        sec,
      ).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  /* ---------------------------- FINISHED ---------------------------- */
  if (state === 'finished') {
    return (
      <View style={styles.screen}>
        <View style={styles.flexSpacer} />

        <View style={styles.centerColumn}>
          <View style={styles.completeIconCircle}>
            <Icon name="checkmark" size={40} color="#34d399" />
          </View>

          <Text style={styles.eyebrow}>SESSION COMPLETE</Text>
          <Text style={styles.bigTitle}>Time's Up!</Text>
          <Text style={styles.subtitleCenter}>
            Your focus session is complete.
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTaskName}>{task.name}</Text>
            <Text style={styles.summaryProject}>{task.project}</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryValue, { color: '#34d399' }]}>
                  {formatDuration(task.durationMinutes ?? 25)}
                </Text>
                <Text style={styles.summaryLabel}>Duration</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryStat}>
                <Text style={[styles.summaryValue, { color: '#4f7cff' }]}>
                  {formatTime(elapsed)}
                </Text>
                <Text style={styles.summaryLabel}>Focused</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonStack}>
          <Pressable
            onPress={() => onDone(elapsed)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.gradientButtonText}>Complete Task</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => setShowExtend(true)}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Add Time</Text>
          </Pressable>

          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.tertiaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.tertiaryButtonText}>Start New Task</Text>
          </Pressable>
        </View>

        <ExtendModal
          visible={showExtend}
          onClose={() => setShowExtend(false)}
          onExtend={m => {
            const addedSeconds = m * 60;
            setTotalDuration(td => td + addedSeconds);
            setRemaining(r => r + addedSeconds);
            setLocalState('running');
            setShowExtend(false);
          }}
        />
      </View>
    );
  }

  /* ----------------------------- PAUSED ------------------------------ */
  if (state === 'paused') {
    return (
      <View style={styles.screen}>
        <View style={styles.pausedHeader}>
          <Text style={styles.pausedEyebrow}>SESSION PAUSED</Text>
          <Text style={styles.pausedTitle}>{task.name}</Text>
          <Text style={styles.pausedProject}>{task.project}</Text>
        </View>

        <View style={styles.centerColumn}>
          <Text style={styles.pausedLabel}>PAUSED</Text>
          <Text style={styles.pausedTimer}>{formatTime(remaining)}</Text>
        </View>

        <View style={styles.buttonStack}>
          <Pressable
            onPress={() => setLocalState('running')}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <LinearGradient
              colors={['#4f7cff', '#7c4fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.gradientButtonText}>Resume</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => setShowEndConfirm(true)}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>End Session</Text>
          </Pressable>
        </View>

        <ConfirmModal
          visible={showEndConfirm}
          title="End this session?"
          desc="Your current progress will be saved."
          confirmLabel="End Session"
          cancelLabel="Continue Session"
          onConfirm={() => onDone(elapsed)}
          onCancel={() => setShowEndConfirm(false)}
        />
      </View>
    );
  }

  /* ----------------------------- RUNNING ------------------------------ */
  return (
    <View style={styles.screen}>
      <View style={styles.ambientGlow} pointerEvents="none" />

      {/* Top */}
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Icon name="arrow-back" size={20} color="rgba(255,255,255,0.5)" />
        </Pressable>

        <Text style={styles.topLabel}>FOCUS SESSION</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Task info */}
      <View style={styles.taskInfo}>
        <Text style={styles.taskInfoName}>{task.name}</Text>
        <Text style={styles.taskInfoProject}>{task.project}</Text>
      </View>

      {/* Timer ring */}
      <View style={styles.ringWrapper}>
        <Svg width={280} height={280} viewBox="0 0 280 280">
          <Defs>
            <SvgLinearGradient id="focusGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#4f7cff" />
              <Stop offset="100%" stopColor="#7c4fff" />
            </SvgLinearGradient>
          </Defs>

          <Circle
            cx={140}
            cy={140}
            r={RADIUS}
            stroke="#ffffff10"
            strokeWidth={10}
            fill="none"
          />

          <AnimatedCircle
            cx={140}
            cy={140}
            r={RADIUS}
            stroke="url(#focusGrad)"
            strokeWidth={10}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={animatedDashOffset}
            strokeLinecap="round"
            rotation={-90}
            originX={140}
            originY={140}
          />
        </Svg>

        <View style={styles.ringCenter}>
          <Text style={styles.timerText}>{formatTime(remaining)}</Text>
          <Text style={styles.progressText}>
            {Math.round(progress)}% complete
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlsRow}>
          <Pressable
            onPress={() => setLocalState('paused')}
            style={({ pressed }) => [
              styles.pauseButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.pauseButtonText}>⏸ Pause</Text>
          </Pressable>

          <Pressable
            onPress={() => onDone(elapsed)}
            style={({ pressed }) => [{ flex: 1 }, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={['#4f7cff', '#7c4fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.finishButton}
            >
              <Text style={styles.finishButtonText}>✓ Finish</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setShowEndConfirm(true)}
          style={({ pressed }) => [
            styles.stopButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.stopText}>Stop Session</Text>
        </Pressable>

        <View style={styles.awakeRow}>
          <View style={styles.awakeDot} />
          <Text style={styles.awakeText}>Keep screen awake</Text>
        </View>
      </View>

      <ConfirmModal
        visible={showEndConfirm}
        title="End this session?"
        desc="Your current progress will be saved."
        confirmLabel="End Session"
        cancelLabel="Continue Session"
        onConfirm={() => onDone(elapsed)}
        onCancel={() => setShowEndConfirm(false)}
      />

      <ExtendModal
        visible={showExtend}
        onClose={() => setShowExtend(false)}
        onExtend={m => {
          const addedSeconds = m * 60;
          setTotalDuration(td => td + addedSeconds);
          setRemaining(r => r + addedSeconds);
          setShowExtend(false);
        }}
      />
    </View>
  );
}

/* ================================================================== */
/* EXTEND MODAL (bottom sheet)                                        */
/* ================================================================== */

function ExtendModal({
  visible,
  onClose,
  onExtend,
}: {
  visible: boolean;
  onClose: () => void;
  onExtend: (mins: number) => void;
}) {
  const options = [5, 10, 15, 30];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>Extend Session</Text>
          <Text style={styles.sheetDesc}>
            Add more time to your current session
          </Text>

          <View style={styles.extendGrid}>
            {options.map(m => (
              <Pressable
                key={m}
                onPress={() => onExtend(m)}
                style={({ pressed }) => [
                  styles.extendOption,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.extendOptionValue}>+{m}</Text>
                <Text style={styles.extendOptionUnit}>min</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <LinearGradient
              colors={['#4f7cff', '#7c4fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.gradientButtonText}>Continue Focus</Text>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ================================================================== */
/* CONFIRM MODAL (bottom sheet)                                       */
/* ================================================================== */

function ConfirmModal({
  visible,
  title,
  desc,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  desc: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>{title}</Text>
          <Text style={styles.sheetDesc}>{desc}</Text>

          <View style={{ gap: 12 }}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <LinearGradient
                colors={['#4f7cff', '#7c4fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.gradientButtonText}>{cancelLabel}</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.destructiveButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.destructiveButtonText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ================================================================== */
/* STYLES                                                              */
/* ================================================================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  flexSpacer: { flex: 0 },

  ambientGlow: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    marginLeft: -190,
    marginTop: -190,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(79,124,255,0.05)',
  },

  /* ---------- Top bar ---------- */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '500',
  },

  /* ---------- Task info ---------- */
  taskInfo: {
    alignItems: 'center',
  },

  taskInfoName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },

  taskInfoProject: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
  },

  /* ---------- Timer ring ---------- */
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timerText: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  progressText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 13,
    marginTop: 12,
  },

  /* ---------- Controls (running) ---------- */
  controls: {
    gap: 16,
  },

  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  pauseButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pauseButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '500',
  },

  finishButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  stopButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  stopText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 14,
    fontWeight: '500',
  },

  awakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  awakeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(79,124,255,0.4)',
  },

  awakeText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
  },

  /* ---------- Paused state ---------- */
  pausedHeader: {
    alignItems: 'center',
  },

  pausedEyebrow: {
    color: '#fbbf24',
    fontSize: 11,
    letterSpacing: 3,
    marginBottom: 8,
  },

  pausedTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  pausedProject: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    marginTop: 4,
  },

  pausedLabel: {
    color: 'rgba(251,191,36,0.7)',
    fontSize: 12,
    letterSpacing: 5,
    marginBottom: 24,
  },

  pausedTimer: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '700',
    opacity: 0.6,
    fontVariant: ['tabular-nums'],
  },

  /* ---------- Finished state ---------- */
  centerColumn: {
    alignItems: 'center',
  },

  completeIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },

  eyebrow: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    letterSpacing: 3,
    marginBottom: 8,
  },

  bigTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitleCenter: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },

  summaryCard: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },

  summaryTaskName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  summaryProject: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },

  summaryStat: {
    alignItems: 'center',
  },

  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  summaryLabel: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    marginTop: 2,
  },

  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  /* ---------- Shared buttons ---------- */
  buttonStack: {
    gap: 12,
  },

  gradientButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '500',
  },

  tertiaryButton: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tertiaryButtonText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    fontWeight: '500',
  },

  destructiveButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  destructiveButtonText: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '500',
  },

  /* ---------- Bottom sheets ---------- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#111118',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 4,
  },

  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    marginBottom: 24,
  },

  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  sheetDesc: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    marginBottom: 20,
  },

  extendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  extendOption: {
    flexBasis: '22%',
    flexGrow: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },

  extendOptionValue: {
    color: '#4f7cff',
    fontSize: 16,
    fontWeight: '700',
  },

  extendOptionUnit: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});