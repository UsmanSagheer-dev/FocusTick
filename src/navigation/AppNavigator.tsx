import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  TasksScreen,
  AnalyticsScreen,
  SettingsScreen,
  CreateTaskScreen,
  TaskDetailsScreen,
} from '../screens';
import FocusModeScreen from '../screens/FocusModeScreen';
import BottomNavigation from '../common/BottomNavigation';
import type { Task } from '../screens/TaskDetailsScreen';

export type RootStackParamList = {
  Main: undefined;
  CreateTask: { onTaskCreated?: (task: Task) => void } | undefined;
  TaskDetails: { task: Task };
  FocusMode: { task: Task };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen 
          name="CreateTask" 
          component={CreateTaskScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="FocusMode"
          component={FocusModeScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'home' | 'tasks' | 'analytics' | 'settings'>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
};

export default AppNavigator;