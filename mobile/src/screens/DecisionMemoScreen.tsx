import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api';
import { BidCard } from '../components/BidCard';
import { Button } from '../components/Button';
import { FlagBanner } from '../components/FlagBanner';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors, fonts } from '../theme/tokens';
import type { DecisionMemo } from '../types/domain';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DecisionMemo'>;

export function DecisionMemoScreen({ route, navigation }: Props) {
  const { requestId } = route.params;
  const [memo, setMemo] = useState<DecisionMemo | null>(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api.getDecisionMemo(requestId).then(setMemo);
  }, [requestId]);

  if (!memo) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.teal} size="large" />
          <Text style={styles.loadingText}>Putting your decision memo together…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const suggestedBid = memo.bids.find((bid) => bid.id === memo.suggestedBidId);

  async function handleBook() {
    if (!suggestedBid) return;
    setBooking(true);
    try {
      const job = await api.acceptBid(requestId, suggestedBid.id);
      navigation.replace('JobStatus', { jobId: job.jobId });
    } catch (error) {
      Alert.alert('Something went wrong', 'Please try booking again.');
      setBooking(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Your decision memo" subtitle={`${memo.contractorCount} contractors responded`} />
      <ScrollView contentContainerStyle={styles.content}>
        {memo.flags.map((flag) => (
          <FlagBanner
            key={flag.contractorId}
            label="Worth a second look:"
            message={`${flag.contractorName} ${flag.message}`}
          />
        ))}

        {memo.bids.map((bid) => (
          <BidCard key={bid.id} bid={bid} />
        ))}

        <View style={styles.takeCard}>
          <Text style={styles.takeKicker}>Our take</Text>
          <Text style={styles.takeBody}>{memo.ourTake}</Text>
        </View>

        {suggestedBid ? (
          <Button
            label={`Book ${suggestedBid.contractorName}`}
            onPress={handleBook}
            loading={booking}
            style={styles.bookButton}
          />
        ) : null}

        <View style={styles.linkRow}>
          <Text style={styles.link} onPress={() => Alert.alert('Contractor profiles', 'Coming in a later pass.')}>
            View full contractor profiles
          </Text>
          <Text style={styles.link} onPress={() => Alert.alert('Message a contractor', 'Coming in a later pass.')}>
            Message a contractor
          </Text>
          <Text style={styles.link} onPress={() => Alert.alert('Ask a follow-up', 'Coming in a later pass.')}>
            Ask a follow-up
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  loadingText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  takeCard: {
    backgroundColor: colors.ink,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  takeKicker: {
    fontFamily: fonts.serif,
    fontSize: 13,
    color: colors.tealMuted,
    marginBottom: 6,
  },
  takeBody: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.inkFaintText,
  },
  bookButton: {
    marginTop: 16,
  },
  linkRow: {
    marginTop: 16,
    gap: 12,
    alignItems: 'center',
  },
  link: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12.5,
    color: colors.teal,
  },
});
