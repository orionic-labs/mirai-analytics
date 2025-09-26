import React from 'react';
import { Text, View, StyleSheet, ViewProps } from 'react-native';

type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: Variant;
}

export function Badge({ label, variant = 'default', style, ...props }: BadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant], style]} {...props}>
      <Text style={[styles.text, variantTextStyles[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 9999, // fully rounded
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

const variantStyles: Record<Variant, object> = {
  default: {
    backgroundColor: '#4f46e5', // primary
    borderColor: '#4f46e5',
  },
  secondary: {
    backgroundColor: '#e5e7eb', // gray-200
    borderColor: '#e5e7eb',
  },
  destructive: {
    backgroundColor: '#ef4444', // red
    borderColor: '#ef4444',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
};

const variantTextStyles: Record<Variant, object> = {
  default: { color: '#fff' },
  secondary: { color: '#111' },
  destructive: { color: '#fff' },
  outline: { color: '#000' },
};
