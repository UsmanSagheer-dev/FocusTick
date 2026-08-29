import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';

interface OnboardingScreenProps {
  onOnboardingComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onOnboardingComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const blinkAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, [blinkAnim]);

  const slides = [
    {
      title: 'Turn Tasks Into\nFocus Sessions',
      description: 'Create a task, set your time, and start working without distractions.',
    },
    {
      title: 'Stay Focused',
      description: 'Use distraction-free full-screen focus mode while you work.',
    },
    {
      title: 'Understand Your\nProductivity',
      description: 'Track your time and see where your working hours actually go.',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onOnboardingComplete();
    }
  };

  const handleSkip = () => {
    onOnboardingComplete();
  };

  const renderIllustration = () => {
    switch (currentSlide) {
      case 0:
        return (
          <View style={styles.illustrationContainer}>
            {/* Task Card */}
            <View style={[styles.card, styles.taskCard]}>
              <View style={styles.cardLine} />
              <View style={[styles.cardLine, styles.cardLineLong]} />
              <View style={styles.taskIndicator}>
                <View style={styles.taskDot} />
                <View style={styles.taskProgress} />
              </View>
            </View>
            
            {/* Timer Card */}
            <View style={[styles.card, styles.timerCard]}>
              <Text style={styles.timerLabel}>FOCUS</Text>
              <Text style={styles.timerText}>25:00</Text>
              <View style={styles.timerProgressContainer}>
                <View style={styles.timerProgress} />
              </View>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.illustrationContainer}>
            <Animated.View style={[styles.outerRing, { opacity: blinkAnim }]}>
              <View style={styles.middleRing}>
                <View style={styles.innerRing}>
                  <View style={styles.timerContent}>
                    <Text style={styles.timerRingText}>01:24</Text>
                    <Text style={styles.timerRingSubtext}>remaining</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        );
      case 2:
        return (
          <View style={styles.illustrationContainer}>
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
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration and Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          {renderIllustration()}

          <View style={styles.textContainer}>
            <Text style={styles.title}>{slides[currentSlide].title}</Text>
            <Text style={styles.description}>{slides[currentSlide].description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentSlide(index)}
            style={[
              styles.paginationDot,
              index === currentSlide && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* CTA Button */}
      <TouchableOpacity onPress={handleNext} activeOpacity={0.9} style={styles.button}>
        <Text style={styles.buttonText}>
          {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 14,
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    width: '100%',
    height: 224,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  // Slide 1 - Task & Timer Cards
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    position: 'absolute',
  },
  taskCard: {
    left: 16,
    top: 32,
    width: 144,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  timerCard: {
    right: 16,
    top: 24,
    width: 144,
    borderWidth: 1,
    borderColor: 'rgba(79, 124, 255, 0.3)',
    alignItems: 'center',
  },
  cardLine: {
    height: 8,
    width: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  cardLineLong: {
    width: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  taskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4f7cff',
  },
  taskProgress: {
    height: 6,
    width: 48,
    backgroundColor: 'rgba(79, 124, 255, 0.4)',
    borderRadius: 3,
  },
  timerLabel: {
    fontSize: 10,
    color: 'rgba(79, 124, 255, 0.7)',
    letterSpacing: 2,
    marginBottom: 8,
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  timerProgressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    width: 0,
    backgroundColor: '#4f7cff',
    borderRadius: 2,
  },
  // Slide 2 - Timer Ring
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'rgba(79, 124, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: 'rgba(79, 124, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(79, 124, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    alignItems: 'center',
  },
  timerRingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerRingSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: 4,
  },
  // Slide 3 - Stats
  statsCard: {
    width: '100%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
  // Text Content
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    backgroundColor: '#4f7cff',
  },
  // Button
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#4f7cff',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default OnboardingScreen;
