export type RouteId = "estimate";

export interface NearbyPlace {
  id: string;
  name: string;
  category?: string | null;
  facilities?: string | null;
  address?: string;
  region?: string;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
  source: string;
}

export interface Destination {
  id: string;
  name: string;
  address: string;
  region: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  contentTypeId: string | null;
  tel: string | null;
  modifiedAt: string | null;
  source: "KorService2";
  concentrationRate: number | null;
  concentrationDate: string | null;
  calm: number | null;
  distanceKm: number | null;
  travelMinutesEstimate: number | null;
  travelEstimateMethod: string | null;
  nearbyCampgrounds: NearbyPlace[];
  relatedPlaces: NearbyPlace[];
  accessible: boolean | null;
  cloud: number | null;
  parkingMinutes: number | null;
  observingWindow: string | null;
}

export interface PlannerState {
  departure: string;
  date: string;
  time: string;
  people: "1" | "2" | "3" | "4";
  transport: "car" | "rental";
  accessibility: boolean;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  locationSource: "unset" | "device" | "manual";
}

export interface RouteEstimate {
  id: RouteId;
  title: string;
  durationMinutes: number;
  duration: string;
  distance: string;
  note: string;
}

export interface SavedJourneyItem {
  id: string;
  destinationId: string;
  destinationName: string;
  destinationAddress: string;
  destinationRegion: string;
  imageUrl: string | null;
  calm: number | null;
  distanceKm: number | null;
  travelMinutesEstimate: number | null;
  date: string;
  departureTime: string;
  departureName: string;
  campgroundCount: number;
  relatedCount: number;
  savedAt: string;
}
