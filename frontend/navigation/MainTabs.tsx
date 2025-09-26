import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '@/pages/Home';
import { News } from '@/pages/News';
import { Portfolio } from '@/pages/Portfolio';
import { Assistant } from '@/pages/Assistant';
import { Home as HomeIcon, TrendingUp, PieChart, Bot } from 'lucide-react-native';

export type MainTabParamList = {
  Home: undefined;
  News: undefined;
  Portfolio: undefined;
  Assistant: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<
  keyof MainTabParamList,
  React.ComponentType<{ color?: string; size?: number }>
> = {
  Home: HomeIcon,
  News: TrendingUp,
  Portfolio: PieChart,
  Assistant: Bot,
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const Icon = ICONS[route.name as keyof MainTabParamList];
        return {
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: 'absolute',
            height: 64,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
          tabBarIcon: ({ color, size, focused }) => <Icon size={20} color={color} />,
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ marginTop: 4, fontSize: 12, fontWeight: '600', color }}>
              {route.name === 'Assistant' ? 'AI' : route.name}
            </Text>
          ),
        };
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="News" component={News} />
      <Tab.Screen name="Portfolio" component={Portfolio} />
      <Tab.Screen name="Assistant" component={Assistant} />
    </Tab.Navigator>
  );
}
