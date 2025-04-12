
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeaderboardUser } from "@/types";
import { Award, User, MapPin } from "lucide-react";

interface LocalLeaderboardProps {
  users: LeaderboardUser[];
  location: string;
}

const LocalLeaderboard: React.FC<LocalLeaderboardProps> = ({ users, location }) => {
  // Only display top 3 users
  const topUsers = users.slice(0, 3);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-eco-green-600" />
          <CardTitle>Top Carbon Savers in {location}</CardTitle>
        </div>
        <CardDescription>
          Join your neighbors in making a difference!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topUsers.map((user) => (
            <div 
              key={user.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.rank === 1 ? 'bg-yellow-50 border border-yellow-100' :
                user.rank === 2 ? 'bg-gray-50 border border-gray-100' :
                'bg-amber-50 border border-amber-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  user.rank === 1 ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300' :
                  user.rank === 2 ? 'bg-gray-100 text-gray-600 border-2 border-gray-300' :
                  'bg-amber-100 text-amber-600 border-2 border-amber-300'
                }`}>
                  {user.rank === 1 ? (
                    <Award className="h-5 w-5" />
                  ) : user.rank === 2 ? (
                    <Award className="h-5 w-5" />
                  ) : (
                    <Award className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.co2Saved.toFixed(1)} kg CO₂ saved
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${
                  user.rank === 1 ? 'bg-yellow-500' :
                  user.rank === 2 ? 'bg-gray-500' :
                  'bg-amber-500'
                }`}>
                  {user.points} pts
                </Badge>
              </div>
            </div>
          ))}
          
          <div className="pt-2 text-center text-sm text-gray-500">
            <p>Special rewards for top performers each month!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalLeaderboard;
