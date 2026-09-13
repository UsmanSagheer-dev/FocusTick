import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TodayFocusProps {
  completed: number;
  goalPercent: number;
  totalFocusTime: string; // formatted string like "3h 25m"
  dailyGoal: string; // formatted string like "5h"
}

const TodayFocus = ({ completed, goalPercent, totalFocusTime, dailyGoal }: TodayFocusProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.label}>TODAY'S FOCUS</Text>

            <Text style={styles.focusTime}>{totalFocusTime}</Text>

            <Text style={styles.sessions}>{completed} sessions completed</Text>
          </View>

          {/* Progress Circle */}
          <View style={styles.circle}>
            <Text style={styles.circleText}>{goalPercent}%</Text>
          </View>
        </View>

        {/* Daily Goal */}
        <View>
          <View style={styles.goalHeader}>
            <Text style={styles.goalText}>Daily Goal: {dailyGoal}</Text>

            <Text style={styles.percent}>{goalPercent}%</Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progress,
                {
                  width: `${goalPercent}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default TodayFocus;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: 'rgba(251, 251, 251, 0.89)',
    letterSpacing: 2,
    marginBottom: 4,
  },

  focusTime: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },

  sessions: {
    fontSize: 13,
    color: 'rgba(251, 251, 251, 0.66)',
    marginTop: 4,
  },

  circle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 6,
    borderColor: '#4f7cff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  goalText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.68)',
  },

  percent: {
    fontSize: 12,
    color: '#4f7cff',
  },

  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    backgroundColor: '#4f7cff',
    borderRadius: 10,
  },
});