import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import routeData from '../data/route.json';
import { 
  initDB, 
  getSetting, 
  setSetting, 
  OutboxItem, 
  saveOutboxItem, 
  getOutboxItems, 
  deleteOutboxItem 
} from '../utils/db';
import { isPointInPolygon, getDistanceInMeters, Coordinate } from '../utils/geofence';

export type StopStatus = 'NOT_ARRIVED' | 'AT_STOP' | 'DEPARTED_EARLY' | 'COMPLETED';

export interface Stop {
  id: string;
  sequence: number;
  customerName: string;
  address: string;
  parcelCount: number;
  windowEnd: string;
  templateId: string;
  dropZone: Coordinate[];
}

interface RouteContextType {
  stops: Stop[];
  activeStopIndex: number;
  completedStopIds: string[];
  stopStatus: StopStatus;
  departureTime: number | null; // timestamp in ms
  currentLocation: Coordinate | null;
  isInsideZone: boolean;
  outbox: OutboxItem[];
  isOffline: boolean;
  
  // Actions
  toggleOffline: () => void;
  updateLocation: (coords: Coordinate) => void;
  arriveAtStop: () => Promise<boolean>;
  completeStop: (formResponses: any) => Promise<void>;
  retrySync: (id: string) => Promise<void>;
  forceSyncAll: () => Promise<void>;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [stops] = useState<Stop[]>(routeData.stops);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
  const [completedStopIds, setCompletedStopIds] = useState<string[]>([]);
  const [stopStatus, setStopStatus] = useState<StopStatus>('NOT_ARRIVED');
  const [departureTime, setDepartureTime] = useState<number | null>(null);
  
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [isInsideZone, setIsInsideZone] = useState<boolean>(false);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(true); // default to offline per screenshot

  // Noise and Jitter Filtering refs
  const lastLoggedLocation = useRef<Coordinate | null>(null);
  const consecutiveOutsideCount = useRef<number>(0);

  // Sync state reference to prevent concurrent sync passes (sequential sync requirement)
  const isSyncingRef = useRef<boolean>(false);

  // 1. Initialize SQLite database and load state
  useEffect(() => {
    async function loadPersistedState() {
      await initDB();
      
      // Load current active stop index
      const savedIndex = await getSetting('active_stop_index');
      if (savedIndex !== null) {
        setActiveStopIndex(parseInt(savedIndex, 10));
      }

      // Load completed stops
      const savedCompleted = await getSetting('completed_stop_ids');
      if (savedCompleted !== null) {
        setCompletedStopIds(JSON.parse(savedCompleted));
      }

      // Load stop status state machine
      const savedStatus = await getSetting('stop_status');
      if (savedStatus !== null) {
        setStopStatus(savedStatus as StopStatus);
      }

      // Load departure timestamp if departed early
      const savedDeparture = await getSetting('departure_time');
      if (savedDeparture !== null) {
        setDepartureTime(parseInt(savedDeparture, 10));
      }

      // Load outbox items
      const savedOutbox = await getOutboxItems();
      setOutbox(savedOutbox);
    }
    
    loadPersistedState();
  }, []);

  // 2. Location Update & Noise Filtering (Ray Casting)
  const updateLocation = (coords: Coordinate) => {
    setCurrentLocation(coords);

    const activeStop = stops[activeStopIndex];
    if (!activeStop || activeStopIndex >= stops.length) return;

    // A. Noise Filtering: Ignore location changes less than 10 meters
    if (lastLoggedLocation.current !== null) {
      const distance = getDistanceInMeters(lastLoggedLocation.current, coords);
      if (distance < 10) return;
    }
    
    lastLoggedLocation.current = coords;

    // B. Point-in-Polygon containment calculation
    const inside = isPointInPolygon(coords, activeStop.dropZone);
    setIsInsideZone(inside);
    
    // C. Jitter Filter: Require 3 consecutive outside fixes to trigger early departure alert
    if (inside) {
      consecutiveOutsideCount.current = 0;
      if (stopStatus === 'DEPARTED_EARLY') {
        setStopStatus('AT_STOP');
        setSetting('stop_status', 'AT_STOP');
        setDepartureTime(null);
        setSetting('departure_time', '');
      }
    } else {
      if (stopStatus === 'AT_STOP') {
        consecutiveOutsideCount.current += 1;
        if (consecutiveOutsideCount.current >= 3) {
          const now = Date.now();
          setStopStatus('DEPARTED_EARLY');
          setSetting('stop_status', 'DEPARTED_EARLY');
          setDepartureTime(now);
          setSetting('departure_time', now.toString());
        }
      }
    }
  };

  // 3. Arrive Gate Control
  const arriveAtStop = async (): Promise<boolean> => {
    if (!isInsideZone) {
      Alert.alert('Cannot Arrive', 'You must be inside the delivery zone to mark arrival.');
      return false;
    }

    setStopStatus('AT_STOP');
    await setSetting('stop_status', 'AT_STOP');
    return true;
  };

  // 4. Complete Stop (Proof of Delivery Form Submission)
  const completeStop = async (formResponses: any) => {
    const activeStop = stops[activeStopIndex];
    if (!activeStop) return;

    // A. Create new outbox delivery record (id acts as stable idempotency key)
    const clientDeliveryId = `del-${Math.random().toString(36).substr(2, 9)}`;
    const newDelivery: OutboxItem = {
      id: clientDeliveryId,
      stopId: activeStop.id,
      templateId: activeStop.templateId,
      completedAt: new Date().toISOString(),
      latitude: currentLocation?.latitude || 0,
      longitude: currentLocation?.longitude || 0,
      payload: JSON.stringify(formResponses),
      status: 'queued',
      retryCount: 0,
      nextAttemptSec: 0,
    };

    // B. Save to SQLite database
    await saveOutboxItem(newDelivery);
    
    // C. Update Local state list
    const updatedOutbox = await getOutboxItems();
    setOutbox(updatedOutbox);

    // D. Mark stop completed, clear state machine
    const newCompleted = [...completedStopIds, activeStop.id];
    setCompletedStopIds(newCompleted);
    await setSetting('completed_stop_ids', JSON.stringify(newCompleted));

    // Reset status machine for next stop
    setStopStatus('NOT_ARRIVED');
    await setSetting('stop_status', 'NOT_ARRIVED');
    setDepartureTime(null);
    await setSetting('departure_time', '');
    consecutiveOutsideCount.current = 0;

    // E. Advance active stop
    const nextIndex = activeStopIndex + 1;
    setActiveStopIndex(nextIndex);
    await setSetting('active_stop_index', nextIndex.toString());

    Alert.alert('Saved locally', 'Delivery completed. POD saved to outbox.');
    
    // Trigger background sync pass
    triggerSyncPass();
  };

  // 5. Offline Toggle Action
  const toggleOffline = () => {
    const nextOffline = !isOffline;
    setIsOffline(nextOffline);
    if (!nextOffline) {
      triggerSyncPass();
    }
  };

  // 6. Sequential Sync pass execution (Exponential Backoff)
  const triggerSyncPass = async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      const outboxList = await getOutboxItems();
      const pendingList = outboxList.filter((item) => {
        if (item.status === 'synced' || item.status === 'failed') return false;
        if (item.status === 'retrying' && item.nextAttemptSec > 0) {
          return item.nextAttemptSec <= 0;
        }
        return true;
      });

      for (const item of pendingList) {
        if (isOffline) break;

        // Set status to syncing
        item.status = 'syncing';
        await saveOutboxItem(item);
        setOutbox(await getOutboxItems());

        try {
          // Mock server latency
          await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

          if (isOffline) {
            throw new Error('Network Error');
          }

          // Mock 400 Client Error: Refused but reason field is missing in response
          if (item.payload.includes('Refused') && !item.payload.includes('Reason')) {
            item.status = 'failed';
            item.errorMessage = '400: Refusal reason missing';
            await saveOutboxItem(item);
            continue;
          }

          // Mock 409 Conflict: idempotency key already processed (treated as success)
          if (item.payload.includes('Left with neighbor') && Math.random() < 0.5) {
            await deleteOutboxItem(item.id);
            continue;
          }

          // Success: Synced
          await deleteOutboxItem(item.id);
        } catch (error: any) {
          const newRetryCount = item.retryCount + 1;
          if (newRetryCount >= 5) {
            item.status = 'failed';
            item.errorMessage = 'Max retries exhausted (5/5)';
          } else {
            item.status = 'retrying';
            item.retryCount = newRetryCount;
            item.nextAttemptSec = newRetryCount * 5; // Simple retry cooldown multiplier
          }
          await saveOutboxItem(item);
        }
      }
    } catch (err) {
      console.error('Error running sync pass:', err);
    } finally {
      isSyncingRef.current = false;
      const finalOutbox = await getOutboxItems();
      setOutbox(finalOutbox);
    }
  };

  // 7. Manual retry button action (resets counter and triggers sync)
  const retrySync = async (id: string) => {
    const list = await getOutboxItems();
    const item = list.find((i) => i.id === id);
    if (item) {
      item.status = 'queued';
      item.retryCount = 0;
      item.nextAttemptSec = 0;
      item.errorMessage = undefined;
      await saveOutboxItem(item);
      setOutbox(await getOutboxItems());
      
      // Run sync pass if online
      if (!isOffline) {
        triggerSyncPass();
      } else {
        Alert.alert('Offline', 'Cannot sync while offline. Toggled online automatically?');
      }
    }
  };

  // Force-sync button
  const forceSyncAll = async () => {
    if (isOffline) {
      Alert.alert('Sync Blocked', 'Turn on network connectivity before syncing.');
      return;
    }
    triggerSyncPass();
  };

  // 8. Timers & Heartbeats:
  // A. Backoff countdown timer (decrements nextAttemptSec by 1 every second)
  useEffect(() => {
    const interval = setInterval(async () => {
      let outboxList = await getOutboxItems();
      let hasChanges = false;

      for (const item of outboxList) {
        if (item.status === 'retrying' && item.nextAttemptSec > 0) {
          item.nextAttemptSec -= 1;
          await saveOutboxItem(item);
          hasChanges = true;
        }
      }

      if (hasChanges) {
        setOutbox(await getOutboxItems());
        // If countdown hit zero on any, try a sync pass
        if (!isOffline) {
          triggerSyncPass();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOffline]);

  // B. Sync Heartbeat: runs a background sync check every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOffline) {
        triggerSyncPass();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isOffline]);

  return (
    <RouteContext.Provider
      value={{
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
        completeStop,
        retrySync,
        forceSyncAll,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRouteStore() {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error('useRouteStore must be used within a RouteProvider');
  }
  return context;
}
