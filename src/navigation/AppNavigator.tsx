import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteScreen from '../screens/Route';
import OutboxScreen from '../screens/Outbox';
import ProofOfDeliveryScreen from '../screens/ProofOfDelivery';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: { display: 'none' },
      }}
    >
      <Tab.Screen
        name="Route"
        component={RouteScreen}
      />
      <Tab.Screen
        name="Outbox"
        component={OutboxScreen}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ProofOfDelivery" component={ProofOfDeliveryScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
