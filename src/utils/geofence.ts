export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Checks if a point is inside a polygon using the Ray-Casting algorithm.
 * 
 * How it works:
 * Imagine drawing a horizontal line (a "ray") starting from the point and going to the right.
 * We count how many times this line intersects the edges of the polygon.
 * - If it intersects an ODD number of times, the point is INSIDE.
 * - If it intersects an EVEN number of times, the point is OUTSIDE.
 * 
 * We map Latitude to the Y-axis and Longitude to the X-axis.
 */
export function isPointInPolygon(point: Coordinate, polygon: Coordinate[]): boolean {
  if (!polygon || polygon.length < 3) return false;

  let x = point.longitude;
  let y = point.latitude;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].longitude;
    let yi = polygon[i].latitude;
    let xj = polygon[j].longitude;
    let yj = polygon[j].latitude;

    // Check if the ray intersects the edge between vertex i and vertex j
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Calculates the great-circle distance between two coordinates in meters
 * using the Haversine formula.
 */
export function getDistanceInMeters(coords1: Coordinate, coords2: Coordinate): number {
  const EARTH_RADIUS = 6371000; // Radius of the Earth in meters
  
  const dLat = deg2rad(coords2.latitude - coords1.latitude);
  const dLon = deg2rad(coords2.longitude - coords1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coords1.latitude)) * Math.cos(deg2rad(coords2.latitude)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS * c; // Distance in meters
  
  return distance;
}

// Helper to convert degrees to radians
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
