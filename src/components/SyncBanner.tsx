import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import dimensions from '../utils/dimensions';

interface SyncBannerProps {
  count: number;
  onPress?: () => void;
}

export default function SyncBanner({ count, onPress }: SyncBannerProps) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.deliveryContainer}
    >
      <Ionicons
        name="cloud-upload-outline"
        size={dimensions.height(3.2)}
        color="blue"
      />
      <Text style={styles.deliveryTitle}>
        {count} {count === 1 ? 'delivery' : 'deliveries'} waiting to sync
      </Text>
      <Ionicons
        name="chevron-forward-outline"
        size={dimensions.height(2.6)}
        color="#1A1A1A"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: dimensions.width(2),
    backgroundColor: 'white',
    borderWidth: dimensions.width(0.2),
    borderColor: '#E5E7EB',
    height: dimensions.height(5),
    paddingHorizontal: dimensions.width(4),
  },
  deliveryTitle: {
    fontSize: dimensions.height(1.6),
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
  },
});
