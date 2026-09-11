import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';

interface ChatBubbleProps {
  /** Right-aligned, dark bubble for "this side of the conversation"
   * (the homeowner in both the AI intake and a contractor thread). */
  align: 'left' | 'right';
  text: string;
}

export function ChatBubble({ align, text }: ChatBubbleProps) {
  const isRight = align === 'right';
  return (
    <View style={[styles.bubble, isRight ? styles.right : styles.left]}>
      <Text style={[styles.text, isRight && styles.rightText]}>{text}</Text>
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
  left: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  right: {
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
  rightText: {
    color: colors.white,
  },
});
