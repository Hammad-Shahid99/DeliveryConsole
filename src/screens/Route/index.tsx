import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import SyncBanner from '../../components/SyncBanner';
import CurrentLocationCard from '../../components/CurrentLocationCard';
import ActiveStopCard from '../../components/ActiveStopCard';
import UpcomingStopCard from '../../components/UpcomingStopCard';
import dimensions from '../../utils/dimensions';
import { useRouteStore } from '../../state/useRouteStore';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import styles from './styles';

function DepartureBanner({ departureTime }: { departureTime: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(Math.floor((Date.now() - departureTime) / 1000));
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - departureTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [departureTime]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.departureBanner}>
      <Ionicons name="warning" size={dimensions.height(3)} color="#DC2626" />
      <View style={styles.departureTextContainer}>
        <Text style={styles.departureTitle}>Departed Zone Early</Text>
        <Text style={styles.departureSubtitle}>
          Time elapsed: {formatTime(elapsed)} (Return to zone to resume)
        </Text>
      </View>
    </View>
  );
}

export default function RouteScreen() {
  const navigation = useNavigation<any>();
  const {
    stops,
    activeStopIndex,
    completedStopIds,
    stopStatus,
    departureTime,
    currentLocation,
    isInsideZone,
    outbox,
    isOffline,
    toggleOffline,
    updateLocation,
    arriveAtStop,
  } = useRouteStore();

  const [devPanelCollapsed, setDevPanelCollapsed] = useState(false);

  const getActiveStopCenter = () => {
    const activeStop = stops[activeStopIndex];
    if (!activeStop) return null;
    const lats = activeStop.dropZone.map((v) => v.latitude);
    const lons = activeStop.dropZone.map((v) => v.longitude);
    const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const centerLon = lons.reduce((a, b) => a + b, 0) / lons.length;
    return { latitude: centerLat, longitude: centerLon };
  };

  const injectInsideZone = () => {
    const center = getActiveStopCenter();
    if (center) {
      updateLocation(center);
      updateLocation(center);
      updateLocation(center);
    }
  };

  const injectOutsideZone = () => {
    const center = getActiveStopCenter();
    if (center) {
      const outside = { latitude: center.latitude + 0.05, longitude: center.longitude + 0.05 };
      updateLocation(outside);
      updateLocation(outside);
      updateLocation(outside);
    }
  };

  const handleAction = async () => {
    const activeStop = stops[activeStopIndex];
    if (!activeStop) return;

    if (stopStatus === 'NOT_ARRIVED') {
      const success = await arriveAtStop();
      if (success) {
        console.log('Arrived successfully at stop.');
      }
    } else {
      navigation.navigate('ProofOfDelivery', {
        stopNumber: activeStop.sequence,
        name: activeStop.customerName,
        address: activeStop.address,
        parcelsCount: activeStop.parcelCount,
        templateId: activeStop.templateId,
      });
    }
  };

  const togglePanel = () => {
    setDevPanelCollapsed(!devPanelCollapsed);
  };

  const unsyncedCount = outbox.filter((item) => item.status !== 'synced').length;

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header
          title="Today's Route"
          iconName={isOffline ? 'cloud-offline-outline' : 'wifi'}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <SyncBanner 
            count={unsyncedCount} 
            onPress={() => navigation.navigate('Outbox')} 
          />

          <CurrentLocationCard
            latitude={currentLocation?.latitude || 0}
            longitude={currentLocation?.longitude || 0}
            isInsideZone={isInsideZone}
          />

          {stopStatus === 'DEPARTED_EARLY' && departureTime !== null && (
            <DepartureBanner departureTime={departureTime} />
          )}

          <Text style={styles.sectionHeader}>Route Stops</Text>

          {stops.map((stop, index) => {
            const isCompleted = completedStopIds.includes(stop.id);
            const isActive = index === activeStopIndex;

            if (isActive) {
              return (
                <ActiveStopCard
                  key={stop.id}
                  stopNumber={stop.sequence}
                  name={stop.customerName}
                  address={stop.address}
                  parcelsCount={stop.parcelCount}
                  deliveryTimeLimit={`Before ${new Date(stop.windowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  onArrivePress={handleAction}
                  onCardPress={handleAction}
                  buttonTitle={stopStatus === 'NOT_ARRIVED' ? 'ARRIVE' : 'DELIVER'}
                  buttonIconName={stopStatus === 'NOT_ARRIVED' ? 'location' : 'document-text-outline'}
                />
              );
            }

            return (
              <UpcomingStopCard
                key={stop.id}
                stopNumber={stop.sequence}
                name={stop.customerName}
                address={stop.address}
                isCompleted={isCompleted}
                onPress={isCompleted ? undefined : () => Alert.alert('Inactive Stop', 'Please complete active stops first.')}
              />
            );
          })}
        </ScrollView>

        <View style={styles.devPanel}>
          <TouchableOpacity activeOpacity={0.7} style={styles.devHeader} onPress={togglePanel}>
            <Text style={styles.devHeaderTitle}>🛠️ Location & Network Simulator (Dev)</Text>
            <Ionicons
              name={devPanelCollapsed ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color="#D97706"
            />
          </TouchableOpacity>

          {!devPanelCollapsed && (
            <View style={styles.devContent}>
              <Text style={styles.devText}>
                Mock GPS Coords: {currentLocation ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}` : 'No fix'} ({isInsideZone ? 'Inside zone' : 'Outside zone'})
              </Text>
              
              <View style={styles.devButtonRow}>
                <TouchableOpacity style={styles.devButton} onPress={injectInsideZone}>
                  <Text style={styles.devButtonText}>GPS: Inside Zone</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.devButton, styles.devButtonOutside]} onPress={injectOutsideZone}>
                  <Text style={styles.devButtonText}>GPS: Outside Zone</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.devButtonNetwork, isOffline ? styles.devButtonOnline : styles.devButtonOffline]} 
                onPress={toggleOffline}
              >
                <Text style={styles.devButtonText}>
                  Set Network: {isOffline ? 'ONLINE' : 'OFFLINE'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
