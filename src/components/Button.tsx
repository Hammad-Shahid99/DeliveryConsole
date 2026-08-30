import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import dimensions from '../utils/dimensions';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle;
}

export default function Button({ title, onPress, iconName, style }: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.buttonContainer, style]}
    >
      {iconName && (
        <Ionicons
          name={iconName}
          size={dimensions.height(2.2)}
          color="white"
          style={styles.buttonIcon}
        />
      )}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#1E60D5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: dimensions.height(6),
    borderRadius: dimensions.height(1),
  },
  buttonIcon: {
    marginRight: dimensions.width(2),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: dimensions.height(2.0),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
