import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

interface Task {
  id: string;
  name: string;
  project: string;
  duration: string;
  status: 'pending' | 'running' | 'completed' | 'paused' | 'expired';
  durationMinutes: number;
}

interface CreateTaskProps {
  onBack: () => void;
  onStart: (task: Task) => void;
  onSave: (task: Task) => void;
}

const projects = [
  'Medicore',
  'Learning',
  'Freelancing',
  'Personal',
  'Other',
];

const priorities = ['low', 'medium', 'high'] as const;

const CreateTask = ({
  onBack,
  onStart,
  onSave,
}: CreateTaskProps) => {
  const [name, setName] = useState('Build Appointment Module');
  const [project, setProject] = useState('Medicore');
  const [desc, setDesc] = useState('');
  const [hours, setHours] = useState(1);
  const [mins, setMins] = useState(30);
  const [priority, setPriority] =
    useState<'low' | 'medium' | 'high'>('medium');

  const [showProjects, setShowProjects] = useState(false);

  const buildTask = (
    status: Task['status']
  ): Task => ({
    id: Date.now().toString(),
    name: name.trim() || 'Untitled Task',
    project,
    duration: `${hours}h ${mins}m`,
    durationMinutes: hours * 60 + mins,
    status,
  });

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Text style={styles.title}>
          Create Task
        </Text>
      </View>

      {/* Form */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Task Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            TASK NAME
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="What are you working on?"
            placeholderTextColor="rgba(255,255,255,0.2)"
            style={styles.input}
          />
        </View>

        {/* Project */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            PROJECT
          </Text>

          <Pressable
            onPress={() =>
              setShowProjects(!showProjects)
            }
            style={styles.selectButton}
          >
            <Text style={styles.selectText}>
              {project}
            </Text>

            <Text style={styles.arrow}>
              {showProjects ? '⌃' : '⌄'}
            </Text>
          </Pressable>

          {showProjects && (
            <View style={styles.dropdown}>
              {projects.map((p) => {
                const active = p === project;

                return (
                  <Pressable
                    key={p}
                    onPress={() => {
                      setProject(p);
                      setShowProjects(false);
                    }}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      pressed && styles.dropdownPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        active && styles.dropdownActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            DESCRIPTION
          </Text>

          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Optional description..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.textarea,
            ]}
          />
        </View>

        {/* Duration */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            DURATION
          </Text>

          <View style={styles.durationRow}>

            {/* Hours */}
            <View style={styles.durationBox}>
              <Pressable
                onPress={() =>
                  setHours(Math.max(0, hours - 1))
                }
                style={styles.counterButton}
              >
                <Text style={styles.counterText}>
                  −
                </Text>
              </Pressable>

              <View style={styles.durationValue}>
                <Text style={styles.durationNumber}>
                  {String(hours).padStart(2, '0')}
                </Text>

                <Text style={styles.durationUnit}>
                  hr
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setHours(Math.min(12, hours + 1))
                }
                style={styles.counterButton}
              >
                <Text style={styles.counterText}>
                  +
                </Text>
              </Pressable>
            </View>

            {/* Minutes */}
            <View style={styles.durationBox}>
              <Pressable
                onPress={() =>
                  setMins(Math.max(0, mins - 5))
                }
                style={styles.counterButton}
              >
                <Text style={styles.counterText}>
                  −
                </Text>
              </Pressable>

              <View style={styles.durationValue}>
                <Text style={styles.durationNumber}>
                  {String(mins).padStart(2, '0')}
                </Text>

                <Text style={styles.durationUnit}>
                  min
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setMins(Math.min(55, mins + 5))
                }
                style={styles.counterButton}
              >
                <Text style={styles.counterText}>
                  +
                </Text>
              </Pressable>
            </View>

          </View>
        </View>

        {/* Priority */}
        <View style={styles.priorityGroup}>
          <Text style={styles.label}>
            PRIORITY
          </Text>

          <View style={styles.priorityRow}>
            {priorities.map((p) => {
              const active = priority === p;

              return (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.priorityButton,
                    active && getPriorityStyle(p),
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      active && getPriorityTextStyle(p),
                    ]}
                  >
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* CTAs */}
      <View style={styles.ctaContainer}>

        <Pressable
          onPress={() =>
            onStart(buildTask('running'))
          }
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.startButtonText}>
            ▶ Start Timer
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            onSave(buildTask('pending'));
            onBack();
          }}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.saveButtonText}>
            Save Task
          </Text>
        </Pressable>

      </View>
    </View>
  );
};

export default CreateTask;

// Navigation wrapper component
const CreateTaskScreenWrapper: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStart = (task: Task) => {
    const params = route.params as any;
    if (params?.onTaskCreated) {
      params.onTaskCreated(task);
    }
    navigation.goBack();
  };

  const handleSave = (task: Task) => {
    // For now, just go back - you can extend this to handle task saving
    console.log('Saving task:', task);
    navigation.goBack();
  };

  return (
    <CreateTask
      onBack={handleBack}
      onStart={handleStart}
      onSave={handleSave}
    />
  );
};

export { CreateTaskScreenWrapper as CreateTaskScreen };

/* ------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------ */

const getPriorityStyle = (
  priority: 'low' | 'medium' | 'high'
) => {
  switch (priority) {
    case 'low':
      return styles.priorityLow;

    case 'medium':
      return styles.priorityMedium;

    case 'high':
      return styles.priorityHigh;
  }
};

const getPriorityTextStyle = (
  priority: 'low' | 'medium' | 'high'
) => {
  switch (priority) {
    case 'low':
      return styles.priorityLowText;

    case 'medium':
      return styles.priorityMediumText;

    case 'high':
      return styles.priorityHighText;
  }
};

/* ------------------------------------------------ */
/* Styles */
/* ------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 32,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  formGroup: {
    marginBottom: 20,
  },

  label: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },

  input: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
  },

  textarea: {
    minHeight: 85,
  },

  selectButton: {
    minHeight: 52,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectText: {
    color: '#fff',
    fontSize: 15,
  },

  arrow: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 20,
  },

  dropdown: {
    marginTop: 5,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    overflow: 'hidden',
  },

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },

  dropdownPressed: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  dropdownText: {
    color: '#fff',
    fontSize: 15,
  },

  dropdownActive: {
    color: '#4f7cff',
  },

  durationRow: {
    flexDirection: 'row',
    gap: 12,
  },

  durationBox: {
    flex: 1,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  durationValue: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  durationNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },

  durationUnit: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    marginLeft: 4,
  },

  priorityGroup: {
    marginBottom: 24,
  },

  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },

  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  priorityText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  priorityLow: {
    borderColor: '#34d399',
    backgroundColor: 'rgba(52,211,153,0.1)',
  },

  priorityMedium: {
    borderColor: '#fbbf24',
    backgroundColor: 'rgba(251,191,36,0.1)',
  },

  priorityHigh: {
    borderColor: '#f87171',
    backgroundColor: 'rgba(248,113,113,0.1)',
  },

  priorityLowText: {
    color: '#34d399',
  },

  priorityMediumText: {
    color: '#fbbf24',
  },

  priorityHighText: {
    color: '#f87171',
  },

  ctaContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },

  startButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#4f7cff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  saveButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '500',
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});