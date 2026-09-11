import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api';
import { Button } from '../components/Button';
import { StatusRow } from '../components/StatusRow';
import { colors, fonts } from '../theme/tokens';
import type { DashboardData, RequestStatus } from '../types/domain';
import type { RootStackParamList, TabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const dashboard = await api.getDashboard();
    setData(dashboard);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const openRequest = (requestId: string, status: RequestStatus) => {
    if (status === 'memo_ready') {
      navigation.navigate('DecisionMemo', { requestId });
    } else {
      // Booked/awaiting-confirmation requests route to their job.
      navigation.navigate('JobStatus', { jobId: 'job_coolway_ac' });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal} />}
      >
        <Text style={styles.greeting}>Good afternoon</Text>
        <Text style={styles.greetingMain}>Let's fix what's{'\n'}going on.</Text>

        <View style={styles.startCard}>
          <Text style={styles.kicker}>Start a request</Text>
          <Text style={styles.startTitle}>What's happening with your AC or heat?</Text>
          <Text style={styles.startBody}>
            Tell us in your own words — text, voice, or a photo. We'll take it from there.
          </Text>
          <Button label="Start now" onPress={() => navigation.navigate('Intake')} />
        </View>

        <Text style={styles.sectionLabel}>In progress</Text>
        {(data?.activeRequests ?? []).map((request) => (
          <StatusRow
            key={request.id}
            title={request.title}
            meta={request.statusMeta}
            onPress={() => openRequest(request.id, request.status)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  greeting: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 6,
    marginBottom: 2,
  },
  greetingMain: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.ink,
    marginBottom: 20,
    lineHeight: 30,
  },
  startCard: {
    backgroundColor: colors.ink,
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
  },
  kicker: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.tealMuted,
    marginBottom: 6,
  },
  startTitle: {
    fontFamily: fonts.serif,
    fontSize: 19,
    color: colors.white,
    marginBottom: 10,
    lineHeight: 25,
  },
  startBody: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.inkMutedText,
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 22,
    marginBottom: 10,
  },
});
