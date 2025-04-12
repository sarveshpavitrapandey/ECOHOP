
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Organization } from "@/types";
import { HeartHandshake, Users, School, Heart, HandCoins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useUserData } from "@/hooks/useUserData";

// Example organizations data
const organizationsData: Organization[] = [
  {
    id: "1",
    name: "Green Earth Initiative",
    description: "Working to preserve natural habitats and fight climate change through tree planting programs.",
    logo: "🌳",
    category: "environmental",
    pointsReceived: 1250
  },
  {
    id: "2",
    name: "Public Transit Alliance",
    description: "Advocating for better public transportation systems and accessibility for all communities.",
    logo: "🚌",
    category: "environmental",
    pointsReceived: 980
  },
  {
    id: "3",
    name: "Clean Water Project",
    description: "Providing clean water solutions and education to communities in need around the world.",
    logo: "💧",
    category: "community",
    pointsReceived: 1540
  },
  {
    id: "4",
    name: "Future Leaders Scholarship",
    description: "Supporting educational opportunities for underprivileged students interested in sustainability.",
    logo: "📚",
    category: "education",
    pointsReceived: 760
  },
  {
    id: "5",
    name: "Healthy Communities Fund",
    description: "Promoting healthier lifestyles through walking and biking infrastructure in urban areas.",
    logo: "🚶",
    category: "health",
    pointsReceived: 890
  }
];

export default function Donate() {
  const { toast } = useToast();
  const { userProfile, addPointsToUser, refreshUserData } = useUserData();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter organizations by category
  const filteredOrgs = activeCategory === "all" 
    ? organizationsData 
    : organizationsData.filter(org => org.category === activeCategory);
  
  // Categories
  const categories = [
    { id: "all", label: "All Organizations", icon: HeartHandshake },
    { id: "environmental", label: "Environmental", icon: Heart },
    { id: "community", label: "Community", icon: Users },
    { id: "education", label: "Education", icon: School },
    { id: "health", label: "Health", icon: Heart },
  ];
  
  const handleDonateClick = (org: Organization) => {
    setSelectedOrg(org);
    setDonationAmount(Math.min(20, userProfile?.totalPoints || 0));
    setShowDonationDialog(true);
  };
  
  const handleDonationConfirm = () => {
    if (!selectedOrg || donationAmount <= 0 || !userProfile || donationAmount > userProfile.totalPoints) {
      toast({
        title: "Invalid donation",
        description: userProfile && donationAmount > userProfile.totalPoints 
          ? "You don't have enough points for this donation"
          : "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }
    
    // Update user points using the useUserData hook
    addPointsToUser(-donationAmount).then(success => {
      if (success) {
        // Update organization points (in a real app, this would be an API call)
        const updatedOrgs = organizationsData.map(org => 
          org.id === selectedOrg.id 
            ? { ...org, pointsReceived: org.pointsReceived + donationAmount } 
            : org
        );
        
        toast({
          title: "Donation successful!",
          description: `You've donated ${donationAmount} points to ${selectedOrg.name}. Thank you for your contribution!`,
        });
        
        setShowDonationDialog(false);
        refreshUserData(); // Refresh user data to update points across the app
      } else {
        toast({
          title: "Donation failed",
          description: "There was an error processing your donation. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  const getOrgIcon = (category: Organization["category"]) => {
    switch (category) {
      case "environmental":
        return <Heart className="h-6 w-6" />;
      case "community":
        return <Users className="h-6 w-6" />;
      case "education":
        return <School className="h-6 w-6" />;
      case "health":
        return <Heart className="h-6 w-6" />;
      default:
        return <HeartHandshake className="h-6 w-6" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Donate Your Points</h1>
          <p className="mt-3 text-xl text-gray-600 max-w-3xl mx-auto">
            Support organizations making a difference by donating your earned points
          </p>
        </div>
        
        {/* User Points Section */}
        <Card className="mb-10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-12 w-12 rounded-full bg-eco-amber-100 flex items-center justify-center mr-4">
                  <HandCoins className="h-6 w-6 text-eco-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-gray-900">{userProfile?.totalPoints || 0} Points Available</h3>
                  <p className="text-gray-500">Your contribution matters!</p>
                </div>
              </div>
              <Button className="bg-eco-green-600 hover:bg-eco-green-700">
                Earn More Points
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Categories Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 p-1 min-w-max">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
                  activeCategory === category.id
                    ? "bg-eco-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Organizations Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => (
            <Card key={org.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="rounded-full p-2 bg-gray-100 text-center text-2xl">
                    {org.logo}
                  </div>
                  <div className="bg-eco-amber-100 text-eco-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                    {org.category}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-2">{org.name}</CardTitle>
                <CardDescription className="mb-4">{org.description}</CardDescription>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Points Received</span>
                    <span className="font-medium">{org.pointsReceived}</span>
                  </div>
                  <Progress value={(org.pointsReceived / 2000) * 100} className="h-2" />
                </div>
                
                <Button
                  className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                  onClick={() => handleDonateClick(org)}
                  disabled={!userProfile || userProfile.totalPoints <= 0}
                >
                  Donate Points
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {filteredOrgs.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No organizations found in this category.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Donation Dialog */}
      <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate to {selectedOrg?.name}</DialogTitle>
            <DialogDescription>
              Choose how many points you'd like to donate. Your contribution helps support their mission.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrg && (
            <div className="space-y-6 py-4">
              <div className="flex items-center p-4 border rounded-lg">
                <div className="rounded-full p-3 bg-gray-100 mr-4 text-2xl">
                  {selectedOrg.logo}
                </div>
                <div>
                  <h4 className="font-medium">{selectedOrg.name}</h4>
                  <p className="text-sm text-gray-500">{selectedOrg.description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Donation Amount</span>
                  <span className="font-bold text-eco-green-600">{donationAmount} points</span>
                </div>
                
                <Slider
                  min={1}
                  max={userProfile?.totalPoints || 1}
                  step={1}
                  value={[donationAmount]}
                  onValueChange={(values) => setDonationAmount(values[0])}
                  className="bg-eco-green-100"
                />
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 point</span>
                  <span>{userProfile?.totalPoints || 0} points</span>
                </div>
                
                <Input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      setDonationAmount(Math.min(value, userProfile?.totalPoints || 0));
                    }
                  }}
                  min={1}
                  max={userProfile?.totalPoints || 0}
                  className="mt-2"
                />
                
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Your Impact</p>
                  <p className="text-gray-600">Every point you donate helps support sustainable initiatives and community programs.</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowDonationDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-eco-green-600 hover:bg-eco-green-700"
              onClick={handleDonationConfirm}
              disabled={donationAmount <= 0 || !userProfile || donationAmount > userProfile.totalPoints}
            >
              Confirm Donation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
