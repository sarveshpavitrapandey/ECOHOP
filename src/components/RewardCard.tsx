
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Reward } from "@/types";
import { Coffee, Ticket, Gift, Briefcase, CreditCard, Bus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: (rewardId: string) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ 
  reward, 
  userPoints,
  onRedeem
}) => {
  const { toast } = useToast();
  
  const getRewardIcon = () => {
    switch (reward.icon) {
      case "coffee":
        return <Coffee className="h-6 w-6 text-gray-600" />;
      case "ticket":
        return <Ticket className="h-6 w-6 text-gray-600" />;
      case "gift":
        return <Gift className="h-6 w-6 text-gray-600" />;
      case "card":
        return <CreditCard className="h-6 w-6 text-gray-600" />;
      case "bus":
        return <Bus className="h-6 w-6 text-gray-600" />;
      case "bag":
        return <ShoppingBag className="h-6 w-6 text-gray-600" />;
      default:
        return <Gift className="h-6 w-6 text-gray-600" />;
    }
  };
  
  const handleRedeem = () => {
    if (reward.status === "available" && userPoints >= reward.pointsCost) {
      onRedeem(reward.id);
    } else if (userPoints < reward.pointsCost) {
      toast({
        title: "Insufficient points",
        description: `You need ${reward.pointsCost - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            {getRewardIcon()}
          </div>
          <div className="bg-eco-amber-50 text-eco-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            {reward.pointsCost} pts
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
        <p className="text-gray-600 mb-4">{reward.description}</p>
        
        {reward.status === "claimed" && (
          <div className="text-sm text-gray-500 mt-2">
            Claimed on: {formatDate(reward.claimedDate)}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        {reward.status === "available" ? (
          <Button 
            onClick={handleRedeem}
            disabled={userPoints < reward.pointsCost}
            className={cn(
              "w-full",
              userPoints >= reward.pointsCost 
                ? "bg-eco-green-600 hover:bg-eco-green-700" 
                : "bg-gray-200 text-gray-500 hover:bg-gray-200 cursor-not-allowed"
            )}
          >
            {userPoints >= reward.pointsCost 
              ? "Redeem Reward" 
              : `Need ${reward.pointsCost - userPoints} more points`
            }
          </Button>
        ) : reward.status === "claimed" ? (
          <Button disabled className="w-full bg-gray-100 text-gray-600 hover:bg-gray-100 cursor-default">
            Already Claimed
          </Button>
        ) : (
          <Button 
            disabled 
            className="w-full bg-gray-200 text-gray-500 hover:bg-gray-200 cursor-not-allowed"
          >
            Need {reward.pointsCost - userPoints} more points
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
