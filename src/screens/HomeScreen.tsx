import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { CurrentSession, TodayFocus, TodaysTasks } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { AppText } from '../common';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { tasks, activeTask } = useTasks();

  const [timerDisplay, setTimerDisplay] = useState('25:00');
  const [timerProgress, setTimerProgress] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const completed = tasks.filter(t => t.status === 'completed').length;

  // Calculate total focus time from completed tasks
  const totalFocusMinutes = tasks
    .filter(t => t.status === 'completed')
    .reduce((sum, task) => sum + (task.durationMinutes || 0), 0);

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const totalFocusTime = formatFocusTime(totalFocusMinutes);

  // Daily goal: 5 hours = 300 minutes
  const dailyGoalMinutes = 300;
  const dailyGoal = formatFocusTime(dailyGoalMinutes);
  const goalPercent = dailyGoalMinutes > 0
    ? Math.min(Math.round((totalFocusMinutes / dailyGoalMinutes) * 100), 100)
    : 0;

  // Real-time timer for active task
  useEffect(() => {
    if (activeTask && activeTask.startedAt && activeTask.durationMinutes) {
      const totalSeconds = activeTask.durationMinutes * 60;
      const startTime = new Date(activeTask.startedAt).getTime();

      const updateTimer = () => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsedSeconds);

        setRemainingSeconds(remaining);

        // Format remaining time
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        setTimerDisplay(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);

        // Calculate progress percentage
        const progress = Math.min(Math.round((elapsedSeconds / totalSeconds) * 100), 100);
        setTimerProgress(progress);
      };

      // Initial update
      updateTimer();

      // Update every second
      const intervalId = setInterval(updateTimer, 1000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      // Reset when no active task
      setTimerDisplay('25:00');
      setTimerProgress(0);
      setRemainingSeconds(0);
    }
  }, [activeTask]);

  const onOpenFocus = useCallback(() => {
    if (activeTask) {
      navigation.navigate('FocusMode', { task: activeTask });
    }
  }, [activeTask, navigation]);

  const onTaskDetails = useCallback(
    (task: Task) => {
      navigation.navigate('TaskDetails', { task });
    },
    [navigation],
  );

  const onCreateTask = useCallback(() => {
    navigation.navigate('CreateTask');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <View>
              <AppText variant="subheading" style={styles.greeting}>
                Good Evening
              </AppText>
              <AppText variant="heading1" style={styles.title}>
                Usman 👋
              </AppText>
              <AppText variant="body" style={styles.subtitle}>
                Ready to focus?
              </AppText>
            </View>
            <View style={styles.profileContainer}>
              <LinearGradient
                colors={['#4f7cff', '#7c4fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileGradient}
              />
            </View>
          </View>

          <View style={styles.content}>
            <TodayFocus
              completed={completed}
              goalPercent={goalPercent}
              totalFocusTime={totalFocusTime}
              dailyGoal={dailyGoal}
            />
          </View>

          <View style={styles.currentSessionContainer}>
            <CurrentSession
              activeTask={activeTask}
              timerDisplay={timerDisplay}
              timerProgress={timerProgress}
              onOpenFocus={onOpenFocus}
              onTaskDetails={onTaskDetails}
              onCreateTask={onCreateTask}
            />
          </View>

          <View style={styles.todayTasksContainer}>
            <TodaysTasks tasks={tasks} onTaskDetails={onTaskDetails} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  content: {
    marginBottom: 24,
  },
  currentSessionContainer: {
    marginTop: 24,
  },
  todayTasksContainer: {
    marginTop: 24,
  },
});

export default HomeScreen;