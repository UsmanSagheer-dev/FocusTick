import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Task } from '../../types';
import TaskCard from './TaskCard';

interface TodaysTasksProps {
  tasks: Task[];
  onTaskDetails: (task: Task) => void;
}

const TodaysTasks = ({ tasks, onTaskDetails }: TodaysTasksProps) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Today's Tasks</Text>

        <Text style={styles.taskCount}>{tasks.length} tasks</Text>
      </View>

      {/* Tasks */}
      <View style={styles.taskList}>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={onTaskDetails}
            showCheckbox={true}
          />
        ))}
      </View>
    </View>
  );
};

export default TodaysTasks;

const styles = StyleSheet.create({
  container: {},

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
});