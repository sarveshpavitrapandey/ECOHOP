
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Award, Bus, Train, TrendingUp, Clock, Activity, Calendar } from "lucide-react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import DashboardEcoImpact from "@/components/DashboardEcoImpact";
import { collection, getDocs, query, where, Timestamp, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Colors for chart
const COLORS = ["#2E7D32", "#1976D2"]; // Green for bus, Blue for metro

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { userProfile, transitBookings, loading } = useUserData();
  
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [transportData, setTransportData] = useState<any[]>([
    { name: "Bus", value: 0 },
    { name: "Metro", value: 0 },
  ]);
  
  // Calculate totals
  const totalTrips = transitBookings?.length || 0;
  const totalDistance = transitBookings?.reduce((sum, booking) => sum + booking.distance, 0) || 0;
  const totalCO2Saved = transitBookings?.reduce((sum, booking) => sum + booking.co2Saved, 0) || 0;
  
  // Fetch weekly data for charts
  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!currentUser) return;
      
      try {
        // Get date for 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        // Query bookings for the last 7 days
        const bookingsQuery = query(
          collection(db, "transitBookings"),
          where("userId", "==", currentUser.uid),
          where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
          orderBy("date")
        );
        
        const bookingsSnapshot = await getDocs(bookingsQuery);
        
        // Process bookings into daily data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyData: { [key: string]: any } = {};
        
        // Initialize with all days of the week
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const day = days[date.getDay()];
          
          dailyData[day] = {
            day,
            date: new Date(date),
            trips: 0,
            distance: 0,
            co2Saved: 0
          };
        }
        
        // Add booking data
        bookingsSnapshot.forEach((doc) => {
          const booking = doc.data();
          const date = booking.date.toDate();
          const day = days[date.getDay()];
          
          if (dailyData[day]) {
            dailyData[day].trips += 1;
            dailyData[day].distance += booking.distance;
            dailyData[day].co2Saved += booking.co2Saved;
          }
        });
        
        // Convert to array and sort by date
        const weekData = Object.values(dailyData).sort((a, b) => 
          a.date.getTime() - b.date.getTime()
        );
        
        setWeeklyData(weekData);
        
        // Calculate transport distribution
        const busBookings = bookingsSnapshot.docs.filter(doc => 
          doc.data().transitType === 'bus'
        ).length;
        
        const metroBookings = bookingsSnapshot.docs.filter(doc => 
          doc.data().transitType === 'metro'
        ).length;
        
        const total = busBookings + metroBookings;
        
        if (total > 0) {
          setTransportData([
            { name: "Bus", value: Math.round((busBookings / total) * 100) },
            { name: "Metro", value: Math.round((metroBookings / total) * 100) },
          ]);
        }
      } catch (error) {
        console.error("Error fetching weekly data:", error);
      }
    };
    
    fetchWeeklyData();
  }, [currentUser, transitBookings]);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Track your eco-impact and commuting stats
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Points */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">
                      {loading ? "..." : userProfile?.totalPoints || 0}
                    </h3>
                    {weeklyData.length > 0 && (
                      <span className="ml-2 text-xs text-green-600 font-medium">
                        +{weeklyData.reduce((sum, day) => sum + day.trips * 5, 0)} this week
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-eco-amber-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-eco-amber-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress to next reward</span>
                  <span>
                    {loading ? "..." : userProfile?.totalPoints || 0}/
                    {!loading && userProfile?.totalPoints 
                      ? (Math.ceil(userProfile.totalPoints / 50) * 50)
                      : 50}
                  </span>
                </div>
                <Progress 
                  value={!loading && userProfile?.totalPoints 
                    ? ((userProfile.totalPoints % 50) / 50) * 100 
                    : 0
                  } 
                  className="h-2 bg-gray-100" 
                />
              </div>
            </CardContent>
          </Card>
          
          {/* CO2 Saved */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">CO₂ Saved</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">
                      {loading ? "..." : totalCO2Saved.toFixed(1)} kg
                    </h3>
                    {weeklyData.length > 0 && (
                      <span className="ml-2 text-xs text-green-600 font-medium">
                        This week
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-eco-green-100 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-eco-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span>Helping to reduce carbon emissions</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Total Trips */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Trips</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">
                      {loading ? "..." : totalTrips}
                    </h3>
                    {weeklyData.length > 0 && (
                      <span className="ml-2 text-xs text-gray-500 font-medium">
                        {weeklyData.reduce((sum, day) => sum + day.trips, 0)} this week
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-eco-blue-100 flex items-center justify-center">
                  <Bus className="h-6 w-6 text-eco-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground flex justify-between">
                  <div className="flex items-center">
                    <Bus className="h-3 w-3 mr-1 text-eco-green-600" />
                    <span>Bus: {transportData[0].value}%</span>
                  </div>
                  <div className="flex items-center">
                    <Train className="h-3 w-3 mr-1 text-eco-blue-600" />
                    <span>Metro: {transportData[1].value}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Streak */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">
                      {loading ? "..." : userProfile?.streak || 0} days
                    </h3>
                    <span className="ml-2 text-xs text-orange-600 font-medium">
                      Best: {loading ? "..." : userProfile?.bestStreak || 0} days
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex space-x-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div 
                      key={day} 
                      className={`h-1 flex-1 rounded-full ${
                        i < (userProfile?.streak || 0) ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Eco Impact */}
        <div className="mb-10">
          <DashboardEcoImpact
            totalCO2Saved={totalCO2Saved}
            dailyAverage={weeklyData.length > 0 
              ? (weeklyData.reduce((sum, day) => sum + day.co2Saved, 0) / 7) 
              : 0
            }
            monthlyReduction={12} // Example value
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Weekly Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Activity
              </CardTitle>
              <CardDescription>
                Your eco-friendly commuting activity for the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="distance">
                <TabsList className="mb-4">
                  <TabsTrigger value="distance">Distance</TabsTrigger>
                  <TabsTrigger value="trips">Trips</TabsTrigger>
                  <TabsTrigger value="co2">CO₂ Saved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="distance">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} km`, 'Distance']}
                          contentStyle={{ borderRadius: '8px' }}
                        />
                        <Bar dataKey="distance" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="trips">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value}`, 'Trips']}
                          contentStyle={{ borderRadius: '8px' }}
                        />
                        <Bar dataKey="trips" fill="#1976D2" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="co2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} kg`, 'CO₂ Saved']}
                          contentStyle={{ borderRadius: '8px' }}
                        />
                        <Bar dataKey="co2Saved" fill="#43A047" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Transport Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Transport Distribution
              </CardTitle>
              <CardDescription>
                Your most used transport types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={transportData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {transportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Usage']}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-8">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-eco-green-600 rounded-full mr-2"></div>
                    <span className="text-sm">Bus</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-eco-blue-600 rounded-full mr-2"></div>
                    <span className="text-sm">Metro</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Badges and Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Badges and Achievements
            </CardTitle>
            <CardDescription>
              Rewards earned through your eco-friendly commuting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Badge 1 - Always unlocked for new users */}
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-eco-green-100 flex items-center justify-center mb-3 relative">
                  <Leaf className="h-10 w-10 text-eco-green-600" />
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 text-sm">Eco Starter</h4>
                <p className="text-xs text-gray-500">First trip logged</p>
              </div>
              
              {/* Badge 2 - Bus Enthusiast */}
              <div className="flex flex-col items-center text-center">
                <div className={`h-20 w-20 rounded-full bg-eco-blue-100 flex items-center justify-center mb-3 relative ${
                  userProfile?.unlockedBadges?.includes('bus-enthusiast') ? '' : 'opacity-40'
                }`}>
                  <Bus className="h-10 w-10 text-eco-blue-600" />
                  {userProfile?.unlockedBadges?.includes('bus-enthusiast') && (
                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm">Bus Enthusiast</h4>
                <p className="text-xs text-gray-500">10 bus trips</p>
                {!userProfile?.unlockedBadges?.includes('bus-enthusiast') && (
                  <span className="text-xs text-orange-600 mt-1">
                    {/* Progress calculation would be done in a real app */}
                    More trips needed
                  </span>
                )}
              </div>
              
              {/* Badge 3 - Metro Master */}
              <div className="flex flex-col items-center text-center">
                <div className={`h-20 w-20 rounded-full bg-eco-blue-100 flex items-center justify-center mb-3 relative ${
                  userProfile?.unlockedBadges?.includes('metro-master') ? '' : 'opacity-40'
                }`}>
                  <Train className="h-10 w-10 text-eco-blue-600" />
                  {userProfile?.unlockedBadges?.includes('metro-master') && (
                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm">Metro Master</h4>
                <p className="text-xs text-gray-500">25 metro trips</p>
                {!userProfile?.unlockedBadges?.includes('metro-master') && (
                  <span className="text-xs text-orange-600 mt-1">More trips needed</span>
                )}
              </div>
              
              {/* Badge 4 - Consistent Hopper */}
              <div className="flex flex-col items-center text-center">
                <div className={`h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center mb-3 relative ${
                  userProfile?.unlockedBadges?.includes('consistent-hopper') ? '' : 'opacity-40'
                }`}>
                  <Activity className="h-10 w-10 text-orange-600" />
                  {userProfile?.unlockedBadges?.includes('consistent-hopper') && (
                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      4
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm">Consistent Hopper</h4>
                <p className="text-xs text-gray-500">5-day streak</p>
                {!userProfile?.unlockedBadges?.includes('consistent-hopper') && (
                  <span className="text-xs text-orange-600 mt-1">
                    {userProfile?.streak 
                      ? `${5 - userProfile.streak} more days to unlock`
                      : "Start your streak"
                    }
                  </span>
                )}
              </div>
              
              {/* Badge 5 - Weekly Warrior */}
              <div className="flex flex-col items-center text-center">
                <div className={`h-20 w-20 rounded-full bg-eco-green-100 flex items-center justify-center mb-3 relative ${
                  userProfile?.unlockedBadges?.includes('weekly-warrior') ? '' : 'opacity-40'
                }`}>
                  <Clock className="h-10 w-10 text-eco-green-600" />
                  {userProfile?.unlockedBadges?.includes('weekly-warrior') && (
                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      5
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm">Weekly Warrior</h4>
                <p className="text-xs text-gray-500">Trip every day for a week</p>
                {!userProfile?.unlockedBadges?.includes('weekly-warrior') && (
                  <span className="text-xs text-orange-600 mt-1">
                    {userProfile?.streak 
                      ? `${7 - userProfile.streak} more days to unlock`
                      : "Start your streak"
                    }
                  </span>
                )}
              </div>
              
              {/* Badge 6 - Carbon Champion */}
              <div className="flex flex-col items-center text-center">
                <div className={`h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center mb-3 relative ${
                  userProfile?.unlockedBadges?.includes('carbon-champion') ? '' : 'opacity-40'
                }`}>
                  <Award className="h-10 w-10 text-purple-600" />
                  {userProfile?.unlockedBadges?.includes('carbon-champion') && (
                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      6
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm">Carbon Champion</h4>
                <p className="text-xs text-gray-500">Save 50kg of CO₂</p>
                {!userProfile?.unlockedBadges?.includes('carbon-champion') && (
                  <span className="text-xs text-orange-600 mt-1">
                    {totalCO2Saved > 0 
                      ? `${(50 - totalCO2Saved).toFixed(1)}kg more to unlock` 
                      : "Save CO₂ to unlock"
                    }
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
