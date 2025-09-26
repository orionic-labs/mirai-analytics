// pages/Home.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MarketOverview } from '@/components/financial/MarketOverview';
import { AIInsights } from '@/components/financial/AIInsights';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, TrendingDown, Bot } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '@/navigation/MainTabs';

type Nav = BottomTabNavigationProp<MainTabParamList, 'Home'>;

export const Home: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const marketSentiment = 'bullish';

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 120,
        }}>
        <View className="gap-6">
          <View className="bg-muted/30 rounded-lg p-6">
            <Text className="text-foreground mb-2 text-2xl font-bold">Good morning, Investor</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-muted-foreground text-sm">Market sentiment:</Text>
              <View className="flex-row items-center gap-1">
                {marketSentiment === 'bullish' ? (
                  <TrendingUp size={12} className="text-green-500" />
                ) : (
                  <TrendingDown size={12} className="text-red-500" />
                )}
                <Badge
                  className={cn(
                    marketSentiment === 'bullish'
                      ? 'border-green-500/50 bg-green-500/10 text-green-500'
                      : 'border-red-500/50 bg-red-500/10 text-red-500'
                  )}
                  label={marketSentiment}
                />
              </View>
            </View>
          </View>

          <MarketOverview />
          <AIInsights />
        </View>
      </ScrollView>

      <Button
        onPress={() => navigation.navigate('Assistant')}
        size="icon"
        className="bg-primary absolute h-14 w-14 rounded-full shadow-lg"
        style={{ right: 16, bottom: insets.bottom + 20 }}>
        <Bot size={24} className="text-primary-foreground" />
      </Button>
    </View>
  );
};
