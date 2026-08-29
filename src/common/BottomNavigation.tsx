import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

type TabType = 'home' | 'tasks' | 'analytics' | 'settings';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();
  
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: 'home-outline' },
    { id: 'tasks' as TabType, label: 'Tasks', icon: 'list-outline' },
    { id: 'analytics' as TabType, label: 'Analytics', icon: 'bar-chart-outline' },
    { id: 'settings' as TabType, label: 'Settings', icon: 'settings-outline' },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Icon 
              name={tab.icon}
              size={24} 
              color={isActive ? '#4f7cff' : 'rgba(255, 255, 255, 0.5)'} 
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  activeTabIcon: {
    opacity: 1,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#4f7cff',
  },
  tabLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  activeTabLabel: {
    color: '#4f7cff',
    fontWeight: '600',
  },
});

export default BottomNavigation;
