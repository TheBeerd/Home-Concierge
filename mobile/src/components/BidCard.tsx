import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/tokens';
import type { Bid } from '../types/domain';

interface BidCardProps {
  bid: Bid;
}

function formatPriceRange(low: number, high: number) {
  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;
  return `${fmt(low)}–${fmt(high)}`;
}

export function BidCard({ bid }: BidCardProps) {
  return (
    <View style={[styles.card, bid.isSuggested && styles.pick]}>
      <View style={styles.head}>
        <Text style={styles.name}>{bid.contractorName}</Text>
        {bid.isSuggested ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Suggested</Text>
          </View>
        ) : null}
      </View>

      <Row k="Likely cause" v={bid.likelyCause} />
      <Row k="Diagnostic fee" v={bid.diagnosticFee} />
      <Row k="Price range" v={formatPriceRange(bid.priceRangeLow, bid.priceRangeHigh)} />
      <Row k="Warranty" v={bid.warrantySummary} />
      <Row k="Available" v={bid.availability} />
    </View>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: 15,
    marginBottom: 12,
  },
  pick: {
    borderWidth: 1.5,
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontFamily: fonts.sansBold,
    fontSize: 14.5,
    color: colors.ink,
  },
  badge: {
    backgroundColor: 'rgba(22,124,116,0.12)',
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    color: colors.teal,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(18,32,59,0.06)',
  },
  k: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkSoft,
  },
  v: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.ink,
    textAlign: 'right',
    maxWidth: '58%',
  },
});
