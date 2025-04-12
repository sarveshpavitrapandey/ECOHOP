import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bus, Bike, Leaf, Award, TrendingUp, MapPin, CheckCircle, ChevronRight, 
  Building, Clock, Users, Star, MessageSquare, Share2, ArrowLeft, ArrowRight
} from 'lucide-react';
import LocalLeaderboard from '@/components/LocalLeaderboard';
import { LeaderboardUser } from '@/types';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock local data for Pimpri
const localLeaderboardData: LeaderboardUser[] = [
  { id: "1", name: "Priya Sharma", points: 850, co2Saved: 42.5, rank: 1, location: "Pimpri" },
  { id: "2", name: "Rahul Patel", points: 720, co2Saved: 36.0, rank: 2, location: "Pimpri" },
  { id: "3", name: "Aisha Khan", points: 685, co2Saved: 34.2, rank: 3, location: "Pimpri" }
];

// Carousel slides
const carouselSlides = [
  {
    id: 1,
    image: "/public/images/86e898ad-5d32-419a-8ba6-06c403cc87b7.jpg",
    title: "Reduce Your Carbon Footprint",
    description: "See your environmental impact and contribute to a greener planet."
  },
  {
    id: 2,
    image: "/public/images/0f06e305-3fab-4fbe-8305-88d10983c5f6.jpg", 
    title: "Earn Points With Every Journey",
    description: "Turn your daily commute into rewards and environmental impact."
  },
  {
    id: 3,
    image: "/public/placeholder.svg",
    title: "Join Our Community",
    description: "Connect with other eco-conscious commuters in your area."
  }
];

export default function Landing() {
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { currentUser } = useAuth();

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Feedback submitted:", { rating, feedbackText });
    setFeedbackSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setRating(null);
      setFeedbackText("");
      setFeedbackSubmitted(false);
    }, 3000);
  };

  useEffect(() => {
    // Auto-rotate carousel
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <section className="relative">
        <Carousel 
          className="w-full"
          setApi={(api) => {
            if (api) {
              api.on("select", () => {
                setActiveSlide(api.selectedScrollSnap());
              });
            }
          }}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent>
            {carouselSlides.map((slide, index) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-[500px] w-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  
                  {/* Hero Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="max-w-lg text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                          {slide.title}
                        </h1>
                        <p className="text-xl mb-8 text-white/90">
                          {slide.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <Button asChild size="lg" className="bg-eco-green-600 hover:bg-eco-green-700">
                            <Link to="/login">Get Started</Link>
                          </Button>
                          <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                            <Link to="/login">
                              Learn More
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${
                  activeSlide === index ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white border-none h-10 w-10" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white border-none h-10 w-10" />
        </Carousel>
      </section>
      
      {/* Stats Section */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="col-span-4 sm:col-span-1 p-4 flex flex-col items-center text-center">
              <div className="rounded-full bg-eco-green-100 p-4 mb-3">
                <Building className="h-6 w-6 text-eco-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Depots</h3>
              <p className="text-3xl font-bold text-eco-green-600">15</p>
            </div>
            
            {/* Stat 2 */}
            <div className="col-span-4 sm:col-span-1 p-4 flex flex-col items-center text-center">
              <div className="rounded-full bg-eco-blue-100 p-4 mb-3">
                <Bus className="h-6 w-6 text-eco-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Daily Routes</h3>
              <p className="text-3xl font-bold text-eco-blue-600">1,736</p>
            </div>
            
            {/* Stat 3 */}
            <div className="col-span-4 sm:col-span-1 p-4 flex flex-col items-center text-center">
              <div className="rounded-full bg-eco-amber-100 p-4 mb-3">
                <Clock className="h-6 w-6 text-eco-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Daily Trips</h3>
              <p className="text-3xl font-bold text-eco-amber-600">20,112</p>
            </div>
            
            {/* Stat 4 */}
            <div className="col-span-4 sm:col-span-1 p-4 flex flex-col items-center text-center">
              <div className="rounded-full bg-eco-green-100 p-4 mb-3">
                <Users className="h-6 w-6 text-eco-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Daily Ridership</h3>
              <p className="text-3xl font-bold text-eco-green-600">1,095,322</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Local Leaderboard Section */}
      <section className="py-12 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LocalLeaderboard 
            users={localLeaderboardData} 
            location="Pimpri"
          />
        </div>
      </section>
      
      {/* Features Section - How EcoHop Works */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How EcoHop Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to earn rewards for choosing eco-friendly transportation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="eco-card">
              <div className="rounded-full bg-eco-green-100 w-12 h-12 flex items-center justify-center mb-5">
                <MapPin className="h-6 w-6 text-eco-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Book Your Tickets</h3>
              <p className="text-gray-600 mb-4">
                Book your bus or metro rides with just a few taps. Enter your start and end locations.
              </p>
              <ul className="space-y-2">
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-eco-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Easy booking for bus & metro</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-eco-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Save favorite routes</span>
                </li>
              </ul>
              <div className="mt-4">
                <Button asChild variant="link" className="text-eco-green-600 px-0">
                  <Link to="/login">
                    Book a trip
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="eco-card">
              <div className="rounded-full bg-eco-blue-100 w-12 h-12 flex items-center justify-center mb-5">
                <TrendingUp className="h-6 w-6 text-eco-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Impact</h3>
              <p className="text-gray-600 mb-4">
                See your environmental impact with detailed statistics on CO₂ saved and distance traveled.
              </p>
              <ul className="space-y-2">
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-eco-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Visual environmental stats</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-eco-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Weekly & monthly reports</span>
                </li>
              </ul>
              <div className="mt-4">
                <Button asChild variant="link" className="text-eco-green-600 px-0">
                  <Link to="/login">
                    View dashboard
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="eco-card">
              <div className="rounded-full bg-eco-amber-100 w-12 h-12 flex items-center justify-center mb-5">
                <Award className="h-6 w-6 text-eco-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Rewards</h3>
              <p className="text-gray-600 mb-4">
                Collect points for each trip and redeem them for exclusive rewards and discounts.
              </p>
              <ul className="space-y-2">
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-eco-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Redeem for gift cards & discounts</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-eco-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Earn badges & complete challenges</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-5 w-5 text-eco-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">Share achievements on social media</span>
                </li>
              </ul>
              <div className="mt-4">
                <Button asChild variant="link" className="text-eco-green-600 px-0">
                  <Link to="/login">
                    See rewards
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feedback Form Section - Only visible to logged in users */}
      {currentUser && (
        <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Experience</h2>
                  <p className="text-gray-600">
                    Help us improve the EcoHop app by sharing your feedback
                  </p>
                </div>
                
                {feedbackSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-eco-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-eco-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-eco-green-700 mb-2">Thank You!</h3>
                    <p className="text-gray-600 text-center">
                      Your feedback has been submitted successfully. We appreciate your input!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How would you rate your experience?
                      </label>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                              rating === value
                                ? 'bg-eco-green-600 text-white'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            onClick={() => handleRatingClick(value)}
                          >
                            <Star className="h-6 w-6" />
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Not satisfied</span>
                        <span>Very satisfied</span>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                        Share your thoughts with us
                      </label>
                      <Textarea
                        id="feedback"
                        placeholder="Tell us what you like or how we can improve..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        type="submit" 
                        className="bg-eco-green-600 hover:bg-eco-green-700"
                        disabled={!rating}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Submit Feedback
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="py-8 bg-gray-100 text-center text-gray-600 text-sm px-4">
        <div className="max-w-7xl mx-auto">
          <p>© 2025 EcoHop. All rights reserved.</p>
          <p className="mt-2">Helping commuters reduce their carbon footprint one trip at a time.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link to="/about" className="hover:text-eco-green-600">About</Link>
            <Link to="/privacy" className="hover:text-eco-green-600">Privacy</Link>
            <Link to="/terms" className="hover:text-eco-green-600">Terms</Link>
            <Link to="/contact" className="hover:text-eco-green-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
