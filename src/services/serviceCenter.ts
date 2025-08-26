// Mock service centers data - in a real app, this would come from an API
const serviceCenters = [
  {
    id: 1,
    name: "Honda Service Center Downtown",
    address: "123 Main St, Downtown",
    lat: 40.7589,
    lng: -73.9851,
    specialties: ["Engine Oil System", "Brake System", "General Maintenance"],
    phone: "(555) 123-4567"
  },
  {
    id: 2,
    name: "AutoCare Plus",
    address: "456 Oak Ave, Midtown", 
    lat: 40.7505,
    lng: -73.9934,
    specialties: ["Air Filter", "Fuel Filter", "Engine Oil System"],
    phone: "(555) 234-5678"
  },
  {
    id: 3,
    name: "Quick Lube & Service",
    address: "789 Pine St, Uptown",
    lat: 40.7614,
    lng: -73.9776,
    specialties: ["Engine Oil System", "Air Filter", "Quick Service"],
    phone: "(555) 345-6789"
  }
];

export interface ServiceCenter {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  specialties: string[];
  phone: string;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function findNearestServiceCenter(component: string): Promise<ServiceCenter | null> {
  try {
    // Get user's current location
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      });
    });

    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    // Filter service centers that can handle the specific component
    const relevantCenters = serviceCenters.filter(center => 
      center.specialties.includes(component) || 
      center.specialties.includes("General Maintenance")
    );

    if (relevantCenters.length === 0) {
      return serviceCenters[0]; // Fallback to first center
    }

    // Find the nearest service center
    let nearestCenter = relevantCenters[0];
    let minDistance = calculateDistance(userLat, userLng, nearestCenter.lat, nearestCenter.lng);

    for (const center of relevantCenters.slice(1)) {
      const distance = calculateDistance(userLat, userLng, center.lat, center.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCenter = center;
      }
    }

    return nearestCenter;
  } catch (error) {
    console.error('Error getting location:', error);
    // Fallback to a default service center if location access fails
    return serviceCenters.find(center => 
      center.specialties.includes(component) || 
      center.specialties.includes("General Maintenance")
    ) || serviceCenters[0];
  }
}

export function openGoogleMaps(serviceCenter: ServiceCenter) {
  const destination = encodeURIComponent(serviceCenter.address);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
  
  // Open in new tab/window
  window.open(googleMapsUrl, '_blank');
}