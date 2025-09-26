// pages/Home.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MarketOverview } from '@/components/financial/MarketOverview';
import { AIInsights } from '@/components/financial/AIInsights';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, TrendingDown, Bot } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '@/navigation/MainTabs';

type Nav = BottomTabNavigationProp<MainTabParamList, 'Home'>;

export const Home: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const marketSentiment: 'bullish' | 'bearish' = 'bullish';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 120,
        }}>
        <View style={styles.contentWrapper}>
          {/* Greeting + Sentiment */}
          <View style={styles.greetingCard}>
            <Text style={styles.greetingText}>Good morning, Investor</Text>
            <View style={styles.sentimentRow}>
              <Text style={styles.sentimentLabel}>Market sentiment:</Text>
              <View style={styles.sentimentValue}>
                {marketSentiment === 'bullish' ? (
                  <TrendingUp size={12} color="green" />
                ) : (
                  <TrendingDown size={12} color="red" />
                )}
                <Badge
                  label={marketSentiment}
                  style={marketSentiment === 'bullish' ? styles.badgeBullish : styles.badgeBearish}
                />
              </View>
            </View>
          </View>

          {/* Sections */}
          <MarketOverview />
          <AIInsights />
        </View>
      </ScrollView>

      {/* Floating Assistant Button */}
      <Button
        onPress={() => navigation.navigate('Assistant')}
        size="icon"
        style={[styles.fab, { bottom: insets.bottom + 20, right: 16 }]}>
        <Bot size={24} color="#fff" />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { gap: 24 },
  greetingCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 20,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentimentLabel: { fontSize: 14, color: '#666' },
  sentimentValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeBullish: {
    borderColor: 'rgba(34,197,94,0.5)',
    backgroundColor: 'rgba(34,197,94,0.1)',
    color: 'green',
  },
  badgeBearish: {
    borderColor: 'rgba(239,68,68,0.5)',
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: 'red',
  },
  fab: {
    position: 'absolute',
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
