import React from 'react';
import { View, Text } from 'react-native';
import { FinancialCard } from '@/components/ui/FinancialCard';

interface MarketData {
  symbol: string;
  value: string;
  change: string;
  changePercent: string;
  trend: 'up' | 'down' | 'neutral';
}

const marketData: MarketData[] = [
  {
    symbol: 'S&P 500',
    value: '4,547.32',
    change: '+23.45',
    changePercent: '+0.52%',
    trend: 'up',
  },
  {
    symbol: 'NASDAQ',
    value: '14,123.89',
    change: '-45.67',
    changePercent: '-0.32%',
    trend: 'down',
  },
  {
    symbol: 'BTC/USD',
    value: '$43,258',
    change: '+1,245',
    changePercent: '+2.97%',
    trend: 'up',
  },
  {
    symbol: 'EUR/USD',
    value: '1.0842',
    change: '-0.0023',
    changePercent: '-0.21%',
    trend: 'down',
  },
];

export const MarketOverview: React.FC = () => {
  return (
    <View className="space-y-4">
      <Text className="text-foreground mb-4 text-lg font-semibold">Market Overview</Text>

      {/* 2-column grid */}
      <View className="-mx-1 flex-row flex-wrap">
        {marketData.map((market, index) => (
          <View key={market.symbol} className="mb-3 w-1/2 px-1">
            <FinancialCard
              title={market.symbol}
              value={market.value}
              change={market.change}
              changePercent={market.changePercent}
              trend={market.trend}
              variant="compact"
              // you can animate later using react-native-reanimated
              style={{ opacity: 1 }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};
