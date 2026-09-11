import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme/tokens';

interface FlagBannerProps {
  label: string;
  message: string;
}

export function FlagBanner({ label, message }: FlagBannerProps) {
  return (
    <Text style={styles.wrap}>
      <Text style={styles.label}>{label} </Text>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.claySoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.clay,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 13,
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.clayText,
    marginBottom: 16,
    overflow: 'hidden',
  },
  label: {
    fontFamily: fonts.sansBold,
    color: colors.clay,
  },
});
