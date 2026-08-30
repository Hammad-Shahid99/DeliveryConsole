import SQLite from 'react-native-sqlite-storage';

// Enable SQLite promises so we can use async/await instead of callbacks
SQLite.enablePromise(true);

let dbInstance: SQLite.SQLiteDatabase | null = null;

// Opens and caches the database connection
export async function getDB() {
  if (dbInstance) return dbInstance;
  
  // Creates or opens a database named 'delivery.db' in the default location
  dbInstance = await SQLite.openDatabase({
    name: 'delivery.db',
    location: 'default',
  });
  return dbInstance;
}

// Sets up the table schemas if they do not already exist
export async function initDB() {
  const db = await getDB();

  // 1. route_state table: stores key-value settings (e.g. current stop index, early departure times)
  await db.executeSql(
    'CREATE TABLE IF NOT EXISTS route_state (key TEXT PRIMARY KEY, value TEXT)'
  );

  // 2. outbox table: stores offline deliveries waiting to be synced with retry counters
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY,
      stopId TEXT,
      templateId TEXT,
      completedAt TEXT,
      latitude REAL,
      longitude REAL,
      payload TEXT,
      status TEXT,
      retryCount INTEGER DEFAULT 0,
      nextAttemptSec INTEGER DEFAULT 0,
      errorMessage TEXT
    )`
  );
  
  console.log('SQLite Database schema initialized successfully!');
}

// ----------------------------------------------------
// KEY-VALUE HELPERS (Used for simple states like activeStopIndex)
// ----------------------------------------------------

export async function getSetting(key: string): Promise<string | null> {
  try {
    const db = await getDB();
    const [results] = await db.executeSql('SELECT value FROM route_state WHERE key = ?', [key]);
    if (results.rows.length > 0) {
      return results.rows.item(0).value;
    }
  } catch (error) {
    console.error(`DB Error getting key ${key}:`, error);
  }
  return null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  try {
    const db = await getDB();
    await db.executeSql(
      'INSERT OR REPLACE INTO route_state (key, value) VALUES (?, ?)',
      [key, value]
    );
  } catch (error) {
    console.error(`DB Error setting key ${key}:`, error);
  }
}

// ----------------------------------------------------
// OUTBOX QUEUE HELPERS (Used for offline queueing & sync)
// ----------------------------------------------------

export interface OutboxItem {
  id: string; // client generated UUID (idempotency key)
  stopId: string;
  templateId: string;
  completedAt: string;
  latitude: number;
  longitude: number;
  payload: string; // stringified JSON form responses
  status: 'queued' | 'syncing' | 'retrying' | 'failed' | 'synced';
  retryCount: number;
  nextAttemptSec: number;
  errorMessage?: string;
}

// Inserts a new delivery or updates an existing one (e.g. status changes during retries)
export async function saveOutboxItem(item: OutboxItem): Promise<void> {
  try {
    const db = await getDB();
    await db.executeSql(
      `INSERT OR REPLACE INTO outbox (
        id, stopId, templateId, completedAt, latitude, longitude, payload, status, retryCount, nextAttemptSec, errorMessage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.stopId,
        item.templateId,
        item.completedAt,
        item.latitude,
        item.longitude,
        item.payload,
        item.status,
        item.retryCount,
        item.nextAttemptSec,
        item.errorMessage || null,
      ]
    );
  } catch (error) {
    console.error('DB Error saving outbox item:', error);
  }
}

// Loads all outbox items in order (oldest first)
export async function getOutboxItems(): Promise<OutboxItem[]> {
  try {
    const db = await getDB();
    const [results] = await db.executeSql('SELECT * FROM outbox ORDER BY completedAt ASC');
    const items: OutboxItem[] = [];
    
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      items.push({
        id: row.id,
        stopId: row.stopId,
        templateId: row.templateId,
        completedAt: row.completedAt,
        latitude: row.latitude,
        longitude: row.longitude,
        payload: row.payload,
        status: row.status,
        retryCount: row.retryCount,
        nextAttemptSec: row.nextAttemptSec,
        errorMessage: row.errorMessage || undefined,
      });
    }
    return items;
  } catch (error) {
    console.error('DB Error getting outbox items:', error);
    return [];
  }
}

// Deletes a synced delivery to clear local storage space
export async function deleteOutboxItem(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.executeSql('DELETE FROM outbox WHERE id = ?', [id]);
  } catch (error) {
    console.error('DB Error deleting outbox item:', error);
  }
}
