import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import dimensions from '../utils/dimensions';

export type OutboxStatus = 'queued' | 'syncing' | 'retrying' | 'failed' | 'synced';

interface OutboxItemProps {
  name: string;
  time: string;
  status: OutboxStatus;
  retryCount?: number;
  nextAttemptSec?: number;
  errorMessage?: string;
  onRetryPress?: () => void;
  onPress?: () => void;
}

export default function OutboxItem({
  name,
  time,
  status,
  retryCount,
  nextAttemptSec,
  errorMessage,
  onRetryPress,
  onPress,
}: OutboxItemProps) {
  // Determine styles and colors based on status
  let statusColor = '#10B981'; // green (synced)
  let statusBg = '#E6F4EA';
  let badgeText = 'SYNCED';
  let leftBorderColor = '#10B981';
  let statusIconName: React.ComponentProps<typeof Ionicons>['name'] = 'checkmark';

  if (status === 'queued') {
    statusColor = '#4B5563'; // grey
    statusBg = '#F3F4F6';
    badgeText = 'QUEUED';
    leftBorderColor = '#9CA3AF';
    statusIconName = 'time-outline';
  } else if (status === 'syncing') {
    statusColor = '#1E60D5'; // blue
    statusBg = '#EFF6FF';
    badgeText = 'SYNCING';
    leftBorderColor = '#1E60D5';
    statusIconName = 'sync-outline';
  } else if (status === 'retrying') {
    statusColor = '#D97706'; // orange
    statusBg = '#FEF3C7';
    badgeText = 'RETRYING';
    leftBorderColor = '#F59E0B';
    statusIconName = 'sync-outline';
  } else if (status === 'failed') {
    statusColor = '#EF4444'; // red
    statusBg = '#FEE2E2';
    badgeText = 'FAILED';
    leftBorderColor = '#EF4444';
    statusIconName = 'close';
  }

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.cardContainer}
    >
      {/* Left Colored Accent Bar */}
      <View style={[styles.accentBar, { backgroundColor: leftBorderColor }]} />

      {/* Main Content Area */}
      <View style={styles.cardContent}>
        {/* Left Side: Circular Status Icon */}
        <View style={[styles.iconCircle, { borderColor: statusColor }]}>
          <Ionicons name={statusIconName} size={dimensions.height(2.2)} color={statusColor} />
        </View>

        {/* Middle: Details Column */}
        <View style={styles.infoColumn}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.timeText}>{time}</Text>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{badgeText}</Text>
          </View>

          {/* Additional details for retrying */}
          {status === 'retrying' && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>Retry: {retryCount ?? 1}</Text>
              <Text style={styles.detailsText}>Next attempt in {nextAttemptSec ?? 30} sec</Text>
            </View>
          )}

          {/* Additional details for failed */}
          {status === 'failed' && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>{errorMessage ?? 'Error: Unknown issue'}</Text>

              {/* Red outline RETRY button */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.retryButton}
                onPress={onRetryPress}
              >
                <Text style={styles.retryButtonText}>RETRY</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Right Side: Chevron Arrow */}
        <View style={styles.chevronContainer}>
          <Ionicons
            name="chevron-forward-outline"
            size={dimensions.height(2.6)}
            color="#9CA3AF"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: dimensions.width(0.2),
    borderColor: '#E5E7EB',
    borderRadius: dimensions.height(1.5),
    marginHorizontal: dimensions.width(4),
    marginVertical: dimensions.height(0.6),
    overflow: 'hidden',
    position: 'relative',
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 1,
  },
  accentBar: {
    width: dimensions.width(1.2),
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  cardContent: {
    flexDirection: 'row',
    padding: dimensions.width(4),
    paddingLeft: dimensions.width(6), // extra padding to clear the accent bar
  },
  iconCircle: {
    width: dimensions.width(10),
    height: dimensions.width(10),
    borderRadius: dimensions.width(5),
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.width(3),
    marginTop: dimensions.height(0.2),
  },
  infoColumn: {
    flex: 1,
  },
  nameText: {
    fontSize: dimensions.height(2.0),
    fontWeight: '700',
    color: '#000000',
  },
  timeText: {
    fontSize: dimensions.height(1.8),
    color: '#6B7280',
    marginTop: dimensions.height(0.2),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: dimensions.height(0.4),
    paddingHorizontal: dimensions.width(2.5),
    borderRadius: dimensions.height(0.6),
    marginTop: dimensions.height(1),
  },
  badgeText: {
    fontSize: dimensions.height(1.6),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  detailsContainer: {
    marginTop: dimensions.height(0.8),
  },
  detailsText: {
    fontSize: dimensions.height(1.7),
    color: '#4B5563',
    marginTop: dimensions.height(0.4),
  },
  retryButton: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: dimensions.height(0.6),
    paddingVertical: dimensions.height(0.6),
    paddingHorizontal: dimensions.width(5),
    alignSelf: 'flex-start',
    marginTop: dimensions.height(1.2),
  },
  retryButtonText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: dimensions.height(1.7),
    letterSpacing: 0.5,
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: dimensions.width(2),
  },
});
