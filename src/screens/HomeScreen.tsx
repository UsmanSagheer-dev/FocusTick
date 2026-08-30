import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { CurrentSession, TodayFocus, TodaysTasks } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

interface ActiveTask {
  id: string;
  name: string;
  project: string;
  duration: string;
  status: 'pending' | 'running' | 'completed' | 'paused' | 'expired';
  durationMinutes: number;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [completed] = useState(3);
  const [goalPercent] = useState(68);
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [timerDisplay, setTimerDisplay] = useState('25:00');
  const [timerProgress] = useState(0);
  const [tasks] = useState<ActiveTask[]>([
    {
      id: '1',
      name: 'Build Appointment Module',
      project: 'Medicore',
      duration: '1h 30m',
      status: 'completed',
      durationMinutes: 90,
    },
    {
      id: '2',
      name: 'Review PR #42',
      project: 'Learning',
      duration: '45m',
      status: 'pending',
      durationMinutes: 45,
    },
    {
      id: '3',
      name: 'Update documentation',
      project: 'Personal',
      duration: '30m',
      status: 'pending',
      durationMinutes: 30,
    },
  ]);

  // Update timer display when active task changes
  React.useEffect(() => {
    if (activeTask) {
      setTimerDisplay(`${activeTask.durationMinutes}:00`);
    } else {
      setTimerDisplay('25:00');
    }
  }, [activeTask]);

  const onOpenFocus = useCallback(() => {
    console.log('Open focus session');
  }, []);

  const onTaskDetails = useCallback((task: ActiveTask) => {
    console.log('Task details:', task);
    // You can navigate to task details screen here
  }, []);

  const onCreateTask = useCallback(() => {
    navigation.navigate('CreateTask', {
      onTaskCreated: (task: ActiveTask) => {
        setActiveTask(task);
        console.log('Task created:', task);
      },
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Good Evening</Text>
              <Text style={styles.title}>Usman 👋</Text>
              <Text style={styles.subtitle}>Ready to focus?</Text>
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
            <TodayFocus completed={completed} goalPercent={goalPercent} />
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
    fontSize: 16,
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
  button: {
    backgroundColor: '#4f7cff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'rgba(79, 124, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4f7cff',
    width: '80%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4f7cff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
