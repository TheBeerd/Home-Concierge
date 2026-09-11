import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import type { JobTimelineEvent } from '../types/domain';

interface TimelineProps {
  events: JobTimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <View>
      {events.map((event, index) => (
        <View key={event.id} style={styles.item}>
          <View style={styles.rail}>
            <View style={[styles.dot, event.status === 'pending' && styles.dotPending]} />
            {index < events.length - 1 ? <View style={styles.line} /> : null}
          </View>
          <View style={styles.body}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.meta}>{event.meta}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  rail: {
    width: 22,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.teal,
    marginTop: 2,
  },
  dotPending: {
    backgroundColor: colors.line,
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: colors.line,
    marginTop: 4,
  },
  body: {
    flex: 1,
    paddingLeft: 4,
  },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12.5,
    color: colors.ink,
    marginBottom: 2,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    color: colors.inkSoft,
  },
});
