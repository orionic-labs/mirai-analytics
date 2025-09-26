import { View, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface AIInsight {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  type: 'opportunity' | 'risk' | 'neutral';
  timestamp: string;
}

const aiInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Tech Rally Expected',
    summary:
      'AI chip demand surge suggests 12% upside potential for semiconductor stocks in Q1 2024.',
    confidence: 87,
    impact: 'high',
    type: 'opportunity',
    timestamp: '2h ago',
  },
  {
    id: '2',
    title: 'Oil Price Volatility',
    summary:
      'Geopolitical tensions may cause 15% oil price fluctuation. Consider defensive positioning.',
    confidence: 73,
    impact: 'medium',
    type: 'risk',
    timestamp: '4h ago',
  },
  {
    id: '3',
    title: 'Dollar Strength',
    summary:
      'Fed policy signals indicate continued USD strength. Emerging markets may face headwinds.',
    confidence: 81,
    impact: 'medium',
    type: 'neutral',
    timestamp: '6h ago',
  },
];

export const AIInsights: React.FC = () => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp size={16} color="#22C55E" />; // green-500
      case 'risk':
        return <AlertTriangle size={16} color="#EF4444" />; // red-500
      default:
        return <Sparkles size={16} color="#3B82F6" />; // blue-500
    }
  };

  return (
    <View className="space-y-4">
      {/* Header */}
      <View className="mb-4 flex-row items-center gap-2">
        <Sparkles size={20} color="#A855F7" />
        {/* purple-500 */}
        <Text className="text-lg font-semibold text-foreground">AI Insights</Text>
        <Badge variant="outline" className="border-purple-300 text-purple-500" label="Premium" />
      </View>

      {/* Insights */}
      <View>
        {aiInsights.map((insight, idx) => (
          <Card
            key={insight.id}
            className={cn(
              // ensure equal spacing between cards (works regardless of NativeWind space-y support)
              'mb-3 border p-4 shadow-none',
              idx === aiInsights.length - 1 && 'mb-0',
              insight.type === 'opportunity' && 'border-green-300 bg-green-50',
              insight.type === 'risk' && 'border-red-300 bg-red-50'
            )}>
            <View className="flex-row items-start gap-3">
              <View className="mt-1">{getTypeIcon(insight.type)}</View>

              <View className="min-w-0 flex-1">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="flex-1 truncate text-sm font-semibold">{insight.title}</Text>
                  <Text className="ml-2 text-xs text-gray-500">{insight.timestamp}</Text>
                </View>

                <Text className="mb-3 text-sm leading-relaxed text-gray-600">
                  {insight.summary}
                </Text>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-gray-500">Confidence:</Text>
                    <View className="flex-row items-center gap-1">
                      <View className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                        <View
                          className="h-full bg-primary"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </View>
                      <Text className="text-xs font-medium text-primary">
                        {insight.confidence}%
                      </Text>
                    </View>
                  </View>

                  <Badge
                    variant="outline"
                    className={cn('text-xs', getImpactColor(insight.impact))}
                    label={`${insight.impact} impact`}
                  />
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
};
