import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/tokens';
import { formatShortTimestamp } from '../utils/formatDate';
import type { MessageThread } from '../types/domain';

interface MessageThreadRowProps {
  thread: MessageThread;
  onPress: () => void;
}

export function MessageThreadRow({ thread, onPress }: MessageThreadRowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{thread.contractorName.charAt(0)}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.headRow}>
          <Text style={[styles.name, thread.unread && styles.unreadText]} numberOfLines={1}>
            {thread.contractorName}
          </Text>
          <Text style={styles.time}>{formatShortTimestamp(thread.lastMessageAt)}</Text>
        </View>
        <Text style={[styles.preview, thread.unread && styles.unreadText]} numberOfLines={1}>
          {thread.lastMessagePreview}
        </Text>
      </View>
      {thread.unread ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: colors.teal,
  },
  body: {
    flex: 1,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13.5,
    color: colors.ink,
    flexShrink: 1,
  },
  time: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.inkSoft,
  },
  preview: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkSoft,
  },
  unreadText: {
    color: colors.ink,
    fontFamily: fonts.sansBold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.teal,
  },
});
