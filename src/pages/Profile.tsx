
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, MapPin, Award, Settings, Bell, Shield, LogOut } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // User profile data (would be fetched from API)
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    city: "San Francisco",
    preferredTransport: "Metro",
    joinedDate: "May 2023",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    tripReminders: true,
    pointsUpdates: true,
    newRewards: true,
    weeklyReport: false,
    marketingEmails: false
  });
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">
            Manage your account and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img 
                      src={profile.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-xl">{profile.name}</h3>
                  <p className="text-gray-500">Member since {profile.joinedDate}</p>
                </div>
                
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total Points</span>
                    <span className="font-medium">248 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Badges</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">CO₂ Saved</span>
                    <span className="font-medium">47.2 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total Trips</span>
                    <span className="font-medium">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Best Streak</span>
                    <span className="font-medium">12 days</span>
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full mt-6"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="account">
              <TabsList className="mb-6">
                <TabsTrigger value="account" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Account Info
                </TabsTrigger>
                <TabsTrigger value="badges" className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Badges
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              {/* Account Info Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              placeholder="Your name"
                              className="pl-10"
                              value={profile.name}
                              onChange={(e) => setProfile({...profile, name: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              className="pl-10"
                              value={profile.email}
                              onChange={(e) => setProfile({...profile, email: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="city"
                              placeholder="Your city"
                              className="pl-10"
                              value={profile.city}
                              onChange={(e) => setProfile({...profile, city: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="preferredTransport">Preferred Transport</Label>
                          <select
                            id="preferredTransport"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eco-green-500"
                            value={profile.preferredTransport}
                            onChange={(e) => setProfile({...profile, preferredTransport: e.target.value})}
                          >
                            <option value="Bus">Bus</option>
                            <option value="Metro">Metro</option>
                            <option value="Both">Both Equally</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <Button 
                          type="submit" 
                          className="bg-eco-green-600 hover:bg-eco-green-700"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Badges Tab */}
              <TabsContent value="badges">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Badges</CardTitle>
                    <CardDescription>
                      Achievements you've earned through eco-friendly commuting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {/* Badge 1 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-eco-green-100 flex items-center justify-center mb-3 relative">
                          <Award className="h-12 w-12 text-eco-green-600" />
                          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                            1
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900">Eco Starter</h4>
                        <p className="text-sm text-gray-500">First trip logged</p>
                        <p className="text-xs text-green-600 mt-1">Achieved May 10, 2023</p>
                      </div>
                      
                      {/* Badge 2 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-eco-blue-100 flex items-center justify-center mb-3 relative">
                          <Award className="h-12 w-12 text-eco-blue-600" />
                          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                            2
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900">Bus Enthusiast</h4>
                        <p className="text-sm text-gray-500">10 bus trips</p>
                        <p className="text-xs text-green-600 mt-1">Achieved May 22, 2023</p>
                      </div>
                      
                      {/* Badge 3 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center mb-3 relative">
                          <Award className="h-12 w-12 text-orange-600" />
                          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-eco-amber-500 flex items-center justify-center text-white text-xs font-bold">
                            3
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900">Consistent Hopper</h4>
                        <p className="text-sm text-gray-500">5-day streak</p>
                        <p className="text-xs text-green-600 mt-1">Achieved June 2, 2023</p>
                      </div>
                      
                      {/* Badge 4 (Locked) */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-eco-blue-100 flex items-center justify-center mb-3 relative opacity-40">
                          <Award className="h-12 w-12 text-eco-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">Metro Master</h4>
                        <p className="text-sm text-gray-500">25 metro trips</p>
                        <p className="text-xs text-orange-600 mt-1">15 more to unlock</p>
                      </div>
                      
                      {/* Badge 5 (Locked) */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-eco-green-100 flex items-center justify-center mb-3 relative opacity-40">
                          <Award className="h-12 w-12 text-eco-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">Weekly Warrior</h4>
                        <p className="text-sm text-gray-500">Trip every day for a week</p>
                        <p className="text-xs text-orange-600 mt-1">2 more days to unlock</p>
                      </div>
                      
                      {/* Badge 6 (Locked) */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center mb-3 relative opacity-40">
                          <Award className="h-12 w-12 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">Carbon Champion</h4>
                        <p className="text-sm text-gray-500">Save 50kg of CO₂</p>
                        <p className="text-xs text-orange-600 mt-1">37.1kg more to unlock</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Settings
                    </CardTitle>
                    <CardDescription>
                      Manage how and when we contact you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tripReminders">Trip Reminders</Label>
                        <p className="text-sm text-gray-500">
                          Receive reminders to log your trips
                        </p>
                      </div>
                      <Switch
                        id="tripReminders"
                        checked={notifications.tripReminders}
                        onCheckedChange={() => handleNotificationChange('tripReminders')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pointsUpdates">Points Updates</Label>
                        <p className="text-sm text-gray-500">
                          Get notified when you earn points
                        </p>
                      </div>
                      <Switch
                        id="pointsUpdates"
                        checked={notifications.pointsUpdates}
                        onCheckedChange={() => handleNotificationChange('pointsUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newRewards">New Rewards</Label>
                        <p className="text-sm text-gray-500">
                          Notifications about new available rewards
                        </p>
                      </div>
                      <Switch
                        id="newRewards"
                        checked={notifications.newRewards}
                        onCheckedChange={() => handleNotificationChange('newRewards')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weeklyReport">Weekly Report</Label>
                        <p className="text-sm text-gray-500">
                          Receive a weekly summary of your eco-impact
                        </p>
                      </div>
                      <Switch
                        id="weeklyReport"
                        checked={notifications.weeklyReport}
                        onCheckedChange={() => handleNotificationChange('weeklyReport')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <p className="text-sm text-gray-500">
                          Receive news and special offers
                        </p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notifications.marketingEmails}
                        onCheckedChange={() => handleNotificationChange('marketingEmails')}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Privacy Settings
                    </CardTitle>
                    <CardDescription>
                      Control your data and privacy preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button variant="outline" className="w-full md:w-auto">
                      Download Your Data
                    </Button>
                    
                    <div className="border-t pt-6">
                      <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Permanently delete your account and all your data
                      </p>
                      <Button variant="destructive" className="w-full md:w-auto">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
