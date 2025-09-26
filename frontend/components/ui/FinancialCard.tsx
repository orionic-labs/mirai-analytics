import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface FinancialCardProps {
  title: string;
  value: string;
  change?: string;
  changePercent?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'premium' | 'compact';
  className?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  value,
  change,
  changePercent,
  trend = 'neutral',
  variant = 'default',
  className,
  style,
  children,
  onClick,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-success" />;
      case 'down':
        return <TrendingDown size={16} className="text-danger" />;
      default:
        return <Minus size={16} className="text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-danger';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
      <Card
        className={cn(
          'border border-border p-4',
          'transition-all duration-200', // keep hover-like styling simple
          variant === 'premium' && 'border-premium/30 bg-premium/5',
          variant === 'compact' && 'p-3',
          className
        )}
        style={style}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-sm font-medium text-muted-foreground">{title}</Text>
            <Text
              className={cn('mb-2 font-semibold', variant === 'compact' ? 'text-lg' : 'text-2xl')}>
              {value}
            </Text>

            {(change || changePercent) && (
              <View className="flex-row items-center gap-2">
                {getTrendIcon()}
                <View className="flex-row items-center gap-1">
                  {change && (
                    <Text className={cn('text-sm font-medium', getTrendColor())}>{change}</Text>
                  )}
                  {changePercent && (
                    <Text className={cn('text-sm', getTrendColor())}>({changePercent})</Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {children && <View className="ml-4">{children}</View>}
        </View>
      </Card>
    </TouchableOpacity>
  );
};
