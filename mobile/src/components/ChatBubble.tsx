import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import type { IntakeSender } from '../types/domain';

interface ChatBubbleProps {
  sender: IntakeSender;
  text: string;
}

export function ChatBubble({ sender, text }: ChatBubbleProps) {
  const isUser = sender === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.ai]}>
      <Text style={[styles.text, isUser && styles.userText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '84%',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  ai: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  user: {
    backgroundColor: colors.ink,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink,
  },
  userText: {
    color: colors.white,
  },
});
