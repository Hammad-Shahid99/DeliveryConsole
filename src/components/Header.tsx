import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import dimensions from '../utils/dimensions';

interface HeaderProps {
  title: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  onMenuPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({
  title,
  iconName,
  onMenuPress,
  showBackButton = false,
  onBackPress,
}: HeaderProps) {
  const isOffline = iconName.includes('offline');
  const badgeColor = isOffline ? '#DC2626' : '#10B981';

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={showBackButton ? onBackPress : onMenuPress}
        style={styles.iconButton}
      >
        <Ionicons
          name={showBackButton ? "arrow-back-outline" : "menu-outline"}
          size={dimensions.height(3.2)}
          color="#1A1A1A"
        />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <Ionicons
        name={iconName}
        size={dimensions.height(2.5)}
        color={badgeColor}
      />


    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    height: dimensions.height(7),
    paddingHorizontal: dimensions.width(4),
  },
  iconButton: {
    padding: dimensions.width(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: dimensions.width(2),
  },
  titleText: {
    fontSize: dimensions.height(2.2),
    fontWeight: '700',
    color: '#000000',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dimensions.height(0.6),
    paddingHorizontal: dimensions.width(3),
    borderRadius: dimensions.height(2),
    gap: dimensions.width(1.5),
  },
  statusText: {
    fontSize: dimensions.height(1.4),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
