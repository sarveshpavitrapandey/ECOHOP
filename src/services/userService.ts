
import { UserProfile } from "@/hooks/useUserData";

// Get user profile from localStorage
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
    return profiles[uid] || null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Initialize user in localStorage
export const initializeUser = async (user: any): Promise<UserProfile> => {
  const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
  
  if (!profiles[user.uid]) {
    // Create new user profile
    const newUser: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || "EcoHop User",
      email: user.email || "",
      photoURL: user.photoURL || "",
      totalPoints: 0,
      co2Saved: 0,
      totalTrips: 0,
      streak: 0,
      bestStreak: 0,
      joinedDate: new Date().toISOString(),
      unlockedBadges: ["eco-starter"], // Default badge
    };
    
    profiles[user.uid] = newUser;
    localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
    return newUser;
  }
  
  return profiles[user.uid];
};

// Update user profile
export const updateUserProfile = async (
  uid: string, 
  data: Partial<UserProfile>
): Promise<boolean> => {
  try {
    const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
    profiles[uid] = { ...profiles[uid], ...data };
    localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

// Add points to user
export const addPointsToUser = async (
  uid: string, 
  points: number, 
  co2Saved: number = 0,
  tripCount: number = 0
): Promise<boolean> => {
  try {
    const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
    
    if (profiles[uid]) {
      const userData = profiles[uid];
      
      profiles[uid] = {
        ...userData,
        totalPoints: userData.totalPoints + points,
        co2Saved: userData.co2Saved + co2Saved,
        totalTrips: userData.totalTrips + tripCount
      };
      
      localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding points to user:", error);
    return false;
  }
};

// Update user streak
export const updateUserStreak = async (uid: string): Promise<boolean> => {
  try {
    const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
    
    if (profiles[uid]) {
      const userData = profiles[uid];
      const newStreak = userData.streak + 1;
      const bestStreak = Math.max(newStreak, userData.bestStreak);
      
      profiles[uid] = {
        ...userData,
        streak: newStreak,
        bestStreak: bestStreak
      };
      
      localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating user streak:", error);
    return false;
  }
};

// Reset user streak
export const resetUserStreak = async (uid: string): Promise<boolean> => {
  try {
    const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
    if (profiles[uid]) {
      profiles[uid] = { ...profiles[uid], streak: 0 };
      localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
    }
    return true;
  } catch (error) {
    console.error("Error resetting user streak:", error);
    return false;
  }
};

// Add badge to user
export const addBadgeToUser = async (uid: string, badgeId: string): Promise<boolean> => {
  try {
    const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
    
    if (profiles[uid]) {
      const userData = profiles[uid];
      
      // Only add if badge doesn't already exist
      if (!userData.unlockedBadges.includes(badgeId)) {
        profiles[uid] = {
          ...userData,
          unlockedBadges: [...userData.unlockedBadges, badgeId]
        };
        
        localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding badge to user:", error);
    return false;
  }
};
