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
import type { Task } from './TaskDetailsScreen';

type TasksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const TasksScreen: React.FC = () => {
  const navigation = useNavigation<TasksScreenNavigationProp>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Temporary tasks
  // Baad mein ye data state/API/Redux se aa sakta hai.
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Build Appointment Module',
      project: 'Medicore',
      duration: '1h 30m',
      status: 'running',
    },
    {
      id: '2',
      name: 'Learn React Native',
      project: 'Learning',
      duration: '2h',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Update Portfolio',
      project: 'Freelancing',
      duration: '1h',
      status: 'completed',
    },
    {
      id: '4',
      name: 'Fix Authentication',
      project: 'Medicore',
      duration: '45m',
      status: 'paused',
    },
    {
      id: '5',
      name: 'Prepare Project Documentation',
      project: 'Personal',
      duration: '1h 15m',
      status: 'expired',
    },
  ]);

  const filters = [
    'All',
    'Today',
    'Pending',
    'Completed',
  ];

  /*
   * Search + Filter
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
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
    <View style={styles.container}>
      <SafeAreaView
        edges={['top']}
        style={styles.safeArea}
      >

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
              <Text style={styles.addIcon}>
                +
              </Text>
            </TouchableOpacity>
          </View>


          <View style={styles.searchContainer}>
            <AppInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search tasks..."
              icon={<Icon name="search" size={20} color="rgba(255,255,255,0.25)" />}
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
            {filters.map((item) => {
              const active = filter === item;

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setFilter(item)}
                  activeOpacity={0.8}
                  style={[
                    styles.filterButton,
                    active &&
                      styles.filterButtonActive,
                  ]}
                >
                  <AppText
                    style={[
                      styles.filterText,
                      active &&
                        styles.filterTextActive,
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
                <Text style={styles.emptyIcon}>
                  ✓
                </Text>
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
                <AppText style={styles.createTaskText}>
                  Create Task
                </AppText>
              </TouchableOpacity>
            </View>
          ) : (
            /* ================================== */
            /* TASKS */
            /* ================================== */

            <View style={styles.taskList}>
              {filteredTasks.map((task) => {
                const completed =
                  task.status === 'completed';

                return (
                  <TouchableOpacity
                    key={task.id}
                    onPress={() =>
                      handleTaskDetails(task)
                    }
                    activeOpacity={0.8}
                    style={styles.taskCard}
                  >
                    <View style={styles.taskRow}>
                      {/* LEFT */}
                      <View style={styles.taskLeft}>
                        {/* Status */}
                        <View
                          style={[
                            styles.statusBadge,
                            getStatusBadgeStyle(
                              task.status
                            ),
                          ]}
                        >
                          <AppText
                            style={[
                              styles.statusText,
                              getStatusTextStyle(
                                task.status
                              ),
                            ]}
                          >
                            {task.status}
                          </AppText>
                        </View>

                        {/* Task Name */}
                        <AppText
                          numberOfLines={1}
                          style={[
                            styles.taskName,
                            completed &&
                              styles.completedTask,
                          ]}
                        >
                          {task.name}
                        </AppText>

                        {/* Project */}
                        <AppText variant="caption" style={styles.project}>
                          {task.project}
                        </AppText>
                      </View>

                      {/* RIGHT */}
                      <View style={styles.taskRight}>
                        <AppText variant="subheading" style={styles.duration}>
                          {task.duration}
                        </AppText>

                        <AppText variant="caption" style={styles.date}>
                          Today
                        </AppText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

/* ============================================== */
/* STATUS BADGE BACKGROUND                        */
/* ============================================== */

const getStatusBadgeStyle = (
  status: Task['status']
) => {
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

/* ============================================== */
/* STATUS TEXT                                    */
/* ============================================== */

const getStatusTextStyle = (
  status: Task['status']
) => {
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
    flex: 1,
    marginRight: 12,
  },


  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 7,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  /* Pending */

  pendingBadge: {
    backgroundColor: 'rgba(251,191,36,0.1)',
  },

  pendingText: {
    color: '#fbbf24',
  },


  runningBadge: {
    backgroundColor: 'rgba(79,124,255,0.1)',
  },

  runningText: {
    color: '#4f7cff',
  },



  completedBadge: {
    backgroundColor: 'rgba(52,211,153,0.1)',
  },

  completedText: {
    color: '#34d399',
  },



  pausedBadge: {
    backgroundColor: 'rgba(249,115,22,0.1)',
  },

  pausedText: {
    color: '#f97316',
  },



  expiredBadge: {
    backgroundColor: 'rgba(248,113,113,0.1)',
  },

  expiredText: {
    color: '#f87171',
  },



  taskName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },

  completedTask: {
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'line-through',
  },

  project: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
  },


  taskRight: {
    alignItems: 'flex-end',
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
    marginTop: 5,
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