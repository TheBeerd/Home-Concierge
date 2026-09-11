import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../api';
import { Button } from '../components/Button';
import { ChatBubble } from '../components/ChatBubble';
import { Chip } from '../components/Chip';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors, fonts } from '../theme/tokens';
import type { IntakeSession } from '../types/domain';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Intake'>;

export function IntakeScreen({ navigation }: Props) {
  const [session, setSession] = useState<IntakeSession | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    api.startIntakeSession().then(setSession);
  }, []);

  const lastAiMessage = [...(session?.messages ?? [])].reverse().find((m) => m.sender === 'ai');
  const awaitingInput = !session?.complete;

  async function reply(input: { text?: string; quickReply?: string; attachmentLabel?: string }) {
    if (!session) return;
    setSending(true);
    try {
      const updated = await api.sendIntakeReply(session.id, input);
      setSession(updated);
      setDraft('');
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    } catch (error) {
      Alert.alert('Something went wrong', 'Please try that again.');
    } finally {
      setSending(false);
    }
  }

  async function handleAttach(kind: 'photo' | 'voice_note', label: string) {
    // Camera/mic capture is a follow-up — this simulates the attachment
    // landing so the guided-intake flow can be reviewed end to end.
    await reply({ attachmentLabel: `${label} attached` });
  }

  async function handleContinue() {
    if (!session) return;
    setSubmitting(true);
    try {
      const { requestId } = await api.submitIntakeSession(session.id);
      navigation.replace('DecisionMemo', { requestId });
    } catch (error) {
      Alert.alert('Something went wrong', 'Please try submitting again.');
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Tell us more" subtitle="Building your brief" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          <ProgressBar progress={session?.progress ?? 0} />

          {(session?.messages ?? []).map((message) => (
            <ChatBubble key={message.id} sender={message.sender} text={message.text} />
          ))}

          {sending ? <Text style={styles.typing}>Thinking…</Text> : null}

          {!sending && lastAiMessage?.quickReplies ? (
            <View style={styles.chipRow}>
              {lastAiMessage.quickReplies.map((option) => (
                <Chip key={option} label={option} onPress={() => reply({ quickReply: option })} />
              ))}
            </View>
          ) : null}

          {!sending && lastAiMessage?.attachmentRequest ? (
            <View style={styles.attachRow}>
              {lastAiMessage.attachmentRequest.map((attachment) => (
                <Chip
                  key={attachment.kind}
                  label={attachment.kind === 'photo' ? `📷  ${attachment.label}` : `🎙️  ${attachment.label}`}
                  onPress={() => handleAttach(attachment.kind, attachment.label)}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {session?.complete ? (
            <Button label="Continue" onPress={handleContinue} loading={submitting} />
          ) : awaitingInput && lastAiMessage && !lastAiMessage.quickReplies && !lastAiMessage.attachmentRequest ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={draft}
                onChangeText={setDraft}
                placeholder="Type your answer…"
                placeholderTextColor={colors.inkSoft}
                editable={!sending}
                onSubmitEditing={() => draft.trim() && reply({ text: draft.trim() })}
                returnKeyType="send"
              />
              <Button
                label="Send"
                onPress={() => draft.trim() && reply({ text: draft.trim() })}
                disabled={!draft.trim()}
                loading={sending}
                style={styles.sendButton}
              />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  typing: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
  },
  attachRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.bgApp,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink,
  },
  sendButton: {
    width: 84,
  },
});
