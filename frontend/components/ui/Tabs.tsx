// components/ui/Tabs.tsx
import * as React from 'react';
import { View, Text, Pressable, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

type TabsCtx = { value: string; setValue: (v: string) => void };

// use a uniquely named local context to avoid any resolver weirdness
const LocalTabsCtx = React.createContext<TabsCtx | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string; // optional controlled mode
  onValueChange?: (v: string) => void; // callback in controlled/uncontrolled
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;

  const set = React.useCallback(
    (v: string) => {
      onValueChange?.(v);
      if (value === undefined) setInternal(v);
    },
    [onValueChange, value]
  );

  const ctx = React.useMemo(() => ({ value: current, setValue: set }), [current, set]);

  return (
    <LocalTabsCtx.Provider value={ctx}>
      <View className={className}>{children}</View>
    </LocalTabsCtx.Provider>
  );
};
Tabs.displayName = 'Tabs';

export const TabsList: React.FC<ViewProps> = ({ className, children, ...rest }) => {
  return (
    <View
      className={cn('bg-muted h-10 flex-row items-center justify-center rounded-md p-1', className)}
      {...rest}>
      {children}
    </View>
  );
};
TabsList.displayName = 'TabsList';

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  const ctx = React.useContext(LocalTabsCtx);

  // Hard guard: if context is ever missing, render a passive button instead of crashing.
  if (!ctx) {
    return (
      <Pressable
        className={cn('flex-1 items-center justify-center rounded-sm px-3 py-1.5', className)}>
        <Text className="text-muted-foreground text-sm font-medium">{children}</Text>
      </Pressable>
    );
  }

  const isActive = ctx.value === value;

  return (
    <Pressable
      onPress={() => ctx.setValue(value)}
      className={cn(
        'flex-1 items-center justify-center rounded-sm px-3 py-1.5',
        isActive ? 'bg-background shadow-sm' : 'text-muted-foreground',
        className
      )}>
      <Text
        className={cn(
          'text-sm font-medium',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}>
        {children}
      </Text>
    </Pressable>
  );
};
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const ctx = React.useContext(LocalTabsCtx);

  // If context missing, render nothing (fail-safe)
  if (!ctx || ctx.value !== value) return null;

  return <View className={cn('mt-2', className)}>{children}</View>;
};
TabsContent.displayName = 'TabsContent';
