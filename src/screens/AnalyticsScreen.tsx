import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnalyticsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Track your productivity</Text>
          </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>THIS WEEK</Text>
          <View style={styles.chartContainer}>
            {[
              { label: 'M', height: 40, active: false },
              { label: 'T', height: 60, active: false },
              { label: 'W', height: 30, active: false },
              { label: 'T', height: 80, active: true },
              { label: 'F', height: 65, active: false },
              { label: 'S', height: 45, active: false },
              { label: 'S', height: 20, active: false },
            ].map((bar, index) => (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    { height: `${bar.height}%` },
                    bar.active && styles.barActive,
                  ]}
                />
                <Text style={styles.barLabel}>{bar.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.statsRow}>
            {[
              ['18h 45m', 'Total'],
              ['42', 'Sessions'],
              ['87%', 'Rate'],
            ].map(([value, label], index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Productivity Summary</Text>
          <Text style={styles.summaryText}>
            You've completed 42 focus sessions this week, totaling 18 hours and 45 minutes of focused work.
          </Text>
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
  },
  header: {
    marginBottom: 24,
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
  statsCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
  },
  statsLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 2,
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 96,
    marginBottom: 12,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barActive: {
    backgroundColor: '#4f7cff',
  },
  barLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 20,
  },
});

export default AnalyticsScreen;
