import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { ArrowRight, TrendingUp, Shield, Zap, Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  sectors: string[];
  notifications: {
    push: boolean;
    calls: boolean;
    dailyBriefing: boolean;
  };
}

interface OnboardingFlowProps {
  onComplete?: (profile: UserProfile) => void;
}

const riskProfiles = [
  {
    id: 'conservative',
    title: 'Conservative',
    description: 'Prefer stable returns with minimal risk',
    icon: Shield,
    color: 'text-success',
  },
  {
    id: 'moderate',
    title: 'Moderate',
    description: 'Balanced approach to risk and reward',
    icon: TrendingUp,
    color: 'text-primary',
  },
  {
    id: 'aggressive',
    title: 'Aggressive',
    description: 'Comfortable with high risk for potential high returns',
    icon: Zap,
    color: 'text-danger',
  },
] as const;

const sectors = [
  'Technology',
  'Healthcare',
  'Finance',
  'Energy',
  'Consumer Goods',
  'Real Estate',
  'Utilities',
  'Materials',
  'Industrials',
  'Crypto',
] as const;

const noTextShadow = {
  textShadowColor: 'transparent' as const,
  textShadowRadius: 0,
  textShadowOffset: { width: 0, height: 0 },
};

function SectorChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'rounded-full px-4 py-2',
        'border',
        selected ? 'bg-primary border-primary' : 'border-border bg-transparent'
      )}
      style={{ borderWidth: 1, minWidth: 140 }}>
      <View className="flex-row items-center justify-center">
        <Text
          numberOfLines={1}
          className={cn(selected ? 'text-primary-foreground' : 'text-foreground')}
          style={noTextShadow}>
          {label}
        </Text>
        {selected && <Check className="ml-2 h-4 w-4 shrink-0" color="#FFFFFF" />}
      </View>
    </Pressable>
  );
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete = () => {} }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    riskTolerance: 'moderate',
    sectors: [],
    notifications: { push: true, calls: false, dailyBriefing: true },
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else onComplete(profile);
  };

  const handleSectorToggle = (sector: string) => {
    setProfile((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View className="space-y-6">
            <View className="mb-8 text-center">
              <Text
                className="text-foreground mb-2 text-center text-2xl font-bold"
                style={noTextShadow}>
                Welcome to Mirai Assistant
              </Text>
              <Text className="text-muted-foreground text-center" style={noTextShadow}>
                Let&apos;s personalize your investment experience
              </Text>
            </View>

            <View>
              <Text className="text-foreground mb-4 font-semibold" style={noTextShadow}>
                What&apos;s your risk tolerance?
              </Text>

              {riskProfiles.map((risk, idx) => {
                const Icon = risk.icon;
                const isSelected = profile.riskTolerance === risk.id;
                return (
                  <Pressable
                    key={risk.id}
                    onPress={() =>
                      setProfile((p) => ({
                        ...p,
                        riskTolerance: risk.id as UserProfile['riskTolerance'],
                      }))
                    }
                    className={cn('mb-3', idx === riskProfiles.length - 1 && 'mb-0')} // spacing here
                  >
                    <Card
                      className={cn(
                        'card-hover p-4 shadow-none transition-all duration-200',
                        isSelected && 'ring-primary bg-primary/5 ring-2'
                      )}>
                      <View className="flex-row items-center gap-4">
                        <Icon className={cn('h-6 w-6', risk.color)} />
                        <View className="flex-1">
                          <Text className="text-foreground font-semibold" style={noTextShadow}>
                            {risk.title}
                          </Text>
                          <Text className="text-muted-foreground text-sm" style={noTextShadow}>
                            {risk.description}
                          </Text>
                        </View>
                        {isSelected && <Check className="text-primary h-5 w-5" />}
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );

      case 2:
        return (
          <View className="space-y-6">
            <View className="mb-8 text-center">
              <Text
                className="text-foreground mb-2 text-center text-2xl font-bold"
                style={noTextShadow}>
                Choose Your Interests
              </Text>
              <Text className="text-muted-foreground text-center" style={noTextShadow}>
                Select sectors you&apos;d like to track (3-5 recommended)
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-center gap-3">
              {sectors.map((sector) => (
                <SectorChip
                  key={sector}
                  label={sector}
                  selected={profile.sectors.includes(sector)}
                  onPress={() => handleSectorToggle(sector)}
                />
              ))}
            </View>

            {profile.sectors.length > 0 && (
              <View className="mt-4">
                <Text className="text-muted-foreground mb-2 text-sm" style={noTextShadow}>
                  Selected: {profile.sectors.length} sectors
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {profile.sectors.map((sector) => (
                    <Badge key={sector} variant="secondary" label={sector} />
                  ))}
                </View>
              </View>
            )}
          </View>
        );

      case 3:
        return (
          <View className="space-y-6">
            <View className="mb-8 text-center">
              <Text
                className="text-foreground mb-2 text-center text-2xl font-bold"
                style={noTextShadow}>
                Notification Preferences
              </Text>
              <Text className="text-muted-foreground text-center" style={noTextShadow}>
                How would you like to receive important updates?
              </Text>
            </View>

            {/* Use gap-3 to guarantee equal spacing between cards (same visual rhythm as Step 1) */}
            <View className="gap-3">
              {/* Push Notifications */}
              <Card className="p-4 shadow-none">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-foreground font-semibold" style={noTextShadow}>
                      Push Notifications
                    </Text>
                    <Text className="text-muted-foreground text-sm" style={noTextShadow}>
                      Get instant alerts on your device
                    </Text>
                  </View>
                  <Button
                    variant={profile.notifications.push ? 'default' : 'outline'}
                    size="sm"
                    onPress={() =>
                      setProfile((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: !prev.notifications.push },
                      }))
                    }>
                    {profile.notifications.push ? 'On' : 'Off'}
                  </Button>
                </View>
              </Card>

              {/* Voice Calls (Premium) */}
              <Card className="border-premium/30 bg-premium/5 p-4 shadow-none">
                <View className="flex-row items-center justify-between">
                  <View>
                    <View className="mb-1 flex-row items-center gap-2">
                      <Text className="text-foreground font-semibold" style={noTextShadow}>
                        Voice Calls
                      </Text>
                      <Badge
                        variant="outline"
                        className="text-premium border-premium/30"
                        label="Premium"
                      />
                    </View>
                    <Text className="text-muted-foreground text-sm" style={noTextShadow}>
                      Receive urgent market alerts via phone
                    </Text>
                  </View>
                  <Button
                    variant={profile.notifications.calls ? 'default' : 'outline'}
                    size="sm"
                    className={
                      profile.notifications.calls ? 'bg-premium text-premium-foreground' : ''
                    }
                    onPress={() =>
                      setProfile((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, calls: !prev.notifications.calls },
                      }))
                    }>
                    {profile.notifications.calls ? 'On' : 'Off'}
                  </Button>
                </View>
              </Card>

              {/* Daily Briefing */}
              <Card className="p-4 shadow-none">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-foreground font-semibold" style={noTextShadow}>
                      Daily Briefing
                    </Text>
                    <Text className="text-muted-foreground text-sm" style={noTextShadow}>
                      Morning market summary and AI insights
                    </Text>
                  </View>
                  <Button
                    variant={profile.notifications.dailyBriefing ? 'default' : 'outline'}
                    size="sm"
                    onPress={() =>
                      setProfile((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          dailyBriefing: !prev.notifications.dailyBriefing,
                        },
                      }))
                    }>
                    {profile.notifications.dailyBriefing ? 'On' : 'Off'}
                  </Button>
                </View>
              </Card>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="bg-background flex-1 p-4">
      <View className="mb-8">
        <Progress value={progress} className="mb-4" />
        <Text className="text-muted-foreground text-center text-sm" style={noTextShadow}>
          Step {step} of {totalSteps}
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <View className="w-full max-w-md self-center">{renderStep()}</View>
      </View>

      <View className="mt-8 w-full max-w-md self-center">
        <Button
          onPress={handleNext}
          className="w-full flex-row"
          disabled={step === 2 && profile.sectors.length === 0}>
          <Text className="text-primary-foreground" style={noTextShadow}>
            {step === totalSteps ? 'Get Started' : 'Continue'}
          </Text>
          <ArrowRight
            size={16}
            color={step === 2 && profile.sectors.length === 0 ? '#9CA3AF' : '#FFFFFF'}
            style={{ marginLeft: 8 }}
          />
        </Button>
      </View>
    </View>
  );
};
