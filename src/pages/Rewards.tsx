import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardCard } from "@/components/RewardCard";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/hooks/useUserData";
import { Reward, RewardCategory } from "@/types";
import { Coffee, Ticket, Gift, CreditCard, Bus, Package } from "lucide-react";

const rewardsData: Reward[] = [
  {
    id: "1",
    title: "Coffee Shop Voucher",
    description: "Get a free coffee at participating coffee shops",
    pointsCost: 100,
    category: "food",
    icon: "coffee",
    status: "available"
  },
  {
    id: "2",
    title: "Movie Ticket",
    description: "One free movie ticket at Cineplex",
    pointsCost: 250,
    category: "entertainment",
    icon: "ticket",
    status: "available"
  },
  {
    id: "3",
    title: "Eco-friendly Tote Bag",
    description: "Stylish and sustainable shopping bag",
    pointsCost: 150,
    category: "merchandise",
    icon: "bag",
    status: "available"
  },
  {
    id: "4",
    title: "$10 Gift Card",
    description: "Gift card for your favorite retail store",
    pointsCost: 300,
    category: "giftcards",
    icon: "card",
    status: "available"
  },
  {
    id: "5",
    title: "Public Transport Day Pass",
    description: "Free one-day pass for all public transport",
    pointsCost: 200,
    category: "transport",
    icon: "bus",
    status: "available"
  },
  {
    id: "6",
    title: "Reusable Water Bottle",
    description: "Eco-friendly reusable water bottle",
    pointsCost: 180,
    category: "merchandise",
    icon: "gift",
    status: "available"
  },
  {
    id: "7",
    title: "Restaurant Voucher",
    description: "10% off at select eco-friendly restaurants",
    pointsCost: 120,
    category: "food",
    icon: "coffee",
    status: "available"
  }
];

export default function Rewards() {
  const { toast } = useToast();
  const { userProfile, addPointsToUser, refreshUserData } = useUserData();
  const [activeCategory, setActiveCategory] = useState<RewardCategory>("all");
  const [rewards, setRewards] = useState<Reward[]>(rewardsData);
  const [claimedRewards, setClaimedRewards] = useState<Reward[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  
  useEffect(() => {
    if (!userProfile) return;
    
    setUserPoints(userProfile.totalPoints);
    
    const storedClaimedRewards = localStorage.getItem("ecoHopClaimedRewards");
    let claimedRewardIds: string[] = [];
    
    if (storedClaimedRewards) {
      try {
        const parsedClaims = JSON.parse(storedClaimedRewards);
        if (Array.isArray(parsedClaims)) {
          claimedRewardIds = parsedClaims
            .filter(claim => claim.userId === userProfile.uid)
            .map(claim => claim.rewardId);
        }
      } catch (error) {
        console.error("Error parsing claimed rewards:", error);
      }
    }
    
    const updatedRewards = rewardsData.map(reward => {
      if (claimedRewardIds.includes(reward.id)) {
        return {
          ...reward,
          status: "claimed" as const,
          claimedDate: new Date()
        };
      }
      return reward;
    });
    
    setRewards(updatedRewards);
    
    setClaimedRewards(updatedRewards.filter(reward => reward.status === "claimed"));
    setAvailableRewards(updatedRewards.filter(reward => reward.status !== "claimed"));
  }, [userProfile]);

  const filteredAvailableRewards = availableRewards.filter(reward => 
    activeCategory === "all" || reward.category === activeCategory
  );
  
  const handleRedeemReward = (rewardId: string) => {
    const rewardToRedeem = rewards.find(r => r.id === rewardId);
    if (!rewardToRedeem || rewardToRedeem.status !== "available") return;
    
    if (userPoints < rewardToRedeem.pointsCost) {
      toast({
        title: "Insufficient points",
        description: `You need ${rewardToRedeem.pointsCost - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }
    
    addPointsToUser(-rewardToRedeem.pointsCost).then(success => {
      if (success) {
        const updatedRewards = rewards.map(reward => 
          reward.id === rewardId 
            ? { ...reward, status: "claimed" as const, claimedDate: new Date() } 
            : reward
        );
        
        setRewards(updatedRewards);
        setClaimedRewards(updatedRewards.filter(reward => reward.status === "claimed"));
        setAvailableRewards(updatedRewards.filter(reward => reward.status !== "claimed"));
        setUserPoints(prevPoints => prevPoints - rewardToRedeem.pointsCost);
        
        const storedClaimedRewards = localStorage.getItem("ecoHopClaimedRewards");
        let claimedRewardsList = [];
        
        if (storedClaimedRewards) {
          try {
            claimedRewardsList = JSON.parse(storedClaimedRewards);
          } catch (error) {
            console.error("Error parsing claimed rewards:", error);
          }
        }
        
        claimedRewardsList.push({
          userId: userProfile?.uid,
          rewardId: rewardId,
          rewardName: rewardToRedeem.title,
          pointsCost: rewardToRedeem.pointsCost,
          claimDate: new Date().toISOString()
        });
        
        localStorage.setItem("ecoHopClaimedRewards", JSON.stringify(claimedRewardsList));
        
        toast({
          title: "Reward redeemed!",
          description: `You've successfully redeemed ${rewardToRedeem.title}. Check your claimed rewards tab.`,
        });
        
        refreshUserData();
      } else {
        toast({
          title: "Redemption failed",
          description: "There was an error redeeming your reward. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  const categories = [
    { id: "all", label: "All Rewards", icon: Gift },
    { id: "food", label: "Food & Drinks", icon: Coffee },
    { id: "entertainment", label: "Entertainment", icon: Ticket },
    { id: "merchandise", label: "Merchandise", icon: Package },
    { id: "giftcards", label: "Gift Cards", icon: Gift },
    { id: "transport", label: "Transport", icon: Bus }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards</h1>
            <p className="text-gray-600">
              Redeem your points for exclusive rewards and experiences
            </p>
          </div>
          
          <Card className="mt-4 md:mt-0">
            <CardContent className="p-4 flex items-center">
              <div className="bg-eco-amber-100 p-2 rounded-full mr-3">
                <Gift className="h-5 w-5 text-eco-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Points</p>
                <p className="text-2xl font-bold text-eco-amber-600">{userPoints}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="available" className="mb-6">
          <TabsList>
            <TabsTrigger value="available">Available Rewards</TabsTrigger>
            <TabsTrigger value="claimed">Claimed Rewards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2 p-1 min-w-max">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id as RewardCategory)}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category.id
                        ? "bg-eco-green-600 text-white hover:bg-eco-green-700"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {filteredAvailableRewards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAvailableRewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    userPoints={userPoints}
                    onRedeem={handleRedeemReward}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No rewards available in this category.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="claimed">
            {claimedRewards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {claimedRewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    userPoints={userPoints}
                    onRedeem={handleRedeemReward}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't claimed any rewards yet.</p>
                <Button 
                  onClick={() => {
                    const availableTab = document.querySelector('[data-value="available"]');
                    if (availableTab instanceof HTMLElement) {
                      availableTab.click();
                    }
                  }}
                  variant="link"
                  className="text-eco-green-600 mt-2"
                >
                  Browse available rewards
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
