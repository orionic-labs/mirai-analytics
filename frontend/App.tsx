// App.tsx
import { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ElevenLabsProvider } from '@elevenlabs/react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

import { MainTabs } from '@/navigation/MainTabs';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

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
const queryClient = new QueryClient();

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
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {/* ONE SafeAreaView for the whole app (top only) */}
      <SafeAreaView style={{ flex: 1 }}>
        <ElevenLabsProvider>
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
        </ElevenLabsProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
