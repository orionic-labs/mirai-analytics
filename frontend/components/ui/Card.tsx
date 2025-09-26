import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { cn } from '@/lib/utils';

// Card wrapper
export const Card = React.forwardRef<
  View,
  {
    className?: string;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }
>(({ className = '', style, children }, ref) => {
  return (
    <View ref={ref} className={cn('bg-card rounded-lg border', className)} style={style}>
      {children}
    </View>
  );
});
Card.displayName = 'Card';

// CardHeader
export const CardHeader = React.forwardRef<
  View,
  {
    className?: string;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }
>(({ className = '', style, children }, ref) => {
  return (
    <View ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} style={style}>
      {children}
    </View>
  );
});
CardHeader.displayName = 'CardHeader';

// CardTitle
export const CardTitle = React.forwardRef<
  Text,
  {
    className?: string;
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
  }
>(({ className = '', style, children }, ref) => {
  return (
    <Text ref={ref} className={cn('text-2xl font-semibold', className)} style={style}>
      {children}
    </Text>
  );
});
CardTitle.displayName = 'CardTitle';

// CardDescription
export const CardDescription = React.forwardRef<
  Text,
  {
    className?: string;
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
  }
>(({ className = '', style, children }, ref) => {
  return (
    <Text ref={ref} className={cn('text-muted-foreground text-sm', className)} style={style}>
      {children}
    </Text>
  );
});
CardDescription.displayName = 'CardDescription';

// CardContent - ADDED
export const CardContent = React.forwardRef<
  View,
  {
    className?: string;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }
>(({ className = '', style, children }, ref) => {
  return (
    <View ref={ref} className={cn('p-6 pt-0', className)} style={style}>
      {children}
    </View>
  );
});
CardContent.displayName = 'CardContent';

// CardFooter - ADDED
export const CardFooter = React.forwardRef<
  View,
  {
    className?: string;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }
>(({ className = '', style, children }, ref) => {
  return (
    <View ref={ref} className={cn('flex flex-row items-center p-6 pt-0', className)} style={style}>
      {children}
    </View>
  );
});
CardFooter.displayName = 'CardFooter';
