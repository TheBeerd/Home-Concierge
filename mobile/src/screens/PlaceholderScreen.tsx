import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';

interface PlaceholderScreenProps {
  title: string;
}

/**
 * Requests / Messages / Account are out of scope for this first pass
 * (see the core-4-screens wireframe). Stubbed so the tab bar matches the
 * design without dead-ending in a crash.
 */
export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>Coming in a later pass of the app.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 21,
    color: colors.ink,
    marginBottom: 8,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
  },
});
