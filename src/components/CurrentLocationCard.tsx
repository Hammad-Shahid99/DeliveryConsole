import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import dimensions from '../utils/dimensions';

interface CurrentLocationCardProps {
  latitude: number;
  longitude: number;
  isInsideZone?: boolean;
}

export default function CurrentLocationCard({
  latitude,
  longitude,
  isInsideZone = true,
}: CurrentLocationCardProps) {
  return (
    <View style={styles.cardContainer}>
      {/* Left Details Column */}
      <View style={styles.leftColumn}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <Ionicons
            name="location"
            size={dimensions.height(2.6)}
            color="#1E60D5"
          />
          <Text style={styles.titleText}>Current Location</Text>
        </View>

        {/* Coordinates Row */}
        <View style={styles.coordsRow}>
          <Ionicons
            name="ellipse"
            size={dimensions.height(1.2)}
            color="#BDC5D0"
          />
          <Text style={styles.coordsText}>
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
        </View>

        {/* Delivery Zone Badge */}
        {isInsideZone ? (
          <View style={styles.zoneBadge}>
            <Ionicons
              name="checkmark"
              size={dimensions.height(1.8)}
              color="#10B981"
            />
            <Text style={styles.zoneText}>Inside delivery zone</Text>
          </View>
        ) : (
          <View style={[styles.zoneBadge, styles.zoneBadgeOutside]}>
            <Ionicons
              name="close"
              size={dimensions.height(1.8)}
              color="#DC2626"
            />
            <Text style={[styles.zoneText, styles.zoneTextOutside]}>
              Outside delivery zone
            </Text>
          </View>
        )}
      </View>

      {/* Right Column: Custom Mini-Map Illustration */}
      <View style={styles.rightColumn}>
        <View style={styles.mapCircle}>
          {/* Map Grid Lines */}
          <View style={styles.mapLineVertical} />
          <View style={styles.mapLineHorizontal} />
          <View style={styles.mapLineDiagonal} />

          {/* Delivery Zone Polygon */}
          <View style={styles.zonePolygon} />

          {/* Current Location Blue Dot */}
          <View style={styles.locationPinOuter}>
            <View style={styles.locationPinInner} />
          </View>
        </View>
      </View>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 2,
  },
  leftColumn: {
    flex: 1,
    paddingRight: dimensions.width(2),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dimensions.height(0.6),
  },
  titleText: {
    fontSize: dimensions.height(2.0),
    fontWeight: '700',
    color: '#000000',
    marginLeft: dimensions.width(2),
  },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dimensions.height(1.5),
    paddingLeft: dimensions.width(1.5),
  },
  coordsText: {
    fontSize: dimensions.height(1.8),
    color: '#4B5563',
    marginLeft: dimensions.width(2),
  },
  zoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingVertical: dimensions.height(0.6),
    paddingHorizontal: dimensions.width(3),
    borderRadius: dimensions.height(2),
    alignSelf: 'flex-start',
  },
  zoneBadgeOutside: {
    backgroundColor: '#FFEBEB',
  },
  zoneText: {
    fontSize: dimensions.height(1.7),
    fontWeight: '600',
    color: '#10B981',
    marginLeft: dimensions.width(1.5),
  },
  zoneTextOutside: {
    color: '#DC2626',
  },
  rightColumn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCircle: {
    width: dimensions.width(24),
    height: dimensions.width(24),
    borderRadius: dimensions.width(12),
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapLineVertical: {
    width: 2,
    height: '100%',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: '45%',
  },
  mapLineHorizontal: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: '55%',
  },
  mapLineDiagonal: {
    width: 2,
    height: '150%',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  zonePolygon: {
    width: '65%',
    height: '65%',
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    position: 'absolute',
    borderRadius: dimensions.height(1.5),
    transform: [{ rotate: '15deg' }],
  },
  locationPinOuter: {
    width: dimensions.width(5),
    height: dimensions.width(5),
    borderRadius: dimensions.width(2.5),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },
  locationPinInner: {
    width: dimensions.width(2.6),
    height: dimensions.width(2.6),
    borderRadius: dimensions.width(1.3),
    backgroundColor: '#1E60D5',
  },
});
