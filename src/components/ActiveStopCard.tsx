import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import dimensions from '../utils/dimensions';
import Button from './Button';

interface ActiveStopCardProps {
  stopNumber: number;
  name: string;
  address: string;
  parcelsCount: number;
  deliveryTimeLimit: string;
  onArrivePress?: () => void;
  onCardPress?: () => void;
  buttonTitle?: string;
  buttonIconName?: React.ComponentProps<typeof Ionicons>['name'];
}

export default function ActiveStopCard({
  stopNumber,
  name,
  address,
  parcelsCount,
  deliveryTimeLimit,
  onArrivePress,
  onCardPress,
  buttonTitle = 'ARRIVE',
  buttonIconName = 'location',
}: ActiveStopCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={onCardPress ? 0.7 : 1}
      onPress={onCardPress}
      disabled={!onCardPress}
      style={styles.cardContainer}
    >
      {/* Top Part: Contains Badge, Info, and Chevron Arrow */}
      <View style={styles.topSection}>
        {/* Circle Badge with Stop Number */}
        <View style={styles.badgeCircle}>
          <Text style={styles.badgeText}>{stopNumber}</Text>
        </View>

        {/* Stop details (Name, Address, Parcels, Time) */}
        <View style={styles.infoColumn}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.addressText}>{address}</Text>

          {/* Row for Parcels Info */}
          <View style={styles.infoRow}>
            <Ionicons
              name="cube-outline"
              size={dimensions.height(2.2)}
              color="#4B5563"
            />
            <Text style={styles.infoText}>
              {parcelsCount} {parcelsCount === 1 ? 'Parcel' : 'Parcels'}
            </Text>
          </View>

          {/* Row for Time Info */}
          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={dimensions.height(2.2)}
              color="#4B5563"
            />
            <Text style={styles.infoText}>{deliveryTimeLimit}</Text>
          </View>
        </View>

        {/* Chevron Right Arrow */}
        <View style={styles.chevronContainer}>
          <Ionicons
            name="chevron-forward-outline"
            size={dimensions.height(2.6)}
            color="#4B5563"
          />
        </View>
      </View>

      {/* Arrive Button */}
      <Button
        title={buttonTitle}
        iconName={buttonIconName}
        onPress={onArrivePress}
        style={{ marginTop: dimensions.height(2) }}
      />
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
    marginVertical: dimensions.height(1),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topSection: {
    flexDirection: 'row',
  },
  badgeCircle: {
    width: dimensions.width(9),
    height: dimensions.width(9),
    borderRadius: dimensions.width(4.5),
    backgroundColor: '#1E60D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: dimensions.height(2.0),
    fontWeight: 'bold',
  },
  infoColumn: {
    flex: 1,
    marginLeft: dimensions.width(4),
  },
  nameText: {
    fontSize: dimensions.height(2.2),
    fontWeight: '700',
    color: '#000000',
  },
  addressText: {
    fontSize: dimensions.height(1.8),
    color: '#4B5563',
    marginTop: dimensions.height(0.5),
    lineHeight: dimensions.height(2.6),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dimensions.height(1.0),
  },
  infoText: {
    fontSize: dimensions.height(1.8),
    color: '#4B5563',
    marginLeft: dimensions.width(2),
  },
  chevronContainer: {
    justifyContent: 'flex-start',
    paddingTop: dimensions.height(0.5),
  },
  arriveButton: {
    backgroundColor: '#1E60D5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: dimensions.height(6),
    borderRadius: dimensions.height(1),
    marginTop: dimensions.height(2),
  },
  buttonIcon: {
    marginRight: dimensions.width(2),
  },
  arriveButtonText: {
    color: '#FFFFFF',
    fontSize: dimensions.height(2.0),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
