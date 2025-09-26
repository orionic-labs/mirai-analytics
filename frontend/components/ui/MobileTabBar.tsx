import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, TrendingUp, PieChart, Bot } from 'lucide-react-native';

const ICONS: Record<string, React.ComponentType<{ color?: string; size?: number }>> = {
  Home: HomeIcon,
  News: TrendingUp,
  Portfolio: PieChart,
  Assistant: Bot,
};

export const MobileTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View className="bg-card border-border absolute bottom-0 left-0 right-0 z-50 border-t">
      <View className="h-16 flex-row items-center justify-around px-4">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const Icon = ICONS[route.name] ?? HomeIcon;
          const label = descriptors[route.key]?.options.title ?? route.name;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center justify-center">
              <View className={`items-center ${isFocused ? 'scale-110' : ''}`}>
                <Icon size={20} color={isFocused ? '#2563eb' : '#6b7280'} />
              </View>
              <Text
                className={`mt-1 text-xs font-medium ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
