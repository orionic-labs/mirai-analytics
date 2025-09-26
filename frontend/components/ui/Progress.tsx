import React from 'react';
import { View } from 'react-native';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0–100
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <View className={cn('bg-secondary h-4 w-full overflow-hidden rounded-full', className)}>
      <View className="bg-primary h-full" style={{ width: `${value}%` }} />
    </View>
  );
}
