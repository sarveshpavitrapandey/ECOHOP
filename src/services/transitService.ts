
import { TransitRoute, TransportType } from "@/types";

// Transit stop interface
export interface TransitStop {
  id?: string;
  name: string;
  type: 'bus' | 'metro';
  line?: string;
}

// Transit booking interface
export interface TransitBooking {
  id?: string;
  userId: string;
  fromStopId: string;
  fromStopName: string;
  toStopId: string;
  toStopName: string;
  transitType: 'bus' | 'metro';
  date: { toDate: () => Date };
  bookingTime: { toDate: () => Date };
  distance: number;
  co2Saved: number;
  pointsEarned: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

// Mock transit stops
const mockMetroStops = [
  { id: "m1", name: "Pcmc", type: "metro", line: "Purple Line" },
  { id: "m2", name: "Sant Tukaram Nagar", type: "metro", line: "Purple Line" },
  { id: "m3", name: "Bhosari", type: "metro", line: "Purple Line" },
  { id: "m4", name: "Vanaz", type: "metro", line: "Aqua Line" },
  { id: "m5", name: "Anand Nagar", type: "metro", line: "Aqua Line" },
  { id: "m6", name: "Ideal Colony", type: "metro", line: "Aqua Line" }
];

const mockBusStops = [
  { id: "b1", name: "Alandi", type: "bus" },
  { id: "b2", name: "Anand Park", type: "bus" },
  { id: "b3", name: "Appa Balawant Chowk", type: "bus" },
  { id: "b4", name: "Azadnagar", type: "bus" },
  { id: "b5", name: "Balewadi Depot", type: "bus" }
];

// Initialize transit stops in localStorage
export const initializeTransitStops = async (): Promise<void> => {
  try {
    if (!localStorage.getItem("ecoHopTransitStops")) {
      const allStops = [...mockMetroStops, ...mockBusStops];
      localStorage.setItem("ecoHopTransitStops", JSON.stringify(allStops));
    }
  } catch (error) {
    console.error("Error initializing transit stops:", error);
  }
};

// Get all transit stops
export const getAllTransitStops = async (type?: 'bus' | 'metro'): Promise<TransitStop[]> => {
  try {
    await initializeTransitStops();
    
    const stops = JSON.parse(localStorage.getItem("ecoHopTransitStops") || "[]");
    
    if (type) {
      return stops.filter((stop: TransitStop) => stop.type === type);
    }
    
    return stops;
  } catch (error) {
    console.error("Error fetching transit stops:", error);
    return [];
  }
};

// Get metro lines
export const getMetroLines = async (): Promise<string[]> => {
  try {
    const stops = await getAllTransitStops('metro');
    const lines = stops
      .map((stop: TransitStop) => stop.line)
      .filter((line: string | undefined, index: number, self: (string | undefined)[]) => 
        line && self.indexOf(line) === index
      ) as string[];
    
    return lines;
  } catch (error) {
    console.error("Error fetching metro lines:", error);
    return [];
  }
};

// Get stops by line
export const getStopsByLine = async (line: string): Promise<TransitStop[]> => {
  try {
    const stops = await getAllTransitStops('metro');
    return stops.filter((stop: TransitStop) => stop.line === line);
  } catch (error) {
    console.error("Error fetching stops by line:", error);
    return [];
  }
};

// Book a transit trip
export const bookTransit = async (
  userId: string,
  fromStopId: string,
  toStopId: string,
  transitType: 'bus' | 'metro',
  date: Date
): Promise<TransitBooking | null> => {
  try {
    await initializeTransitStops();
    
    // Get all stops
    const stops = JSON.parse(localStorage.getItem("ecoHopTransitStops") || "[]");
    
    // Find from and to stops
    const fromStop = stops.find((stop: TransitStop) => stop.id === fromStopId);
    const toStop = stops.find((stop: TransitStop) => stop.id === toStopId);
    
    if (!fromStop || !toStop) {
      throw new Error("One or both stops not found");
    }
    
    // Calculate distance and CO2 saved
    const distance = 5 + Math.random() * 10; // Mock distance calculation
    const co2Saved = transitType === 'bus' ? distance * 0.2 : distance * 0.3; // Different CO2 savings for bus vs metro
    const pointsEarned = Math.round(co2Saved * 5); // 5 points per kg of CO2 saved
    
    // Create booking
    const booking: TransitBooking = {
      id: `booking${Date.now()}`,
      userId,
      fromStopId,
      fromStopName: fromStop.name,
      toStopId,
      toStopName: toStop.name,
      transitType,
      date: { toDate: () => date },
      bookingTime: { toDate: () => new Date() },
      distance,
      co2Saved,
      pointsEarned,
      status: 'upcoming'
    };
    
    // Get existing bookings
    const bookings = JSON.parse(localStorage.getItem("ecoHopTransitBookings") || "[]");
    
    // Add new booking
    bookings.push(booking);
    
    // Save to localStorage
    localStorage.setItem("ecoHopTransitBookings", JSON.stringify(bookings));
    
    // Update user points
    const profiles = JSON.parse(localStorage.getItem("ecoHopUserProfiles") || "{}");
    if (profiles[userId]) {
      profiles[userId] = {
        ...profiles[userId],
        totalPoints: profiles[userId].totalPoints + pointsEarned,
        co2Saved: profiles[userId].co2Saved + co2Saved,
        totalTrips: profiles[userId].totalTrips + 1
      };
      localStorage.setItem("ecoHopUserProfiles", JSON.stringify(profiles));
    }
    
    return booking;
  } catch (error) {
    console.error("Error booking transit:", error);
    return null;
  }
};

// Get user's transit bookings
export const getUserTransitBookings = async (userId: string): Promise<TransitBooking[]> => {
  try {
    const bookings = JSON.parse(localStorage.getItem("ecoHopTransitBookings") || "[]");
    return bookings.filter((booking: TransitBooking) => booking.userId === userId)
      .sort((a: TransitBooking, b: TransitBooking) => 
        b.date.toDate().getTime() - a.date.toDate().getTime()
      );
  } catch (error) {
    console.error("Error fetching user transit bookings:", error);
    return [];
  }
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string, 
  status: 'upcoming' | 'completed' | 'cancelled'
): Promise<boolean> => {
  try {
    const bookings = JSON.parse(localStorage.getItem("ecoHopTransitBookings") || "[]");
    const index = bookings.findIndex((booking: TransitBooking) => booking.id === bookingId);
    
    if (index !== -1) {
      bookings[index].status = status;
      localStorage.setItem("ecoHopTransitBookings", JSON.stringify(bookings));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};

// Add the fetchTransitRoutes function
export const fetchTransitRoutes = async (startLocation: string, endLocation: string): Promise<TransitRoute[]> => {
  try {
    console.log("Fetching routes from", startLocation, "to", endLocation);
    
    // This is a mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    // Mock data for routes between the given locations
    const routes: TransitRoute[] = [
      {
        startAddress: startLocation,
        endAddress: endLocation,
        distance: 12.5,
        duration: 45,
        totalCo2Saved: 2.63,
        steps: [
          {
            type: 'bus' as TransportType,
            instructions: `Take bus from ${startLocation} to Transfer Station`,
            distance: 8.2,
            duration: 25,
            transitDetails: {
              numStops: 6
            }
          },
          {
            type: 'metro' as TransportType,
            instructions: `Take metro from Transfer Station to ${endLocation}`,
            distance: 4.3,
            duration: 15,
            transitDetails: {
              numStops: 3
            }
          }
        ]
      },
      {
        startAddress: startLocation,
        endAddress: endLocation,
        distance: 15.8,
        duration: 38,
        totalCo2Saved: 3.32,
        steps: [
          {
            type: 'metro' as TransportType,
            instructions: `Take express metro from ${startLocation} to ${endLocation}`,
            distance: 15.8,
            duration: 38,
            transitDetails: {
              numStops: 4
            }
          }
        ]
      },
      {
        startAddress: startLocation,
        endAddress: endLocation,
        distance: 10.2,
        duration: 52,
        totalCo2Saved: 2.14,
        steps: [
          {
            type: 'bus' as TransportType,
            instructions: `Take bus 107 from ${startLocation} to Downtown`,
            distance: 5.5,
            duration: 22,
            transitDetails: {
              numStops: 5
            }
          },
          {
            type: 'bus' as TransportType,
            instructions: `Take bus 204 from Downtown to ${endLocation}`,
            distance: 4.7,
            duration: 25,
            transitDetails: {
              numStops: 7
            }
          }
        ]
      }
    ];
    
    return routes;
  } catch (error) {
    console.error("Error fetching transit routes:", error);
    return [];
  }
};
