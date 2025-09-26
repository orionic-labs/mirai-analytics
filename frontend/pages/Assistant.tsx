import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Send, Mic, Bot, ArrowLeft } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AssistantProps {
  onBack?: () => void;
}

const quickReplies = ['Explain more', 'Show chart', 'Impact on portfolio', 'Market outlook'];

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content:
      "Hello! I'm your AI investment assistant. I can help you analyze market trends, understand portfolio impacts, and provide personalized investment insights. What would you like to know?",
    timestamp: new Date(),
    suggestions: [
      "What's happening in the tech sector?",
      'How is my portfolio performing?',
      'Should I buy more NVIDIA?',
      'Market outlook for next week',
    ],
  },
];

export const Assistant: React.FC<AssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: generateSuggestions(content),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('portfolio') || input.includes('performance')) {
      return 'Your portfolio is up 1.87% today, driven primarily by NVIDIA (+3.18%) and Apple (+1.39%). Consider diversifying since tech now represents 65% of holdings.';
    }

    if (input.includes('tech') || input.includes('technology')) {
      return 'The technology sector is gaining momentum due to AI infrastructure investments. Cloud providers announced $50B in AI spending.';
    }

    if (input.includes('nvidia') || input.includes('nvda')) {
      return 'NVIDIA is well-positioned with AI data center demand surging. Fundamentals are strong, but volatility remains.';
    }

    if (input.includes('market') || input.includes('outlook')) {
      return 'Market outlook is cautiously optimistic. Fed policy uncertainty creates volatility, but earnings growth supports equities.';
    }

    return 'I recommend a balanced approach while monitoring earnings reports and Federal Reserve announcements.';
  };

  const generateSuggestions = (_: string): string[] => [
    'Show me the analysis',
    'What are the risks?',
    'How does this affect my strategy?',
    'Any other opportunities?',
  ];

  const handleQuickReply = (reply: string) => handleSendMessage(reply);

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View className="border-border bg-background flex-row items-center gap-3 border-b p-4">
        {onBack && (
          <Button variant="outline" size="icon" onPress={onBack} className="mr-2">
            <ArrowLeft size={16} />
          </Button>
        )}
        <View className="bg-primary h-8 w-8 items-center justify-center rounded-full">
          <Bot size={16} className="text-primary-foreground" />
        </View>
        <View>
          <Text className="font-semibold">AI Assistant</Text>
          <Text className="text-muted-foreground text-xs">Powered by financial intelligence</Text>
        </View>
        <Badge className="ml-auto border-purple-300 text-purple-500" label="Premium" />
      </View>

      {/* Chat messages */}
      <ScrollView ref={scrollRef} className="flex-1 p-4" contentContainerStyle={{ gap: 12 }}>
        {messages.map((message) => (
          <View
            key={message.id}
            className={cn(
              'flex-row gap-3',
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}>
            {message.type === 'assistant' && (
              <View className="bg-primary mt-1 h-8 w-8 items-center justify-center rounded-full">
                <Bot size={16} className="text-primary-foreground" />
              </View>
            )}

            <View
              className={cn('max-w-[80%]', message.type === 'user' ? 'items-end' : 'items-start')}>
              <Card
                className={cn(
                  'p-3',
                  message.type === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-card'
                )}>
                <Text className="text-sm leading-relaxed">{message.content}</Text>
              </Card>

              {message.suggestions && (
                <View className="mt-1 max-w-sm flex-row flex-wrap gap-2">
                  {message.suggestions.map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="h-7"
                      onPress={() => handleSendMessage(suggestion)}>
                      <Text className="text-xs">{suggestion}</Text>
                    </Button>
                  ))}
                </View>
              )}

              <Text className="text-muted-foreground mt-1 text-xs">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View className="flex-row gap-3">
            <View className="bg-primary mt-1 h-8 w-8 items-center justify-center rounded-full">
              <Bot size={16} className="text-primary-foreground" />
            </View>
            <Card className="bg-card flex-row gap-1 p-3">
              <View className="bg-muted-foreground h-2 w-2 animate-pulse rounded-full" />
              <View className="bg-muted-foreground h-2 w-2 animate-pulse rounded-full" />
              <View className="bg-muted-foreground h-2 w-2 animate-pulse rounded-full" />
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Quick replies + input */}
      <View className="border-border bg-background border-t p-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <View className="flex-row gap-2">
            {quickReplies.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                className="text-xs"
                onPress={() => handleQuickReply(reply)}>
                <Text className="text-xs">{reply}</Text>
              </Button>
            ))}
          </View>
        </ScrollView>

        <View className="flex-row items-center gap-2">
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Ask about markets, portfolio, or trading strategies..."
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            onSubmitEditing={() => handleSendMessage(inputValue)}
          />
          <Button
            onPress={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="bg-primary">
            <Send size={16} className="text-primary-foreground" />
          </Button>
          <Button variant="outline" size="icon">
            <Mic size={16} />
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
