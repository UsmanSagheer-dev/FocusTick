import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  TasksScreen,
  AnalyticsScreen,
  SettingsScreen,
  CreateTaskScreen,
} from '../screens';
import BottomNavigation from '../common/BottomNavigation';

interface Task {
  id: string;
  name: string;
  project: string;
  duration: string;
  status: 'pending' | 'running' | 'completed' | 'paused' | 'expired';
  durationMinutes: number;
}

export type RootStackParamList = {
  Main: undefined;
  CreateTask: { onTaskCreated?: (task: Task) => void } | undefined;
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