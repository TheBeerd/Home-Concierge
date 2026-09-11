import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/tokens';

interface StatusRowProps {
  title: string;
  meta: string;
  onPress?: () => void;
}

export function StatusRow({ title, meta, onPress }: StatusRowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.icon} />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
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
  icon: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: colors.tealSoft,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13.5,
    color: colors.ink,
    marginBottom: 2,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    color: colors.inkSoft,
  },
});
