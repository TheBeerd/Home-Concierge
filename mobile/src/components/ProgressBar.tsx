import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/tokens';

interface ProgressBarProps {
  progress: number; // 0-1
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 5,
    backgroundColor: colors.line,
    borderRadius: 3,
    marginVertical: 4,
    marginBottom: 18,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.teal,
  },
});
