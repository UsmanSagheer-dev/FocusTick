import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppInput, AppText } from '../common';
import Icon from 'react-native-vector-icons/Ionicons';

import type { Task } from '../types';
import { useTasks } from '../context/TaskContext';

interface CreateTaskProps {
  onBack: () => void;
  onStart: (task: Task) => void;
  onSave: (task: Task) => void;
}

const projects = ['Medicore', 'Learning', 'Freelancing', 'Personal', 'Other'];

const priorities = ['low', 'medium', 'high'] as const;

const CreateTask = ({ onBack, onStart, onSave }: CreateTaskProps) => {
  const [name, setName] = useState('');
  const [project, setProject] = useState('Medicore');
  const [desc, setDesc] = useState('');
  const [hours, setHours] = useState(1);
  const [mins, setMins] = useState(30);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    'medium',
  );

  const [showProjects, setShowProjects] = useState(false);
  const [useCustomDuration, setUseCustomDuration] = useState(false);
  const [customHours, setCustomHours] = useState('1');
  const [customMins, setCustomMins] = useState('30');

  const buildTask = (status: Task['status']): Task => {
    const finalHours = useCustomDuration ? parseInt(customHours) || 0 : hours;
    const finalMins = useCustomDuration ? parseInt(customMins) || 0 : mins;
    const totalMinutes = finalHours * 60 + finalMins;

    return {
      id: Date.now().toString(),
      name: name.trim() || 'Untitled Task',
      project,
      duration: `${finalHours}h ${finalMins}m`,
      durationMinutes: totalMinutes,
      status,
      description: desc.trim() || undefined,
      priority,
    };
  };

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
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>

        <AppText variant="heading3">Create Task</AppText>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <AppInput
            value={name}
            label="Task Name"
            onChangeText={setName}
            placeholder="What are you working on?"
          />
        </View>

        {/* Project */}
        <View style={styles.formGroup}>
          <AppText variant="label" style={styles.label}>
            Project
          </AppText>

          <Pressable
            onPress={() => setShowProjects(!showProjects)}
            style={styles.selectButton}
          >
            <AppText style={styles.selectText}>{project}</AppText>

            <AppText style={styles.arrow}>{showProjects ? '⌃' : '⌄'}</AppText>
          </Pressable>

          {showProjects && (
            <View style={styles.dropdown}>
              {projects.map(p => {
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
                    <AppText
                      style={[
                        styles.dropdownText,
                        active && styles.dropdownActive,
                      ]}
                    >
                      {p}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <AppInput
            value={desc}
            label="Description"
            onChangeText={setDesc}
            placeholder="Optional description..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ minHeight: 85 }}
          />
        </View>

        {/* Duration */}
        <View style={styles.formGroup}>
          <View style={styles.durationHeader}>
            <AppText variant="label" style={styles.label}>
              Duration
            </AppText>

            <Pressable
              onPress={() => setUseCustomDuration(!useCustomDuration)}
              style={styles.toggleButton}
            >
              <AppText style={styles.toggleText}>
                {useCustomDuration ? 'Use Presets' : 'Custom'}
              </AppText>
            </Pressable>
          </View>

          {!useCustomDuration ? (
            <View style={styles.durationRow}>
            {/* Hours */}
            <View style={styles.durationBox}>
              <Pressable
                onPress={() => setHours(Math.max(0, hours - 1))}
                style={styles.counterButton}
              >
                <Text style={styles.counterText}>−</Text>
              </Pressable>

              <View style={styles.durationValue}>
                <AppText style={styles.durationNumber}>
                  {String(hours).padStart(2, '0')}
                </AppText>

                <AppText style={styles.durationUnit}>hr</AppText>
              </View>

              <Pressable
                onPress={() => setHours(Math.min(12, hours + 1))}
                style={styles.counterButton}
              >
                <Text style={styles.counterText}>+</Text>
              </Pressable>
            </View>

            {/* Minutes */}
            <View style={styles.durationBox}>
              <Pressable
                onPress={() => setMins(Math.max(0, mins - 5))}
                style={styles.counterButton}
              >
                <Text style={styles.counterText}>−</Text>
              </Pressable>

              <View style={styles.durationValue}>
                <Text style={styles.durationNumber}>
                  {String(mins).padStart(2, '0')}
                </Text>

                <Text style={styles.durationUnit}>min</Text>
              </View>

              <Pressable
                onPress={() => setMins(Math.min(55, mins + 5))}
                style={styles.counterButton}
              >
                <Text style={styles.counterText}>+</Text>
              </Pressable>
            </View>
          </View>
          ) : (
            <View style={styles.customDurationRow}>
              <View style={styles.customDurationBox}>
                <AppInput
                  value={customHours}
                  onChangeText={setCustomHours}
                  placeholder="0"
                  keyboardType="number-pad"
                  style={styles.customInput}
                  containerStyle={styles.customInputContainer}
                  maxLength={2}
                />
                <AppText style={styles.customUnit}>hr</AppText>
              </View>

              <View style={styles.customDurationBox}>
                <AppInput
                  value={customMins}
                  onChangeText={setCustomMins}
                  placeholder="0"
                  keyboardType="number-pad"
                  style={styles.customInput}
                  containerStyle={styles.customInputContainer}
                  maxLength={2}
                />
                <AppText style={styles.customUnit}>min</AppText>
              </View>
            </View>
          )}
        </View>

        <View style={styles.priorityGroup}>
          <AppText variant="label" style={styles.label}>
            Priority
          </AppText>

          <View style={styles.priorityRow}>
            {priorities.map(p => {
              const active = priority === p;

              return (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[styles.priorityButton, active && getPriorityStyle(p)]}
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
          onPress={() => onStart(buildTask('running'))}
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.pressed,
          ]}
        >
          <AppText style={styles.startButtonText}>▶ Start Timer</AppText>
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
          <AppText style={styles.saveButtonText}>Save Task</AppText>
        </Pressable>
      </View>
    </View>
  );
};

export default CreateTask;

// Navigation wrapper component — plugs the form into the shared TaskContext
const CreateTaskScreenWrapper: React.FC = () => {
  const navigation = useNavigation();
  const { addTask, startTask } = useTasks();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStart = (task: Task) => {
    startTask(task); // becomes the active/running task everywhere instantly
    navigation.goBack();
  };

  const handleSave = (task: Task) => {
    addTask(task); // added as "pending" everywhere instantly
  };

  return (
    <CreateTask onBack={handleBack} onStart={handleStart} onSave={handleSave} />
  );
};

export { CreateTaskScreenWrapper as CreateTaskScreen };

const getPriorityStyle = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low':
      return styles.priorityLow;

    case 'medium':
      return styles.priorityMedium;

    case 'high':
      return styles.priorityHigh;
  }
};

const getPriorityTextStyle = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low':
      return styles.priorityLowText;

    case 'medium':
      return styles.priorityMediumText;

    case 'high':
      return styles.priorityHighText;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },

  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },

  durationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(79, 124, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(79, 124, 255, 0.3)',
  },

  toggleText: {
    color: '#4f7cff',
    fontSize: 12,
    fontWeight: '500',
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

  customDurationRow: {
    flexDirection: 'row',
    gap: 12,
  },

  customDurationBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  customInputContainer: {
    marginBottom: 0,
    flex: 1,
  },

  customInput: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 0,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    textAlign: 'center',
    height: 52,
  },

  customUnit: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
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