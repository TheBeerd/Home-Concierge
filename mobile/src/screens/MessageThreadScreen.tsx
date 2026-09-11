import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { api } from '../api';
import { Button } from '../components/Button';
import { ChatBubble } from '../components/ChatBubble';
import { colors, fonts } from '../theme/tokens';
import type { RootStackParamList } from '../navigation/types';
import type { MessageThreadDetail } from '../types/domain';

type Props = NativeStackScreenProps<RootStackParamList, 'MessageThread'>;

export function MessageThreadScreen({ route, navigation }: Props) {
  const { threadId } = route.params;
  const [detail, setDetail] = useState<MessageThreadDetail | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    api.getMessageThread(threadId).then((result) => {
      setDetail(result);
      // The root navigator forces headerTitle: '' by default (to hide
      // the raw route name on other screens) — override it explicitly
      // here rather than `title`, which headerTitle would still shadow.
      navigation.setOptions({ headerTitle: result.thread.contractorName });
    });
  }, [threadId, navigation]);

  async function handleSend() {
    const text = draft.trim();
    if (!text || !detail) return;
    setSending(true);
    setDraft('');
    try {
      const messages = await api.sendMessage(threadId, text);
      setDetail({ ...detail, messages });
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    } finally {
      setSending(false);
    }
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.teal} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {detail.messages.map((message) => (
            <ChatBubble
              key={message.id}
              align={message.sender === 'homeowner' ? 'right' : 'left'}
              text={message.text}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Write a message…"
              placeholderTextColor={colors.inkSoft}
              editable={!sending}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Button label="Send" onPress={handleSend} disabled={!draft.trim()} loading={sending} style={styles.sendButton} />
          </View>
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
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
