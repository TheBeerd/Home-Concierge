import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radii } from '../theme/tokens';

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function Chip({ label, onPress, selected, disabled }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        disabled && !selected && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 13,
  },
  selected: {
    backgroundColor: colors.teal,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: colors.teal,
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
  },
  selectedLabel: {
    color: colors.white,
  },
});
