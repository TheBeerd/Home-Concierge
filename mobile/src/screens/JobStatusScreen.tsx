import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api';
import { Button } from '../components/Button';
import { ScreenHeader } from '../components/ScreenHeader';
import { Timeline } from '../components/Timeline';
import { colors, fonts, radii } from '../theme/tokens';
import type { JobStatus } from '../types/domain';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'JobStatus'>;

export function JobStatusScreen({ route }: Props) {
  const { jobId } = route.params;
  const [job, setJob] = useState<JobStatus | null>(null);
  const [confirming, setConfirming] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    api.getJobStatus(jobId).then(setJob);
  }, [jobId]);

  if (!job) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.teal} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  async function handleConfirm(completed: boolean) {
    setConfirming(completed ? 'yes' : 'no');
    try {
      const updated = await api.confirmJobCompletion(jobId, { completed });
      setJob(updated);
      if (!completed) {
        Alert.alert(
          "Sorry to hear that",
          "We'll follow up with the contractor and check in with you.",
        );
      }
    } catch (error) {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setConfirming(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Your appointment" subtitle={job.requestTitle} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.trackCard}>
          <Text style={styles.company}>{job.contractorName}</Text>
          <Text style={styles.role}>Arriving {job.appointmentWindow}</Text>
          <Timeline events={job.timeline} />
        </View>

        {job.awaitingCompletionConfirmation ? (
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Was the work completed?</Text>
            <Text style={styles.confirmBody}>
              This helps us keep pricing and warranty promises honest for the next homeowner.
            </Text>
            <View style={styles.confirmActions}>
              <Button
                label="Yes, all done"
                variant="moss"
                onPress={() => handleConfirm(true)}
                loading={confirming === 'yes'}
                disabled={confirming !== null}
                style={styles.confirmButton}
              />
              <Button
                label="Not yet"
                variant="ghost"
                onPress={() => handleConfirm(false)}
                loading={confirming === 'no'}
                disabled={confirming !== null}
                style={styles.confirmButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.doneCard}>
            <Text style={styles.doneTitle}>Thanks — job confirmed complete.</Text>
            <Text style={styles.doneBody}>
              This feeds straight into {job.contractorName}'s track record on the platform.
            </Text>
          </View>
        )}
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
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  trackCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.xl,
    padding: 18,
    marginBottom: 16,
  },
  company: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 2,
  },
  role: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: 14,
  },
  confirmCard: {
    backgroundColor: colors.mossSoft,
    borderRadius: radii.lg,
    padding: 16,
  },
  confirmTitle: {
    fontFamily: fonts.serif,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 6,
  },
  confirmBody: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mossText,
    lineHeight: 18,
    marginBottom: 12,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
  },
  doneCard: {
    backgroundColor: colors.mossSoft,
    borderRadius: radii.lg,
    padding: 16,
  },
  doneTitle: {
    fontFamily: fonts.serif,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 6,
  },
  doneBody: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mossText,
    lineHeight: 18,
  },
});
