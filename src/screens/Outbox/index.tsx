import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import OutboxItem from '../../components/OutboxItem';
import dimensions from '../../utils/dimensions';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useRouteStore } from '../../state/useRouteStore';
import styles from './styles';

export default function OutboxScreen() {
  const { outbox, stops, retrySync, forceSyncAll } = useRouteStore();

  const getCustomerName = (stopId: string) => {
    const stop = stops.find((s) => s.id === stopId);
    return stop ? stop.customerName : 'Unknown Recipient';
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '00:00';
    }
  };

  const pendingCount = outbox.filter((item) => item.status !== 'synced').length;

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header
          title="Outbox"
          iconName="refresh"
          onMenuPress={forceSyncAll}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.syncPromptCard}
            onPress={forceSyncAll}
          >
            <View style={styles.syncCardLeft}>
              <Text style={styles.syncCardTitle}>
                {pendingCount} {pendingCount === 1 ? 'delivery' : 'deliveries'} waiting
              </Text>
              <Text style={styles.syncCardSubtitle}>Pull to sync</Text>
            </View>

            <View style={styles.syncIconContainer}>
              <Ionicons
                name="cloud-upload-outline"
                size={dimensions.height(3.5)}
                color="#1E60D5"
              />
            </View>
          </TouchableOpacity>

          {outbox.map((item) => (
            <OutboxItem
              key={item.id}
              name={getCustomerName(item.stopId)}
              time={formatTime(item.completedAt)}
              status={item.status}
              retryCount={item.retryCount}
              nextAttemptSec={item.nextAttemptSec}
              errorMessage={item.errorMessage}
              onRetryPress={() => retrySync(item.id)}
              onPress={() => console.log('Item pressed:', item.id)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
