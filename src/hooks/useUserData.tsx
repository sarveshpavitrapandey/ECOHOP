
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  city?: string;
  preferredTransport?: string;
  totalPoints: number;
  co2Saved: number;
  totalTrips: number;
  streak: number;
  bestStreak: number;
  joinedDate: string;
  unlockedBadges: string[];
}

// Mock data for dummy user
const createMockUserData = (uid: string, displayName: string, email: string, photoURL?: string): UserProfile => {
  return {
    uid,
    displayName,
    email,
    photoURL,
    city: "Pimpri",
    preferredTransport: "metro",
    totalPoints: 350,
    co2Saved: 78.5,
    totalTrips: 24,
    streak: 5,
    bestStreak: 12,
    joinedDate: new Date().toISOString(),
    unlockedBadges: ["eco-starter", "commuter", "first-trip"]
  };
};

const mockTransitBookings = [
  {
    id: "booking1",
    userId: "user1",
    fromStopId: "stop1",
    fromStopName: "Downtown",
    toStopId: "stop2",
    toStopName: "Uptown",
    transitType: "metro",
    date: { toDate: () => new Date(Date.now() + 86400000) }, // tomorrow
    bookingTime: { toDate: () => new Date() },
    distance: 8.5,
    co2Saved: 2.5,
    pointsEarned: 12,
    status: "upcoming"
  },
  {
    id: "booking2",
    userId: "user1",
    fromStopId: "stop3",
    fromStopName: "Eastside",
    toStopId: "stop4",
    toStopName: "Westside",
    transitType: "bus",
    date: { toDate: () => new Date(Date.now() - 86400000) }, // yesterday
    bookingTime: { toDate: () => new Date(Date.now() - 172800000) }, // 2 days ago
    distance: 12.3,
    co2Saved: 3.2,
    pointsEarned: 16,
    status: "completed"
  }
];

const mockRewardClaims = [
  {
    id: "claim1",
    userId: "user1",
    rewardId: "reward1",
    rewardName: "Free Coffee",
    pointsCost: 100,
    claimDate: { toDate: () => new Date(Date.now() - 604800000) }, // 1 week ago
    status: "redeemed"
  }
];

// Store our mock data in localStorage for persistence
const initializeLocalStorage = () => {
  if (!localStorage.getItem("ecoHopUserProfiles")) {
    localStorage.setItem("ecoHopUserProfiles", JSON.stringify({}));
  }
  
  if (!localStorage.getItem("ecoHopTransitBookings")) {
    localStorage.setItem("ecoHopTransitBookings", JSON.stringify(mockTransitBookings));
  }
  
  if (!localStorage.getItem("ecoHopRewardClaims")) {
    localStorage.setItem("ecoHopRewardClaims", JSON.stringify(mockRewardClaims));
  }
  
  if (!localStorage.getItem("ecoHopClaimedRewards")) {
    localStorage.setItem("ecoHopClaimedRewards", JSON.stringify([]));
  }
};

export const useUserData = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transitBookings, setTransitBookings] = useState<any[]>([]);
  const [rewardClaims, setRewardClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize localStorage if needed
    initializeLocalStorage();
    
    const fetchUserData = async () => {
      if (authLoading) return;
      
      if (!currentUser) {
        setUserProfile(null);
        setTransitBookings([]);
        setRewardClaims([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Get profiles from localStorage
        const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
        
        // Check if profile exists, if not create it
        let profile = profiles[currentUser.uid];
        if (!profile) {
          profile = createMockUserData(
            currentUser.uid, 
            currentUser.displayName, 
            currentUser.email, 
            currentUser.photoURL
          );
          
          // Save to localStorage
          profiles[currentUser.uid] = profile;
          localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
        }
        
        setUserProfile(profile);
        
        // Get bookings from localStorage
        const allBookings = JSON.parse(localStorage.getItem("ecoHopTransitBookings") || "[]");
        const userBookings = allBookings.filter((booking: any) => booking.userId === currentUser.uid);
        setTransitBookings(userBookings);
        
        // Get reward claims from localStorage
        const allClaims = JSON.parse(localStorage.getItem("ecoHopRewardClaims") || "[]");
        const userClaims = allClaims.filter((claim: any) => claim.userId === currentUser.uid);
        setRewardClaims(userClaims);
      } catch (err: any) {
        console.error("Error loading user data:", err);
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser, authLoading]);
  
  const refreshUserData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Get updated data from localStorage
      const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
      setUserProfile(profiles[currentUser.uid]);
      
      const allBookings = JSON.parse(localStorage.getItem("ecoHopTransitBookings") || "[]");
      const userBookings = allBookings.filter((booking: any) => booking.userId === currentUser.uid);
      setTransitBookings(userBookings);
      
      const allClaims = JSON.parse(localStorage.getItem("ecoHopRewardClaims") || "[]");
      const userClaims = allClaims.filter((claim: any) => claim.userId === currentUser.uid);
      setRewardClaims(userClaims);
    } catch (err: any) {
      setError(err.message || "Failed to refresh user data");
    } finally {
      setLoading(false);
    }
  };

  // Function to update user profile
  const updateUserProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
      profiles[currentUser.uid] = { ...profiles[currentUser.uid], ...data };
      localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
      setUserProfile(profiles[currentUser.uid]);
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return false;
    }
  };

  // Function to add points to user (positive for earning, negative for spending)
  const addPointsToUser = async (
    points: number, 
    co2Saved: number = 0,
    tripCount: number = 0
  ): Promise<boolean> => {
    if (!currentUser || !userProfile) return false;
    
    try {
      const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
      const currentProfile = profiles[currentUser.uid];
      
      // Calculate new point total (prevent negative points)
      const newPointTotal = Math.max(0, currentProfile.totalPoints + points);
      
      const updatedProfile = {
        ...currentProfile,
        totalPoints: newPointTotal,
        co2Saved: currentProfile.co2Saved + co2Saved,
        totalTrips: currentProfile.totalTrips + tripCount
      };
      
      profiles[currentUser.uid] = updatedProfile;
      localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
      setUserProfile(updatedProfile);
      
      // Log the transaction in localStorage for history
      const transactions = JSON.parse(localStorage.getItem("ecoHopPointTransactions") || "[]");
      
      transactions.push({
        userId: currentUser.uid,
        amount: points,
        balance: newPointTotal,
        description: points > 0 ? "Points earned" : "Points spent",
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem("ecoHopPointTransactions", JSON.stringify(transactions));
      
      return true;
    } catch (error) {
      console.error("Error managing user points:", error);
      return false;
    }
  };
  
  return {
    userProfile,
    transitBookings,
    rewardClaims,
    loading,
    error,
    refreshUserData,
    updateUserProfile,
    addPointsToUser
  };
};
