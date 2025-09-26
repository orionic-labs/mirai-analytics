import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, Clock, ExternalLink, Sparkles } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  relevance: 'portfolio' | 'sector' | 'general';
  priceChange?: string;
  trend?: 'up' | 'down';
}

const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'AI Chip Demand Soars as Tech Giants Expand Infrastructure',
    summary:
      'Major cloud providers announce $50B investment in AI infrastructure, driving semiconductor stocks higher.',
    source: 'TechCrunch',
    timestamp: '1h ago',
    impact: 'high',
    relevance: 'portfolio',
    priceChange: '+3.2%',
    trend: 'up',
  },
  {
    id: '2',
    title: 'Federal Reserve Maintains Hawkish Stance on Interest Rates',
    summary:
      'Fed officials signal potential for additional rate hikes amid persistent inflation concerns.',
    source: 'Bloomberg',
    timestamp: '2h ago',
    impact: 'high',
    relevance: 'general',
    priceChange: '-1.8%',
    trend: 'down',
  },
  {
    id: '3',
    title: 'Green Energy Stocks Rally on New Climate Legislation',
    summary:
      'Renewable energy companies surge following passage of expanded clean energy incentives.',
    source: 'Reuters',
    timestamp: '3h ago',
    impact: 'medium',
    relevance: 'sector',
    priceChange: '+2.7%',
    trend: 'up',
  },
];

const aiTips = [
  {
    id: '1',
    title: 'Diversification Opportunity',
    description: 'Consider reducing tech exposure by 5% and increasing healthcare allocation.',
    confidence: 78,
    action: 'Rebalance',
  },
  {
    id: '2',
    title: 'Defensive Play',
    description: 'Utilities showing strong momentum. Good hedge against market volatility.',
    confidence: 85,
    action: 'Consider',
  },
];

/* --- local segmented control (pure RN, no nav) --- */
function Segmented({
  value,
  onChange,
}: {
  value: 'latest' | 'portfolio' | 'ai-tips';
  onChange: (v: 'latest' | 'portfolio' | 'ai-tips') => void;
}) {
  return (
    <View className="bg-muted h-10 flex-row items-center rounded-md p-1">
      {(
        [
          { key: 'latest', label: 'Latest News' },
          { key: 'portfolio', label: 'Portfolio Impact' },
          { key: 'ai-tips', label: 'AI Tips' },
        ] as const
      ).map((opt) => {
        const active = value === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            className={cn(
              'flex-1 items-center justify-center rounded-sm px-3 py-1.5',
              active && 'bg-background shadow-sm'
            )}>
            <Text
              className={cn(
                'text-sm font-medium',
                active ? 'text-foreground' : 'text-muted-foreground'
              )}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
/* ----------------------------------------------- */

export const News: React.FC = () => {
  const [tab, setTab] = useState<'latest' | 'portfolio' | 'ai-tips'>('latest');

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500 border-red-300';
      case 'medium':
        return 'text-yellow-500 border-yellow-300';
      case 'low':
        return 'text-green-500 border-green-300';
      default:
        return 'text-gray-500';
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'portfolio':
        return 'text-purple-500 border-purple-300';
      case 'sector':
        return 'text-blue-500 border-blue-300';
      default:
        return 'text-gray-500 border-gray-300';
    }
  };

  return (
    <ScrollView className="px-4 pb-24 pt-4">
      <View className="gap-5">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold">Market News</Text>
          <Button variant="outline" size="sm">
            <ExternalLink size={16} className="mr-2" />
            <Text>Sources</Text>
          </Button>
        </View>

        {/* Tabs (local segmented) */}
        <Segmented value={tab} onChange={setTab} />

        {/* Latest News */}
        {tab === 'latest' && (
          <View className="mt-3 gap-4">
            {newsData.map((item) => (
              <Card key={item.id} className="border p-4">
                <View className="gap-3">
                  <View className="flex-row items-start justify-between gap-3">
                    <Text className="flex-1 text-sm font-semibold leading-5">{item.title}</Text>
                    {item.priceChange && (
                      <View
                        className={cn(
                          'flex-row items-center gap-1 text-sm font-medium',
                          item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        )}>
                        <TrendingUp
                          size={12}
                          className={cn(item.trend === 'down' && 'rotate-180')}
                        />
                        <Text>{item.priceChange}</Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-muted-foreground text-sm leading-5">{item.summary}</Text>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-muted-foreground text-xs">{item.source}</Text>
                      <Text className="text-muted-foreground text-xs">•</Text>
                      <View className="flex-row items-center gap-1">
                        <Clock size={12} />
                        <Text className="text-muted-foreground text-xs">{item.timestamp}</Text>
                      </View>
                    </View>

                    <View className="flex-row gap-2">
                      <Badge
                        className={cn('text-xs', getRelevanceColor(item.relevance))}
                        label={item.relevance}
                      />
                      <Badge
                        className={cn('text-xs', getImpactColor(item.impact))}
                        label={`${item.impact} impact`}
                      />
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Portfolio Impact */}
        {tab === 'portfolio' && (
          <View className="mt-3 gap-4">
            {newsData
              .filter((item) => item.relevance === 'portfolio')
              .map((item) => (
                <Card key={item.id} className="border border-purple-300 bg-purple-50 p-4">
                  <View className="gap-3">
                    <View className="flex-row items-start justify-between gap-3">
                      <Text className="flex-1 text-sm font-semibold leading-5">{item.title}</Text>
                      <Badge
                        className="border-purple-300 text-purple-500"
                        label="Portfolio Impact"
                      />
                    </View>
                    <Text className="text-muted-foreground text-sm leading-5">{item.summary}</Text>
                    <Button variant="outline" size="sm" className="w-full">
                      <Text>View Impact Analysis</Text>
                    </Button>
                  </View>
                </Card>
              ))}
          </View>
        )}

        {/* AI Tips */}
        {tab === 'ai-tips' && (
          <View className="mt-3 gap-4">
            {aiTips.map((tip) => (
              <Card key={tip.id} className="border p-4">
                <View className="gap-3">
                  <View className="flex-row gap-3">
                    <Sparkles size={20} className="mt-0.5 text-purple-500" />
                    <View className="flex-1">
                      <Text className="mb-1 text-sm font-semibold leading-5">{tip.title}</Text>
                      <Text className="text-muted-foreground mb-2 text-sm leading-5">
                        {tip.description}
                      </Text>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-muted-foreground text-xs">Confidence:</Text>
                          <View className="flex-row items-center gap-1">
                            <View className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
                              <View
                                className="bg-primary h-full"
                                style={{ width: `${tip.confidence}%` }}
                              />
                            </View>
                            <Text className="text-primary text-xs font-medium">
                              {tip.confidence}%
                            </Text>
                          </View>
                        </View>

                        <Button size="sm" className="bg-primary">
                          <Text className="text-primary-foreground">{tip.action}</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
