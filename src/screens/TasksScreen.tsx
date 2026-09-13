import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { AppInput, AppText } from '../common';
import Icon from 'react-native-vector-icons/Ionicons';

import type { Task } from '../types';
import { TaskProvider, useTasks } from '../context/TaskContext';
import { TaskCard } from '../components';

type TasksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

const TasksScreen: React.FC = () => {
  const navigation = useNavigation<TasksScreenNavigationProp>();
  const { tasks } = useTasks();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Today', 'Pending', 'Completed'];

  /*
   * Search + Filter
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filter
      let matchesFilter = true;

      if (filter === 'Pending') {
        matchesFilter = task.status === 'pending';
      }

      if (filter === 'Completed') {
        matchesFilter = task.status === 'completed';
      }

      // Search
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        searchValue.length === 0 ||
        task.name.toLowerCase().includes(searchValue) ||
        task.project.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  /*
   * Create Task
   */
  const handleCreateTask = () => {
    navigation.navigate('CreateTask');
  };

  /*
   * Task Details
   */
  const handleTaskDetails = (task: Task) => {
    navigation.navigate('TaskDetails', { task });
  };

  return (
    <TaskProvider>
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <AppText variant="heading2" style={styles.title}>
                Tasks
              </AppText>

              <AppText variant="caption" style={styles.subtitle}>
                Manage your focus tasks
              </AppText>
            </View>

            {/* Add Task */}
            <TouchableOpacity
              onPress={handleCreateTask}
              activeOpacity={0.8}
              style={styles.addButton}
            >
              <Text style={styles.addIcon}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <AppInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search tasks..."
              icon={
                <Icon
                  name="search"
                  size={20}
                  color="rgba(255,255,255,0.25)"
                />
              }
              iconPosition="left"
              containerStyle={styles.searchInputContainer}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {filters.map(item => {
              const active = filter === item;

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setFilter(item)}
                  activeOpacity={0.8}
                  style={[
                    styles.filterButton,
                    active && styles.filterButtonActive,
                  ]}
                >
                  <AppText
                    style={[
                      styles.filterText,
                      active && styles.filterTextActive,
                    ]}
                  >
                    {item}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ====================================== */}
        {/* TASK LIST */}
        {/* ====================================== */}

        <ScrollView
          style={styles.taskScroll}
          contentContainerStyle={styles.taskContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredTasks.length === 0 ? (
            /* ================================== */
            /* EMPTY STATE */
            /* ================================== */

            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>✓</Text>
              </View>

              <AppText variant="subheading" style={styles.emptyTitle}>
                No tasks yet
              </AppText>

              <AppText variant="caption" style={styles.emptySubtitle}>
                {search
                  ? 'No tasks match your search.'
                  : 'Create your first focus session.'}
              </AppText>

              <TouchableOpacity
                onPress={handleCreateTask}
                activeOpacity={0.8}
                style={styles.createTaskButton}
              >
                <AppText style={styles.createTaskText}>Create Task</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            /* ================================== */
            /* TASKS */
            /* ================================== */

            <View style={styles.taskList}>
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={handleTaskDetails}
                  showDate={true}
                  useTouchableOpacity={true}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
    </TaskProvider>
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

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 14,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#4f7cff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },

  searchContainer: {
    marginBottom: 14,
  },

  searchInputContainer: {
    marginBottom: 0,
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 0,
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    height: 48,
    paddingLeft: 48,
  },

  filterContainer: {
    gap: 8,
    paddingRight: 10,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  filterButtonActive: {
    backgroundColor: '#4f7cff',
  },

  filterText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '500',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  taskScroll: {
    flex: 1,
  },

  taskContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  taskList: {
    gap: 10,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
  },

  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyIcon: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 28,
  },

  emptyTitle: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 5,
  },

  emptySubtitle: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 13,
    textAlign: 'center',
  },

  createTaskButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: 'rgba(79,124,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(79,124,255,0.3)',
  },

  createTaskText: {
    color: '#4f7cff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TasksScreen;