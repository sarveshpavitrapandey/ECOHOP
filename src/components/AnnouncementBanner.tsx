
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

interface Announcement {
  id: number;
  text: string;
  isNew?: boolean;
}

const announcements: Announcement[] = [
  { id: 1, text: "Recognition for your eco-friendly transportation choices" },
  { id: 2, text: "Special weekend rewards boost - earn 2x points on all rides this Saturday and Sunday" },
  { id: 3, text: "Join our community of green commuters", isNew: true },
  { id: 4, text: "App v1.0 Beta" }
];

export default function AnnouncementBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-gray-900 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length)}
          className="text-white/70 hover:text-white"
          aria-label="Previous announcement"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex-1 text-center flex items-center justify-center">
          <span className="text-sm md:text-base">
            {announcements[currentIndex].text}
            {announcements[currentIndex].isNew && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-400 text-gray-900">
                New
              </span>
            )}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length)}
            className="text-white/70 hover:text-white"
            aria-label="Next announcement"
          >
            <ChevronRight size={18} />
          </button>
          <button 
            onClick={() => setVisible(false)}
            className="text-white/70 hover:text-white"
            aria-label="Close announcements"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
