

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

// Tree level type for EcoTree component
export interface TreeLevel {
  level: number;
  pointsRequired: number;
  image: string;
  name?: string;
  description?: string;
  icon?: string;
  co2Required?: number;
}

// Organization type for Donate page
export interface Organization {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  impact?: string;
  pointsToRedeem?: number;
  logo?: string;
  category?: string;
  pointsReceived?: number;
}

// Reward types for Rewards page
export interface Reward {
  id?: string;
  name: string;
  description: string;
  category: string;
  pointsCost: number;
  image: string;
  availableUntil?: Date;
  isActive?: boolean;
  title?: string;
  imageUrl?: string;
  validUntil?: Date;
  isHighlighted?: boolean;
  couponCode?: string;
}

export interface RewardClaim {
  id?: string;
  userId: string;
  rewardId: string;
  rewardName?: string;
  pointsCost?: number;
  claimDate: Date;
  claimedAt?: {
    toDate: () => Date;
  };
  status: 'active' | 'used' | 'expired';
  code?: string;
  couponCode?: string;
  isUsed?: boolean;
}

// Leaderboard user type for HomePage
export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  co2Saved: number;
  rank: number;
  avatar?: string;
}
