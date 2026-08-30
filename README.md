# Last-Mile Offline-First Delivery Console (React Native CLI)

Welcome! This is a React Native CLI application implementing a geofence-gated, offline-first delivery courier console. It allows couriers to complete sequence stops, validates geofences using custom polygon checks, and automatically syncs completed forms back to the server when network signals recover.

---

## 🏗️ Architecture Design

The application is structured to strictly separate business and data processing rules from the UI rendering layer, ensuring modularity and testability.

* **Database Layer (`db.ts`)**: Built on local SQLite database persistence utilizing `react-native-sqlite-storage`. Relational tables `outbox` and `route_state` track the offline delivery queue and progress parameters, surviving force-closes.
* **Geofence Engine (`geofence.ts`)**: Contains hand-written coordinate math algorithms, specifically the Haversine formula for distance tracking and a Ray-Casting algorithm to evaluate irregular polygon boundaries.
* **State Machine Store (`useRouteStore.tsx`)**: Acts as the central route context. It drives the sequence progress, handles GPS noise filters, triggers sequential sync loops, and manages exponential backoff retry counters.
* **UI Components**: Dumb, reusable screens and components styled responsively using a `dimensions` utility mapping relative percentages to device width/height.

---

## 🛠️ Geofencing & Jitter Noise Filtering

1. **Ray Casting Point-in-Polygon**: Evaluates if the current coordinates are inside the active stop's irregular coordinate boundary (`dropZone`) by projecting an imaginary ray and counting line crossings.
2. **Haversine Distance Filter**: Ignores GPS coordinates within 10 meters of the last evaluated location, filtering out static coordinate noise.
3. **Jitter Boundary Shield**: Transitions between `AT_STOP` and `DEPARTED_EARLY` states require **3 consecutive fixes** outside the polygon boundary to prevent boundary jitter from prematurely firing early-departure alerts.

---

## 🔄 Offline Outbox Queue & Sync Engine

Deliveries are saved locally inside SQLite immediately on form submission, allowing couriers to complete routes under any network conditions.

* **Idempotency Keys**: Each delivery is saved with a client-generated UUID that remains stable across all attempts.
* **Sequential Sync**: Sync passes process deliveries one by one (oldest-first) in the background to ensure strict sequence tracking.
* **Retry & Backoff**:
  * **Network/5xx Errors**: Retried with exponential backoff timers (cooldown periods increment by `retryCount * 5` seconds).
  * **Max Attempts (5)**: After 5 attempts, the item is parked in a terminal `FAILED` state. Manual retry from the Outbox screen resets the counter and queues it again.
  * **Client 400 Errors**: Bad requests (e.g. missing reason text) are parked in the `FAILED` state immediately since retrying will not resolve them.
  * **Server 409 Conflicts**: Treated as already processed by the server, leading to a successful dequeue.

---

## 🛠️ How to Test and Run

### Step 1: Install Dependencies
From the project root directory, run:
```bash
npm install
```

### Step 2: Start Metro Server
Open a terminal and start the React Native packager:
```bash
npm start
```

### Step 3: Run the Application
Open a new terminal and launch the app in your target emulator:
* **Android**: `npm run android`
* **iOS**: `npm run ios` (Remember to run `cd ios && pod install` first)

---

## 🧪 Interactive Debug Panel (Simulating GPS & Offline Mode)

Since we are running on an emulator, the screen displays a collapsible **Dev Panel** at the bottom to simulate location updates and network drops:

1. **GPS: Inside Zone**: Simulates moving inside M. Okafor's drop zone. Tapping **ARRIVE** on the card will now succeed, transitioning the action button to **DELIVER**.
2. **GPS: Outside Zone**: Simulates moving away. If tapped after arriving, an early departure countdown banner will slide into view showing time elapsed since departure.
3. **Set Network (Online/Offline)**: Simulates toggling Airplane Mode.
   * Toggle **OFFLINE** and submit a POD form. The stop completes locally, and the delivery is queued in the Outbox.
   * Toggle **ONLINE** and watch the sync pass automatically pick it up and process it in the background!

---

## 🚀 If I Had Another Day...

1. **Integrate OS Geofencing APIs**: Implement background location permissions (`@react-native-community/geolocation` or background geolocation packages) to wake the app and log departure timestamps even when the screen is locked.
2. **Visual Map Rendering**: Implement interactive maps (`react-native-maps`) plotting the route nodes, current marker, and a semi-transparent colored geofence polygon.
3. **Camera Compressor**: Implement photo verification with local caching, resizing, and base64 compression before saving to the SQLite outbox, ensuring media transfers are optimized.
