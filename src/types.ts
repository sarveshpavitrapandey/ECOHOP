
// User and Achievement types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  co2Saved: number;
  rank: number;
  location?: string;
}

export interface TreeLevel {
  level: number;
  co2Required: number;
  icon: string;
  name: string;
  description: string;
  pointsRequired: number;
  image: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  pointsReceived: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: RewardCategory;
  icon: string;
  status: "available" | "claimed" | "unavailable";
  claimedDate?: Date;
}

export type RewardCategory = "food" | "entertainment" | "merchandise" | "giftcards" | "transport" | "all";

// Transit route types
export type TransportType = 'bus' | 'metro' | 'walk';

export interface TransitRouteStep {
  type: TransportType;
  instructions: string;
  distance: number;
  duration: number;
  transitDetails?: {
    numStops: number;
  };
}

export interface TransitRoute {
  startAddress: string;
  endAddress: string;
  distance: number;
  duration: number;
  totalCo2Saved: number;
  steps: TransitRouteStep[];
}
