import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { api } from '../api';
import { MessageThreadRow } from '../components/MessageThreadRow';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors, fonts } from '../theme/tokens';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import type { MessageThread } from '../types/domain';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Messages'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function MessagesScreen({ navigation }: Props) {
  const [threads, setThreads] = useState<MessageThread[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setThreads(await api.listMessageThreads());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Messages" subtitle="Conversations with your contractors" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal} />}
      >
        {threads && threads.length === 0 ? (
          <Text style={styles.empty}>No conversations yet.</Text>
        ) : null}
        {(threads ?? []).map((thread) => (
          <MessageThreadRow
            key={thread.id}
            thread={thread}
            onPress={() => navigation.navigate('MessageThread', { threadId: thread.id })}
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
});
