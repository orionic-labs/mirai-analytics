// Assistant.tsx
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Bot } from 'lucide-react-native';
import { useConversation } from '@elevenlabs/react-native';

type ConversationStatus = 'disconnected' | 'connecting' | 'connected';

interface AssistantProps {
  onBack?: () => void;
}

/**
 * If your App root is NOT wrapped with ElevenLabsProvider,
 * uncomment the export wrapper at the bottom to wrap locally.
 */
export const Assistant: React.FC<AssistantProps> = ({ onBack }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);

  const conversation = useConversation({
    onConnect: ({ conversationId }) => setCurrentConversationId(conversationId),
    onDisconnect: () => setCurrentConversationId(null),
    onError: (message, context) => console.error('Conversation error:', message, context),
    onMessage: ({ message, source }) => console.log(`Message from ${source}:`, message),
    onModeChange: ({ mode }) => console.log('Mode:', mode),
    onStatusChange: ({ status }) => console.log('Status:', status),
    onCanSendFeedbackChange: ({ canSendFeedback }) =>
      console.log('Can send feedback:', canSendFeedback),
  });

  const startConversation = async () => {
    if (isStarting || conversation.status === 'connected') return;
    setIsStarting(true);
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID as string,
        userId: 'mirai-demo-user',
      });
    } catch (e) {
      console.error('Failed to start conversation:', e);
    } finally {
      setIsStarting(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (e) {
      console.error('Failed to end conversation:', e);
    }
  };

  const handleSubmitText = () => {
    const msg = textInput.trim();
    if (!msg) return;
    conversation.sendUserMessage(msg);
    setTextInput('');
    Keyboard.dismiss();
  };

  const toggleMicMute = () => {
    const next = !isMicMuted;
    setIsMicMuted(next);
    conversation.setMicMuted(next);
  };

  const canStart = conversation.status === 'disconnected' && !isStarting;
  const canEnd = conversation.status === 'connected';

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case 'connected':
        return '#10B981';
      case 'connecting':
        return '#F59E0B';
      case 'disconnected':
      default:
        return '#EF4444';
    }
  };

  const getStatusText = (status: ConversationStatus) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
                <ArrowLeft size={18} />
              </TouchableOpacity>
            )}
            <View style={styles.avatar}>
              <Bot size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Voice Assistant</Text>
              <Text style={styles.headerSubtitle}>ElevenLabs Voice Agent</Text>
            </View>
          </View>

          {/* Status */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(conversation.status as ConversationStatus) },
              ]}
            />
            <Text style={styles.statusText}>
              {getStatusText(conversation.status as ConversationStatus)}
            </Text>
          </View>

          {/* Conversation ID */}
          {conversation.status === 'connected' && (
            <View style={styles.box}>
              <Text style={styles.boxLabel}>Conversation ID</Text>
              <Text style={styles.boxCode}>
                {conversation.getId() || currentConversationId || 'N/A'}
              </Text>
            </View>
          )}

          {/* Speaking indicator */}
          {conversation.status === 'connected' && (
            <View style={styles.speakingRow}>
              <View
                style={[
                  styles.speakingDot,
                  { backgroundColor: conversation.isSpeaking ? '#8B5CF6' : '#D1D5DB' },
                ]}
              />
              <Text
                style={[
                  styles.speakingText,
                  { color: conversation.isSpeaking ? '#8B5CF6' : '#9CA3AF' },
                ]}>
                {conversation.isSpeaking ? '🎤 AI Speaking' : '👂 AI Listening'}
              </Text>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={startConversation}
              disabled={!canStart}
              style={[styles.btn, canStart ? styles.btnStart : styles.btnDisabled]}>
              <Text style={styles.btnText}>{isStarting ? 'Starting…' : 'Start Conversation'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={endConversation}
              disabled={!canEnd}
              style={[styles.btn, canEnd ? styles.btnEnd : styles.btnDisabled]}>
              <Text style={styles.btnText}>End Conversation</Text>
            </TouchableOpacity>
          </View>

          {/* Mic */}
          {conversation.status === 'connected' && (
            <View style={styles.center}>
              <TouchableOpacity
                onPress={toggleMicMute}
                style={[
                  styles.btn,
                  styles.btnMic,
                  isMicMuted ? styles.btnMuted : styles.btnUnmuted,
                ]}>
                <Text style={styles.btnText}>{isMicMuted ? '🔇 Unmute' : '🎤 Mute'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Feedback */}
          {conversation.status === 'connected' && conversation.canSendFeedback && (
            <View style={styles.feedback}>
              <Text style={styles.feedbackLabel}>How was that response?</Text>
              <View style={styles.feedbackRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnLike]}
                  onPress={() => conversation.sendFeedback(true)}>
                  <Text style={styles.btnText}>👍 Like</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnDislike]}
                  onPress={() => conversation.sendFeedback(false)}>
                  <Text style={styles.btnText}>👎 Dislike</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Optional: Text input to send messages/context while connected */}
          {conversation.status === 'connected' && (
            <View style={styles.messaging}>
              <Text style={styles.messagingLabel}>Send Text Message</Text>
              <TextInput
                style={styles.input}
                value={textInput}
                onChangeText={(t) => {
                  setTextInput(t);
                  if (t.length > 0) conversation.sendUserActivity();
                }}
                placeholder="Type a message or context…"
                multiline
                onSubmitEditing={handleSubmitText}
                returnKeyType="send"
                blurOnSubmit
              />
              <View style={styles.messageRow}>
                <TouchableOpacity
                  onPress={handleSubmitText}
                  disabled={!textInput.trim()}
                  style={[styles.btn, styles.btnPrimary, !textInput.trim() && styles.btnDisabled]}>
                  <Text style={styles.btnText}>💬 Send Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const msg = textInput.trim();
                    if (!msg) return;
                    conversation.sendContextualUpdate(msg);
                    setTextInput('');
                    Keyboard.dismiss();
                  }}
                  disabled={!textInput.trim()}
                  style={[
                    styles.btn,
                    styles.btnSecondary,
                    !textInput.trim() && styles.btnDisabled,
                  ]}>
                  <Text style={styles.btnText}>📝 Send Context</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconBtn: { padding: 8, marginRight: 8 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6B7280' },

  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  statusText: { fontSize: 14, fontWeight: '500', color: '#374151' },

  box: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  boxLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 6 },
  boxCode: {
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },

  speakingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  speakingDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  speakingText: { fontSize: 14, fontWeight: '600' },

  controls: { marginTop: 20, gap: 12 },
  btn: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: '600' },
  btnStart: { backgroundColor: '#10B981' },
  btnEnd: { backgroundColor: '#EF4444' },
  btnDisabled: { backgroundColor: '#9CA3AF' },

  center: { alignItems: 'center', marginTop: 16 },
  btnMic: { paddingHorizontal: 28 },
  btnMuted: { backgroundColor: '#EF4444' },
  btnUnmuted: { backgroundColor: '#059669' },

  feedback: { marginTop: 24, alignItems: 'center' },
  feedbackLabel: { fontSize: 16, fontWeight: '500', color: '#374151', marginBottom: 12 },
  feedbackRow: { flexDirection: 'row', gap: 16 },
  btnLike: { backgroundColor: '#10B981', flex: 1 },
  btnDislike: { backgroundColor: '#EF4444', flex: 1 },

  messaging: { marginTop: 24 },
  messagingLabel: { fontSize: 16, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 12,
  },
  messageRow: { flexDirection: 'row', gap: 12 },
  btnPrimary: { backgroundColor: '#3B82F6', flex: 1 },
  btnSecondary: { backgroundColor: '#4F46E5', flex: 1 },
});

// If your app root is NOT wrapped with <ElevenLabsProvider>, you can export this instead:
// export default function AssistantScreen(props: AssistantProps) {
//   return (
//     <ElevenLabsProvider>
//       <Assistant {...props} />
//     </ElevenLabsProvider>
//   );
// }
