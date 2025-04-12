import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  serverTimestamp, 
  Timestamp, 
  updateDoc,
  orderBy, 
  limit,
  DocumentData,
  setDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Reward interface
export interface Reward {
  id?: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  image: string;
  availableUntil?: Timestamp;
  isActive: boolean;
}

// User reward claim interface
export interface RewardClaim {
  id?: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  claimedAt: Timestamp;
  couponCode?: string;
  isUsed: boolean;
}

// Get all available rewards
export const getAvailableRewards = async (): Promise<Reward[]> => {
  try {
    const rewards: Reward[] = [];
    const now = new Date();
    
    const q = query(
      collection(db, "rewards"),
      where("isActive", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Reward;
      
      // Check if reward is still available (if it has an end date)
      if (data.availableUntil) {
        const endDate = data.availableUntil.toDate();
        if (endDate < now) return; // Skip if expired
      }
      
      rewards.push({
        ...data,
        id: doc.id
      });
    });
    
    return rewards;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return [];
  }
};

// Get a specific reward by ID
export const getRewardById = async (rewardId: string): Promise<Reward | null> => {
  try {
    const rewardRef = doc(db, "rewards", rewardId);
    const rewardSnap = await getDoc(rewardRef);
    
    if (rewardSnap.exists()) {
      return {
        ...rewardSnap.data() as Reward,
        id: rewardSnap.id
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching reward:", error);
    return null;
  }
};

// Claim a reward
export const claimReward = async (
  userId: string, 
  rewardId: string
): Promise<RewardClaim | null> => {
  try {
    // Get the reward details
    const reward = await getRewardById(rewardId);
    
    if (!reward) {
      throw new Error("Reward not found");
    }
    
    // Generate a coupon code if needed
    const couponCode = generateCouponCode(8);
    
    // Create the claim
    const claimData: RewardClaim = {
      userId,
      rewardId,
      rewardName: reward.name,
      pointsCost: reward.pointsCost,
      claimedAt: Timestamp.now(),
      couponCode,
      isUsed: false
    };
    
    const docRef = await addDoc(collection(db, "rewardClaims"), claimData);
    
    return {
      ...claimData,
      id: docRef.id
    };
  } catch (error) {
    console.error("Error claiming reward:", error);
    return null;
  }
};

// Get user's claimed rewards
export const getUserRewardClaims = async (userId: string): Promise<RewardClaim[]> => {
  try {
    const claims: RewardClaim[] = [];
    
    const q = query(
      collection(db, "rewardClaims"),
      where("userId", "==", userId),
      orderBy("claimedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      claims.push({
        ...doc.data() as RewardClaim,
        id: doc.id
      });
    });
    
    return claims;
  } catch (error) {
    console.error("Error fetching user reward claims:", error);
    return [];
  }
};

// Mark a reward as used
export const markRewardAsUsed = async (claimId: string): Promise<boolean> => {
  try {
    const claimRef = doc(db, "rewardClaims", claimId);
    await updateDoc(claimRef, { isUsed: true });
    return true;
  } catch (error) {
    console.error("Error marking reward as used:", error);
    return false;
  }
};

// Helper function to generate a random coupon code
export const generateCouponCode = (length: number = 8): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Add a default set of rewards if none exist
export const initializeDefaultRewards = async (): Promise<void> => {
  try {
    // Check if rewards already exist
    const rewardsSnapshot = await getDocs(collection(db, "rewards"));
    
    if (!rewardsSnapshot.empty) {
      return; // Rewards already exist, no need to initialize
    }
    
    // Default rewards
    const defaultRewards: Omit<Reward, 'id'>[] = [
      {
        name: "Free Coffee",
        description: "Get a free coffee at participating cafes",
        pointsCost: 50,
        category: "food",
        image: "☕",
        isActive: true
      },
      {
        name: "5% Off Bus Pass",
        description: "5% discount on your next monthly bus pass",
        pointsCost: 100,
        category: "transport",
        image: "🚌",
        isActive: true
      },
      {
        name: "Plant a Tree",
        description: "We'll plant a tree on your behalf",
        pointsCost: 150,
        category: "eco",
        image: "🌳",
        isActive: true
      },
      {
        name: "Movie Ticket",
        description: "One free movie ticket at select theaters",
        pointsCost: 200,
        category: "entertainment",
        image: "🎬",
        isActive: true
      },
      {
        name: "Free Bike Rental",
        description: "One day of free bike rental",
        pointsCost: 250,
        category: "transport",
        image: "🚲",
        isActive: true
      },
      {
        name: "10% Off Metro Pass",
        description: "10% discount on your next metro pass purchase",
        pointsCost: 80,
        category: "transport",
        image: "🚇",
        isActive: true
      },
      {
        name: "20% Off First Ride",
        description: "20% discount on your first eco-friendly cab ride",
        pointsCost: 120,
        category: "transport",
        image: "🚗",
        isActive: true
      },
      {
        name: "Free Vegan Meal",
        description: "Enjoy a complimentary vegan meal at participating restaurants",
        pointsCost: 180,
        category: "food",
        image: "🥗",
        isActive: true
      },
      {
        name: "Eco Shopping Discount",
        description: "15% off at eco-friendly stores",
        pointsCost: 220,
        category: "eco",
        image: "🛍️",
        isActive: true
      },
      {
        name: "Concert Ticket",
        description: "Get a free ticket to an upcoming eco-awareness concert",
        pointsCost: 300,
        category: "entertainment",
        image: "🎵",
        isActive: true
      }
    ];
    
    // Add each reward to Firestore
    for (const reward of defaultRewards) {
      await addDoc(collection(db, "rewards"), reward);
    }
    
    console.log("Default rewards initialized successfully");
  } catch (error) {
    console.error("Error initializing default rewards:", error);
  }
};

// Get all badge definitions
export const getAllBadges = async () => {
  try {
    const badges: DocumentData[] = [];
    const badgesSnapshot = await getDocs(collection(db, "badges"));
    
    badgesSnapshot.forEach((doc) => {
      badges.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return badges;
  } catch (error) {
    console.error("Error fetching badges:", error);
    return [];
  }
};

// Initialize default badges if none exist
export const initializeDefaultBadges = async (): Promise<void> => {
  try {
    // Check if badges already exist
    const badgesSnapshot = await getDocs(collection(db, "badges"));
    
    if (!badgesSnapshot.empty) {
      return; // Badges already exist, no need to initialize
    }
    
    // Default badges
    const defaultBadges = [
      {
        id: "eco-starter",
        name: "Eco Starter",
        description: "First trip logged",
        icon: "leaf",
        category: "achievement",
        requirement: 1, // trips
        backgroundColor: "bg-eco-green-100",
        iconColor: "text-eco-green-600"
      },
      {
        id: "bus-enthusiast",
        name: "Bus Enthusiast",
        description: "10 bus trips completed",
        icon: "bus",
        category: "transport",
        requirement: 10, // bus trips
        backgroundColor: "bg-eco-blue-100",
        iconColor: "text-eco-blue-600"
      },
      {
        id: "metro-master",
        name: "Metro Master",
        description: "25 metro trips completed",
        icon: "train",
        category: "transport",
        requirement: 25, // metro trips
        backgroundColor: "bg-eco-blue-100",
        iconColor: "text-eco-blue-600"
      },
      {
        id: "consistent-hopper",
        name: "Consistent Hopper",
        description: "5-day streak of eco-friendly commuting",
        icon: "activity",
        category: "consistency",
        requirement: 5, // day streak
        backgroundColor: "bg-orange-100",
        iconColor: "text-orange-600"
      },
      {
        id: "weekly-warrior",
        name: "Weekly Warrior",
        description: "Trip every day for a week",
        icon: "clock",
        category: "consistency",
        requirement: 7, // day streak
        backgroundColor: "bg-eco-green-100",
        iconColor: "text-eco-green-600"
      },
      {
        id: "carbon-champion",
        name: "Carbon Champion",
        description: "Save 50kg of CO₂",
        icon: "award",
        category: "achievement",
        requirement: 50, // kg CO2
        backgroundColor: "bg-purple-100",
        iconColor: "text-purple-600"
      }
    ];
    
    // Add each badge to Firestore
    for (const badge of defaultBadges) {
      const { id, ...badgeData } = badge;
      await setDoc(doc(db, "badges", id), badgeData);
    }
    
    console.log("Default badges initialized successfully");
  } catch (error) {
    console.error("Error initializing default badges:", error);
  }
};
