import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  style,
  onPress,
  ...props
}: ButtonProps) {
  const isTextChild = typeof children === 'string';

  return (
    <Pressable
      style={[styles.base, sizeStyles[size], variantStyles[variant], style]}
      onPress={onPress}
      {...props}>
      {isTextChild ? (
        <Text style={[styles.textBase, sizeTextStyles[size], textVariantStyles[variant]]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  textBase: {
    fontSize: 14,
    fontWeight: '500',
  },
});

const sizeStyles: Record<Size, ViewStyle> = {
  default: { height: 36, paddingHorizontal: 16, paddingVertical: 8 },
  sm: { height: 32, borderRadius: 6, paddingHorizontal: 12 },
  lg: { height: 40, borderRadius: 6, paddingHorizontal: 20 },
  icon: { height: 36, width: 36, justifyContent: 'center', alignItems: 'center' },
};

const variantStyles: Record<Variant, ViewStyle> = {
  default: { backgroundColor: '#4f46e5' }, // primary
  destructive: { backgroundColor: '#ef4444' },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondary: { backgroundColor: '#e5e7eb' },
  ghost: { backgroundColor: 'transparent' },
  link: { backgroundColor: 'transparent' },
};

const textVariantStyles: Record<Variant, TextStyle> = {
  default: { color: '#fff' },
  destructive: { color: '#fff' },
  outline: { color: '#000' },
  secondary: { color: '#111' },
  ghost: { color: '#000' },
  link: { color: '#4f46e5', textDecorationLine: 'underline' },
};

const sizeTextStyles: Record<Size, TextStyle> = {
  default: { fontSize: 14 },
  sm: { fontSize: 12 },
  lg: { fontSize: 14 },
  icon: { fontSize: 0 }, // text usually not shown in icon-only buttons
};
