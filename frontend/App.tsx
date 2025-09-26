// App.tsx
import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

import { Home } from '@/pages/Home';
import { News } from '@/pages/News';
import { Portfolio } from '@/pages/Portfolio';
import { Assistant } from '@/pages/Assistant';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

import { Home as HomeIcon, TrendingUp, PieChart, Bot } from 'lucide-react-native';
import './global.css';

type Tab = 'Home' | 'News' | 'Portfolio' | 'Assistant';
type MainTabParamList = Record<Tab, undefined>;

interface UserProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  sectors: string[];
  notifications: { push: boolean; calls: boolean; dailyBriefing: boolean };
}

const STORAGE = {
  onboarded: 'onboarded_v1',
  profile: 'user_profile_v1',
};

const Stack = createNativeStackNavigator();
const TabNav = createBottomTabNavigator<MainTabParamList>();
const queryClient = new QueryClient();

/** Tabs rendered after onboarding */
function MainTabs() {
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        position: 'absolute',
        height: 64,
        borderTopWidth: 1,
      },
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#6b7280',
    }),
    []
  );

  return (
    <TabNav.Navigator screenOptions={screenOptions}>
      <TabNav.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon size={20} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, marginTop: 4, fontSize: 12, fontWeight: '600' }}>Home</Text>
          ),
        }}
      />
      <TabNav.Screen
        name="News"
        component={News}
        options={{
          tabBarIcon: ({ color }) => <TrendingUp size={20} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, marginTop: 4, fontSize: 12, fontWeight: '600' }}>News</Text>
          ),
        }}
      />
      <TabNav.Screen
        name="Portfolio"
        component={Portfolio}
        options={{
          tabBarIcon: ({ color }) => <PieChart size={20} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, marginTop: 4, fontSize: 12, fontWeight: '600' }}>Portfolio</Text>
          ),
        }}
      />
      <TabNav.Screen
        name="Assistant"
        component={Assistant}
        options={{
          tabBarIcon: ({ color }) => <Bot size={20} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, marginTop: 4, fontSize: 12, fontWeight: '600' }}>AI</Text>
          ),
        }}
      />
    </TabNav.Navigator>
  );
}

export default function App() {
  const [hydrated, setHydrated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // hydrate onboarding state once
  useEffect(() => {
    (async () => {
      try {
        const [onb, profileJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE.onboarded),
          AsyncStorage.getItem(STORAGE.profile),
        ]);
        setIsOnboarded(onb === '1');
        setUserProfile(profileJson ? JSON.parse(profileJson) : null);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const handleOnboardingComplete = useCallback(async (profile: UserProfile) => {
    await AsyncStorage.multiSet([
      [STORAGE.onboarded, '1'],
      [STORAGE.profile, JSON.stringify(profile)],
    ]);
    setUserProfile(profile);
    setIsOnboarded(true);
  }, []);

  // show a simple splash while hydrating
  if (!hydrated) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
            <StatusBar style="auto" />
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* ONE SafeAreaView for the whole app (top only) */}
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isOnboarded ? (
                  <Stack.Screen name="Main" component={MainTabs} />
                ) : (
                  <Stack.Screen name="Onboarding">
                    {() => <OnboardingFlow onComplete={handleOnboardingComplete} />}
                  </Stack.Screen>
                )}
              </Stack.Navigator>
            </NavigationContainer>

            {/* keep non-navigation stuff OUTSIDE the container */}
            <Toast />
            <StatusBar style="auto" />
          </QueryClientProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
