
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Bus, Train, Calendar as CalendarIcon, MapPin, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { getAllTransitStops, getMetroLines, getStopsByLine, bookTransit, TransitStop } from "@/services/transitService";
import { addPointsToUser, updateUserStreak } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TicketBooking() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { refreshUserData } = useUserData();
  
  // Transit state
  const [transitType, setTransitType] = useState<'bus' | 'metro'>('bus');
  const [busStops, setBusStops] = useState<TransitStop[]>([]);
  const [metroLines, setMetroLines] = useState<string[]>([]);
  const [metroStops, setMetroStops] = useState<TransitStop[]>([]);
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [fromStop, setFromStop] = useState<string>("");
  const [toStop, setToStop] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingResult, setBookingResult] = useState<any>(null);
  
  // Load transit data
  useEffect(() => {
    const loadTransitData = async () => {
      try {
        // Get bus stops
        const busStopsData = await getAllTransitStops('bus');
        setBusStops(busStopsData);
        
        // Get metro lines
        const metroLinesData = await getMetroLines();
        setMetroLines(metroLinesData);
        
        // If there are metro lines, get stops for the first line
        if (metroLinesData.length > 0) {
          setSelectedLine(metroLinesData[0]);
          const lineStops = await getStopsByLine(metroLinesData[0]);
          setMetroStops(lineStops);
        }
      } catch (error) {
        console.error("Error loading transit data:", error);
        toast({
          title: "Error",
          description: "Failed to load transit data",
          variant: "destructive",
        });
      }
    };
    
    loadTransitData();
  }, [toast]);
  
  // Load stops when metro line changes
  useEffect(() => {
    if (transitType === 'metro' && selectedLine) {
      const loadLineStops = async () => {
        try {
          const lineStops = await getStopsByLine(selectedLine);
          setMetroStops(lineStops);
          setFromStop("");
          setToStop("");
        } catch (error) {
          console.error("Error loading line stops:", error);
        }
      };
      
      loadLineStops();
    }
  }, [selectedLine, transitType]);
  
  const handleBooking = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to book a trip",
        variant: "destructive",
      });
      return;
    }
    
    if (!fromStop || !toStop) {
      toast({
        title: "Error",
        description: "Please select both origin and destination",
        variant: "destructive",
      });
      return;
    }
    
    if (fromStop === toStop) {
      toast({
        title: "Error",
        description: "Origin and destination cannot be the same",
        variant: "destructive",
      });
      return;
    }
    
    setBookingStatus('loading');
    
    try {
      const booking = await bookTransit(
        currentUser.uid,
        fromStop,
        toStop,
        transitType,
        date
      );
      
      if (booking) {
        // Update user points and streak
        await Promise.all([
          addPointsToUser(
            currentUser.uid, 
            booking.pointsEarned, 
            booking.co2Saved, 
            1
          ),
          updateUserStreak(currentUser.uid)
        ]);
        
        setBookingResult(booking);
        setBookingStatus('success');
        
        toast({
          title: "Booking Successful",
          description: `Your ${transitType} trip has been booked!`,
        });
        
        // Refresh user data
        refreshUserData();
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error("Error booking transit:", error);
      setBookingStatus('error');
      
      toast({
        title: "Booking Failed",
        description: "There was a problem booking your trip",
        variant: "destructive",
      });
    }
  };
  
  const resetBooking = () => {
    setBookingStatus('idle');
    setBookingResult(null);
    setFromStop("");
    setToStop("");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Transit Ticket</h1>
          <p className="text-gray-600">
            Book your eco-friendly commute and start earning rewards
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {bookingStatus === 'success' ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-center text-2xl">Booking Successful!</CardTitle>
                  <CardDescription className="text-center">
                    Your trip has been booked successfully
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {bookingResult && (
                    <>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between mb-6">
                          <div className="mb-4 sm:mb-0">
                            <p className="text-sm text-gray-500">From</p>
                            <p className="text-lg font-medium">{bookingResult.fromStopName}</p>
                          </div>
                          
                          <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-eco-green-100 flex items-center justify-center">
                              {bookingResult.transitType === 'bus' ? (
                                <Bus className="h-5 w-5 text-eco-green-600" />
                              ) : (
                                <Train className="h-5 w-5 text-eco-green-600" />
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 sm:mt-0">
                            <p className="text-sm text-gray-500">To</p>
                            <p className="text-lg font-medium">{bookingResult.toStopName}</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">
                              {format(bookingResult.date.toDate(), 'MMMM d, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Distance</p>
                            <p className="font-medium">{bookingResult.distance.toFixed(1)} km</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">CO₂ Saved</p>
                            <p className="font-medium text-eco-green-600">{bookingResult.co2Saved.toFixed(2)} kg</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Points Earned</p>
                            <p className="font-medium text-eco-amber-600">{bookingResult.pointsEarned} points</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6 flex justify-center">
                        <Button onClick={resetBooking}>Book Another Trip</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Book Your Transit</CardTitle>
                  <CardDescription>
                    Select your transit type, origin, destination, and date
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Tabs 
                    defaultValue="bus" 
                    onValueChange={(value) => setTransitType(value as 'bus' | 'metro')}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="bus" className="flex items-center">
                        <Bus className="h-4 w-4 mr-2" />
                        Bus
                      </TabsTrigger>
                      <TabsTrigger value="metro" className="flex items-center">
                        <Train className="h-4 w-4 mr-2" />
                        Metro
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="bus" className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Origin</label>
                          <Select 
                            value={fromStop}
                            onValueChange={setFromStop}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select origin stop" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {busStops.map((stop) => (
                                <SelectItem key={stop.id} value={stop.id!}>
                                  {stop.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Destination</label>
                          <Select 
                            value={toStop}
                            onValueChange={setToStop}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination stop" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {busStops.map((stop) => (
                                <SelectItem key={stop.id} value={stop.id!}>
                                  {stop.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="metro" className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Metro Line</label>
                          <Select 
                            value={selectedLine}
                            onValueChange={setSelectedLine}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select metro line" />
                            </SelectTrigger>
                            <SelectContent>
                              {metroLines.map((line) => (
                                <SelectItem key={line} value={line}>
                                  {line}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Origin</label>
                          <Select 
                            value={fromStop}
                            onValueChange={setFromStop}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select origin station" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {metroStops.map((stop) => (
                                <SelectItem key={stop.id} value={stop.id!}>
                                  {stop.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Destination</label>
                          <Select 
                            value={toStop}
                            onValueChange={setToStop}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination station" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {metroStops.map((stop) => (
                                <SelectItem key={stop.id} value={stop.id!}>
                                  {stop.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => date && setDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {fromStop && toStop && fromStop === toStop && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                      <p className="text-sm text-red-600">Origin and destination cannot be the same</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-6">
                    <Button 
                      onClick={handleBooking} 
                      disabled={bookingStatus === 'loading' || !fromStop || !toStop || fromStop === toStop}
                      className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                    >
                      {bookingStatus === 'loading' ? "Booking..." : "Book Trip"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Info Cards */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MapPin className="h-5 w-5 mr-2 text-eco-green-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 w-8 h-8 bg-eco-green-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-eco-green-600">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium">Select Your Transit</h4>
                    <p className="text-sm text-gray-500">Choose between bus or metro for your journey</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-8 h-8 bg-eco-green-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-eco-green-600">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium">Enter Your Route</h4>
                    <p className="text-sm text-gray-500">Select your origin and destination stops</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-8 h-8 bg-eco-green-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-eco-green-600">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium">Book & Earn Points</h4>
                    <p className="text-sm text-gray-500">Complete your booking and earn points based on CO₂ saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <ArrowRight className="h-5 w-5 mr-2 text-eco-amber-600" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-eco-amber-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-eco-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm">Earn points for every eco-friendly trip</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-eco-amber-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-eco-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm">Redeem points for rewards and discounts</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-eco-amber-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-eco-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm">Track your environmental impact</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-eco-amber-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-eco-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm">Unlock badges and achievements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
