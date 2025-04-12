
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeaderboardUser } from "@/types";
import { Award, User, Leaf, TrendingUp, MapPin } from "lucide-react";
import EcoTree from "@/components/EcoTree";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import LocalLeaderboard from "@/components/LocalLeaderboard";

// Mock leaderboard data with Indian names (Pimpri locality)
const leaderboardUsers: LeaderboardUser[] = [
  { id: "1", name: "Priya Sharma", points: 850, co2Saved: 42.5, rank: 1, location: "Pimpri" },
  { id: "2", name: "Rahul Patel", points: 720, co2Saved: 36.0, rank: 2, location: "Pimpri" },
  { id: "3", name: "Aisha Khan", points: 685, co2Saved: 34.2, rank: 3, location: "Pimpri" }
];

// Recent eco achievements with Indian names
const recentAchievements = [
  { user: "Sarvesh Verma", achievement: "saved 20kg CO2 emissions by using public transport for a week" },
  { user: "Meera Iyer", achievement: "completed 15 consecutive days of eco-friendly commuting" },
  { user: "Rajiv Kumar", achievement: "reduced carbon footprint by 15kg this month" },
  { user: "Ananya Mehta", achievement: "reached level 3 on their Eco Tree" }
];

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userProfile, loading } = useUserData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Welcome to EcoHop!</CardTitle>
                <CardDescription>
                  Your sustainable travel companion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Make a positive impact on the environment by choosing eco-friendly transportation options.
                  Earn rewards, track your impact, and join a community of eco-conscious travelers.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-eco-green-600 hover:bg-eco-green-700"
                    onClick={() => navigate('/tickets')}
                  >
                    Book a Trip
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/rewards')}
                  >
                    View Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Your Impact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-eco-green-600" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-eco-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">CO₂ Saved</p>
                    <p className="text-2xl font-bold text-eco-green-700">
                      {loading ? "..." : `${userProfile?.co2Saved.toFixed(1) || "0.0"} kg`}
                    </p>
                  </div>
                  <div className="bg-eco-amber-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Points</p>
                    <p className="text-2xl font-bold text-eco-amber-600">
                      {loading ? "..." : userProfile?.totalPoints || "0"}
                    </p>
                  </div>
                  <div className="bg-eco-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Trips Taken</p>
                    <p className="text-2xl font-bold text-eco-blue-600">
                      {loading ? "..." : userProfile?.totalTrips || "0"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Local Leaderboard */}
            <LocalLeaderboard 
              users={leaderboardUsers}
              location="Pimpri"
            />
            
            {/* Recent Achievements */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p>
                        <span className="font-medium">{item.user}</span>
                        {" "}
                        {item.achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Eco Tree */}
            <EcoTree totalCO2Saved={userProfile?.co2Saved || 0} />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-eco-blue-600 hover:bg-eco-blue-700" onClick={() => navigate('/tickets')}>
                  Book a Trip
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate('/trip-logger')}>
                  Log a Trip
                </Button>
                <Button className="w-full bg-eco-green-600 hover:bg-eco-green-700" onClick={() => navigate('/rewards')}>
                  View Rewards
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate('/donate')}>
                  Donate Points
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
