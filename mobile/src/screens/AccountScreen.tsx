import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api';
import { ScreenHeader } from '../components/ScreenHeader';
import { SettingsRow } from '../components/SettingsRow';
import { colors, fonts, radii } from '../theme/tokens';
import type { AccountProfile } from '../types/domain';

const DISCLOSURE_TEXT =
  "This app does not diagnose HVAC systems, perform repairs, or guarantee contractor work. " +
  "All diagnoses and pricing come from independent, licensed contractors. Home Concierge is not a party " +
  "to any repair agreement. \"Verified\" means we've checked a contractor's active license, insurance, " +
  "and business registration — it is not an endorsement of their work quality.";

export function AccountScreen() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [disclosureOpen, setDisclosureOpen] = useState(false);

  useEffect(() => {
    api.getAccountProfile().then(setProfile);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Account" />
      <ScrollView contentContainerStyle={styles.content}>
        {profile ? (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.detail}>{profile.email}</Text>
            <Text style={styles.detail}>{profile.phone}</Text>
            <Text style={styles.detail}>{profile.address}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Preferences</Text>
        <SettingsRow
          label="Notifications"
          toggle={{ value: notificationsEnabled, onValueChange: setNotificationsEnabled }}
        />
        <SettingsRow
          label="Payment methods"
          onPress={() => Alert.alert('Payment methods', 'Coming in a later pass.')}
        />

        <Text style={styles.sectionLabel}>Legal</Text>
        <SettingsRow label="Legal & disclosures" onPress={() => setDisclosureOpen((open) => !open)} />
        {disclosureOpen ? (
          <View style={styles.disclosureCard}>
            <Text style={styles.disclosureText}>{DISCLOSURE_TEXT}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Support</Text>
        <SettingsRow label="Help & support" onPress={() => Alert.alert('Help & support', 'Coming in a later pass.')} />
        <SettingsRow
          label="Sign out"
          destructive
          onPress={() =>
            Alert.alert('Sign out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign out', style: 'destructive' },
            ])
          }
        />
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
  profileCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.xl,
    padding: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.teal,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 4,
  },
  detail: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.inkSoft,
    marginBottom: 2,
  },
  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 20,
    marginBottom: 10,
  },
  disclosureCard: {
    backgroundColor: colors.claySoft,
    borderRadius: radii.lg,
    padding: 14,
    marginTop: -2,
    marginBottom: 10,
  },
  disclosureText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.clayText,
  },
});
