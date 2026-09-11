import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/tokens';

interface SettingsRowProps {
  label: string;
  onPress?: () => void;
  /** Renders a Switch instead of a chevron when provided. */
  toggle?: { value: boolean; onValueChange: (value: boolean) => void };
  destructive?: boolean;
}

export function SettingsRow({ label, onPress, toggle, destructive }: SettingsRowProps) {
  return (
    <Pressable
      onPress={toggle ? undefined : onPress}
      style={({ pressed }) => [styles.row, pressed && !toggle && styles.pressed]}
    >
      <Text style={[styles.label, destructive && styles.destructive]}>{label}</Text>
      {toggle ? (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onValueChange}
          trackColor={{ false: colors.line, true: colors.teal }}
          thumbColor={colors.white}
        />
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13.5,
    color: colors.ink,
  },
  destructive: {
    color: colors.clay,
  },
  chevron: {
    fontSize: 18,
    color: colors.inkSoft,
  },
});
