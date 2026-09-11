import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusRow } from '../components/StatusRow';
import { openRequest } from '../navigation/requestRouting';
import { colors, fonts } from '../theme/tokens';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import type { ServiceRequestSummary } from '../types/domain';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Requests'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function RequestsScreen({ navigation }: Props) {
  const [requests, setRequests] = useState<ServiceRequestSummary[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRequests(await api.listRequests());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const inProgress = (requests ?? []).filter((r) => r.status !== 'completed');
  const completed = (requests ?? []).filter((r) => r.status === 'completed');

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Your requests" subtitle="Everything you've filed, in one place" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal} />}
      >
        {requests && requests.length === 0 ? (
          <Text style={styles.empty}>No requests yet — start one from the Home tab.</Text>
        ) : null}

        {inProgress.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>In progress</Text>
            {inProgress.map((request) => (
              <StatusRow
                key={request.id}
                title={request.title}
                meta={request.statusMeta}
                onPress={() => openRequest(navigation, request)}
              />
            ))}
          </>
        ) : null}

        {completed.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>Completed</Text>
            {completed.map((request) => (
              <StatusRow
                key={request.id}
                title={request.title}
                meta={request.statusMeta}
                onPress={() => openRequest(navigation, request)}
              />
            ))}
          </>
        ) : null}
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
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  empty: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 40,
  },
  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 8,
    marginBottom: 10,
  },
});
