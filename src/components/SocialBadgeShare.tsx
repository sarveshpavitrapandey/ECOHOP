
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShareBadge } from "@/components/ShareBadge";
import { Award, Share2 } from "lucide-react";

interface SocialBadgeShareProps {
  badgeTitle: string;
  badgeDescription: string;
  badgeImage: string;
  isUnlocked: boolean;
}

export default function SocialBadgeShare({
  badgeTitle,
  badgeDescription,
  badgeImage,
  isUnlocked,
}: SocialBadgeShareProps) {
  if (!isUnlocked) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share badge</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your achievement</DialogTitle>
          <DialogDescription>
            Let your friends know about your eco-friendly commuting badge!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <div className="h-24 w-24 bg-eco-green-100 rounded-full flex items-center justify-center mb-4">
            <Award className="h-12 w-12 text-eco-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-center">{badgeTitle}</h3>
          <p className="text-sm text-gray-500 text-center mt-1 mb-4">{badgeDescription}</p>
          
          <img
            src={badgeImage}
            alt={badgeTitle}
            className="w-40 h-40 object-contain my-2 rounded-lg border border-gray-200"
          />
        </div>
        
        <DialogFooter className="flex sm:justify-center">
          <ShareBadge 
            title={badgeTitle} 
            description={badgeDescription} 
            imageUrl={badgeImage}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
