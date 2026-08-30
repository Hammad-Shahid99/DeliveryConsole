import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import dimensions from '../utils/dimensions';

interface UpcomingStopCardProps {
  stopNumber: number;
  name: string;
  address: string;
  isCompleted?: boolean;
  onPress?: () => void;
}

export default function UpcomingStopCard({
  stopNumber,
  name,
  address,
  isCompleted = false,
  onPress,
}: UpcomingStopCardProps) {
  // Use light green / green for completed stops, or light grey / dark grey for pending stops
  const badgeBg = isCompleted ? '#E6F4EA' : '#F3F4F6';
  const badgeTextColor = isCompleted ? '#10B981' : '#4B5563';

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.cardContainer}
    >
      <View style={styles.contentRow}>
        {/* Left Side Stop Number Badge */}
        <View style={[styles.badgeCircle, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {stopNumber}
          </Text>
        </View>

        {/* Middle Details */}
        <View style={styles.infoColumn}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.addressText}>{address}</Text>
        </View>

        {/* Right Status Icon */}
        <View style={styles.statusContainer}>
          {isCompleted ? (
            <Ionicons
              name="checkmark-circle-outline"
              size={dimensions.height(2.8)}
              color="#10B981"
            />
          ) : (
            <Ionicons
              name="chevron-forward-outline"
              size={dimensions.height(2.6)}
              color="#9CA3AF"
            />
          )}
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
    padding: dimensions.width(4),
    marginHorizontal: dimensions.width(4),
    marginVertical: dimensions.height(0.6),
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCircle: {
    width: dimensions.width(9),
    height: dimensions.width(9),
    borderRadius: dimensions.width(4.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: dimensions.height(2.0),
    fontWeight: 'bold',
  },
  infoColumn: {
    flex: 1,
    marginLeft: dimensions.width(4),
    justifyContent: 'center',
  },
  nameText: {
    fontSize: dimensions.height(2.0),
    fontWeight: '700',
    color: '#000000',
  },
  addressText: {
    fontSize: dimensions.height(1.7),
    color: '#4B5563',
    marginTop: dimensions.height(0.3),
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: dimensions.width(2),
  },
});
