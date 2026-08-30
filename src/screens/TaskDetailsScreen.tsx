import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type TaskDetailsRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

export type TaskStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'paused'
  | 'expired';

export interface Task {
  id: string;
  name: string;
  project: string;
  duration: string;
  status: TaskStatus;
  durationMinutes?: number;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  startedAt?: string;
  expectedEnd?: string;
}

// Navigation wrapper component
const TaskDetailsScreenWrapper: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TaskDetailsRouteProp>();
  const { task } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFocus = () => {
    console.log('Focus task:', task.id);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete task:', task.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleComplete = () => {
    console.log('Complete task:', task.id);
    navigation.goBack();
  };

  const handleEdit = () => {
    console.log('Edit task:', task.id);
    // Navigate to edit screen if needed
  };

  return (
    <TaskDetailsScreen
      task={task}
      onBack={handleBack}
      onFocus={handleFocus}
      onDelete={handleDelete}
      onComplete={handleComplete}
      onEdit={handleEdit}
    />
  );
};

interface TaskDetailsScreenProps {
  task: Task;

  timerDisplay?: string;
  timerProgress?: number;

  onBack: () => void;
  onFocus: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onEdit?: () => void;
}

const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({
  task,
  timerDisplay = '01:24:37',
  timerProgress = 82,
  onBack,
  onFocus,
  onDelete,
  onComplete,
  onEdit,
}) => {
  const isActive =
    task.status === 'running' ||
    task.status === 'paused';

  const isCompleted =
    task.status === 'completed';

  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={['top']}
        style={styles.safeArea}
      >
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <View style={styles.header}>
          {/* Back */}
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.8}
            style={styles.headerButton}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.headerTitle}>
            Task Details
          </Text>

          {/* Edit */}
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.8}
            style={styles.headerButton}
          >
            <Icon name="create-outline" size={20} color="rgba(255,255,255,0.45)" />
          </TouchableOpacity>
        </View>

        {/* ========================================= */}
        {/* CONTENT */}
        {/* ========================================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* ========================================= */}
          {/* TASK MAIN CARD */}
          {/* ========================================= */}

          <View style={styles.mainCard}>
            <View style={styles.taskTopRow}>
              {/* Task Information */}
              <View style={styles.taskInformation}>
                <Text
                  style={styles.taskName}
                  numberOfLines={4}
                >
                  {task.name}
                </Text>

                <Text style={styles.projectName}>
                  {task.project}
                </Text>
              </View>

              {/* Status */}
              <View
                style={[
                  styles.statusBadge,
                  getStatusBadgeStyle(task.status),
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    getStatusTextStyle(task.status),
                  ]}
                >
                  {task.status}
                </Text>
              </View>
            </View>

            {/* ===================================== */}
            {/* TIMER SECTION                         */}
            {/* ===================================== */}

            {isActive && (
              <View style={styles.timerSection}>
                <Text style={styles.timerDisplay}>
                  {timerDisplay}
                </Text>

                <View style={styles.progressHeader}>
                  <Text style={styles.originalDuration}>
                    Original: {task.duration}
                  </Text>

                  <Text style={styles.progressPercentage}>
                    {timerProgress}%
                  </Text>
                </View>

                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          Math.max(timerProgress, 0),
                          100,
                        )}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Completed message */}
            {isCompleted && (
              <View style={styles.completedMessage}>
                <View style={styles.completedIcon}>
                  <Icon name="checkmark" size={22} color="#34d399" />
                </View>

                <View>
                  <Text style={styles.completedTitle}>
                    Task Completed
                  </Text>

                  <Text style={styles.completedSubtitle}>
                    Great work! You completed this task.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* ========================================= */}
          {/* DESCRIPTION                               */}
          {/* ========================================= */}

          {task.description ? (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>
                DESCRIPTION
              </Text>

              <Text style={styles.description}>
                {task.description}
              </Text>
            </View>
          ) : null}

          {/* ========================================= */}
          {/* SESSION INFO                              */}
          {/* ========================================= */}

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              SESSION INFO
            </Text>

            <View style={styles.infoContainer}>
              <InfoRow
                label="Duration"
                value={task.duration}
              />

              <InfoRow
                label="Started"
                value={task.startedAt || '8:30 PM'}
              />

              <InfoRow
                label="Expected End"
                value={
                  task.expectedEnd || '10:00 PM'
                }
              />

              <InfoRow
                label="Priority"
                value={
                  capitalize(task.priority || 'medium')
                }
              />

              <InfoRow
                label="Status"
                value={capitalize(task.status)}
              />
            </View>
          </View>

          {/* ========================================= */}
          {/* ACTIONS                                   */}
          {/* ========================================= */}

          <View style={styles.actions}>
            {/* Running / Paused */}
            {isActive && (
              <TouchableOpacity
                onPress={onFocus}
                activeOpacity={0.8}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  ▶ Resume Focus Mode
                </Text>
              </TouchableOpacity>
            )}

            {/* Pending */}
            {task.status === 'pending' && (
              <TouchableOpacity
                onPress={onFocus}
                activeOpacity={0.8}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  ▶ Start Focus
                </Text>
              </TouchableOpacity>
            )}

            {/* Complete */}
            {!isCompleted && (
              <TouchableOpacity
                onPress={onComplete}
                activeOpacity={0.8}
                style={styles.completeButton}
              >
                <Text style={styles.completeButtonText}>
                  ✓ Mark Complete
                </Text>
              </TouchableOpacity>
            )}

            {/* Delete */}
            <TouchableOpacity
              onPress={onEdit}
              activeOpacity={0.8}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>
                Delete Task
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

/* ================================================= */
/* INFO ROW                                          */
/* ================================================= */

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
}) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text
        style={styles.infoValue}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
};

/* ================================================= */
/* CAPITALIZE                                        */
/* ================================================= */

const capitalize = (value: string) => {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
};

/* ================================================= */
/* STATUS BADGE STYLE                                */
/* ================================================= */

const getStatusBadgeStyle = (
  status: TaskStatus,
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

/* ================================================= */
/* STATUS TEXT STYLE                                 */
/* ================================================= */

const getStatusTextStyle = (
  status: TaskStatus,
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

/* ================================================= */
/* STYLES                                            */
/* ================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },

  safeArea: {
    flex: 1,
  },

  /* ============================================= */
  /* HEADER                                        */
  /* ============================================= */

  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 14,
  },

  /* ============================================= */
  /* CONTENT                                       */
  /* ============================================= */

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
  },

  /* ============================================= */
  /* MAIN CARD                                     */
  /* ============================================= */

  mainCard: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },

  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  taskInformation: {
    flex: 1,
    marginRight: 12,
  },

  taskName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 29,
    marginBottom: 5,
  },

  projectName: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 14,
  },

  /* ============================================= */
  /* STATUS                                        */
  /* ============================================= */

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  pendingBadge: {
    backgroundColor: 'rgba(251,191,36,0.10)',
    borderColor: 'rgba(251,191,36,0.20)',
  },

  pendingText: {
    color: '#fbbf24',
  },

  runningBadge: {
    backgroundColor: 'rgba(79,124,255,0.10)',
    borderColor: 'rgba(79,124,255,0.20)',
  },

  runningText: {
    color: '#4f7cff',
  },

  completedBadge: {
    backgroundColor: 'rgba(52,211,153,0.10)',
    borderColor: 'rgba(52,211,153,0.20)',
  },

  completedText: {
    color: '#34d399',
  },

  pausedBadge: {
    backgroundColor: 'rgba(249,115,22,0.10)',
    borderColor: 'rgba(249,115,22,0.20)',
  },

  pausedText: {
    color: '#f97316',
  },

  expiredBadge: {
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderColor: 'rgba(248,113,113,0.20)',
  },

  expiredText: {
    color: '#f87171',
  },

  /* ============================================= */
  /* TIMER                                         */
  /* ============================================= */

  timerSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },

  timerDisplay: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 14,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  originalDuration: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
  },

  progressPercentage: {
    color: '#4f7cff',
    fontSize: 12,
    fontWeight: '500',
  },

  progressBackground: {
    height: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#4f7cff',
  },

  /* ============================================= */
  /* COMPLETED MESSAGE                             */
  /* ============================================= */

  completedMessage: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  completedIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(52,211,153,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  completedTitle: {
    color: '#34d399',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },

  completedSubtitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },

  /* ============================================= */
  /* GENERIC CARD                                  */
  /* ============================================= */

  card: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },

  /* ============================================= */
  /* SECTION LABEL                                 */
  /* ============================================= */

  sectionLabel: {
    color: 'rgba(255,255,255,0.30)',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 18,
  },

  /* ============================================= */
  /* DESCRIPTION                                   */
  /* ============================================= */

  description: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    lineHeight: 22,
  },

  /* ============================================= */
  /* SESSION INFO                                  */
  /* ============================================= */

  infoContainer: {
    gap: 15,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoLabel: {
    color: 'rgba(255,255,255,0.30)',
    fontSize: 14,
  },

  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '55%',
  },

  /* ============================================= */
  /* ACTIONS                                       */
  /* ============================================= */

  actions: {
    gap: 10,
    marginTop: 2,
  },

  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#4f7cff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  completeButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(52,211,153,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  completeButtonText: {
    color: '#34d399',
    fontSize: 15,
    fontWeight: '600',
  },

  deleteButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '500',
  },
});

export { TaskDetailsScreen };
export default TaskDetailsScreenWrapper;