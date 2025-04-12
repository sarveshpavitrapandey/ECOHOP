
import React from "react";
import { TreeLevel } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TreeDeciduous, TreePine, Sprout, Leaf } from "lucide-react";

interface EcoTreeProps {
  totalCO2Saved: number;
}

const treeLevels: TreeLevel[] = [
  {
    level: 1,
    co2Required: 0,
    icon: "sprout",
    name: "Seedling",
    description: "Your eco-journey has just begun!",
    pointsRequired: 0,
    image: "/images/seedling.png"
  },
  {
    level: 2,
    co2Required: 5,
    icon: "sapling",
    name: "Sapling",
    description: "Your eco-efforts are starting to grow!",
    pointsRequired: 25,
    image: "/images/sapling.png"
  },
  {
    level: 3,
    co2Required: 15,
    icon: "young-tree",
    name: "Young Tree",
    description: "You're making a noticeable impact!",
    pointsRequired: 75,
    image: "/images/young-tree.png"
  },
  {
    level: 4,
    co2Required: 30,
    icon: "mature-tree",
    name: "Mature Tree",
    description: "You're a serious eco-warrior!",
    pointsRequired: 150,
    image: "/images/mature-tree.png"
  },
  {
    level: 5,
    co2Required: 50,
    icon: "forest",
    name: "Forest",
    description: "Your impact is creating an entire ecosystem!",
    pointsRequired: 250,
    image: "/images/forest.png"
  }
];

const getTreeIcon = (icon: string, size: number = 24, className: string = "") => {
  switch (icon) {
    case "sprout":
      return <Sprout size={size} className={className} />;
    case "sapling":
      return <Leaf size={size} className={className} />;
    case "young-tree":
      return <TreeDeciduous size={size} className={className} />;
    case "mature-tree":
      return <TreePine size={size} className={className} />;
    case "forest":
      return (
        <div className="flex">
          <TreeDeciduous size={size} className={className} />
          <TreePine size={size} className={className} />
          <TreeDeciduous size={size} className={className} />
        </div>
      );
    default:
      return <Sprout size={size} className={className} />;
  }
};

const EcoTree: React.FC<EcoTreeProps> = ({ totalCO2Saved }) => {
  // Find the current level based on CO2 saved
  const currentLevelIndex = treeLevels.reduce((highestIdx, level, idx) => {
    return totalCO2Saved >= level.co2Required ? idx : highestIdx;
  }, 0);

  const currentLevel = treeLevels[currentLevelIndex];
  const nextLevel = treeLevels[currentLevelIndex + 1];
  
  // Calculate progress to next level
  const progressToNextLevel = nextLevel
    ? ((totalCO2Saved - currentLevel.co2Required) / 
      (nextLevel.co2Required - currentLevel.co2Required)) * 100
    : 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Your Eco Tree</CardTitle>
        <CardDescription>
          Watch your impact grow as you save CO₂
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <div className="flex justify-center mb-2">
              {getTreeIcon(currentLevel.icon, 80, "text-eco-green-600")}
            </div>
            <h3 className="text-xl font-bold">{currentLevel.name}</h3>
            <p className="text-muted-foreground">{currentLevel.description}</p>
          </div>
          
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total CO₂ Saved: {totalCO2Saved.toFixed(2)} kg</span>
              {nextLevel && <span>Next: {nextLevel.co2Required} kg</span>}
            </div>
            
            <Progress value={progressToNextLevel} className="h-2" />
            
            {nextLevel ? (
              <p className="text-center text-sm text-muted-foreground">
                {progressToNextLevel.toFixed(1)}% to {nextLevel.name}
              </p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Maximum level reached!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoTree;
