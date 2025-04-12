
import { Share2, Facebook, Twitter, Linkedin, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

interface ShareBadgeProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function ShareBadge({ title, description, imageUrl }: ShareBadgeProps) {
  const [copied, setCopied] = useState(false);
  
  const pageUrl = window.location.href;
  
  const shareText = `I earned the "${title}" badge on EcoHop! ${description} Join me in reducing carbon emissions through eco-friendly commuting.`;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(shareText)}`,
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${pageUrl}`);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "You can now paste it anywhere.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => openShareWindow(shareLinks.facebook)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => openShareWindow(shareLinks.twitter)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Twitter className="h-4 w-4 text-sky-500" />
          <span>Twitter</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => openShareWindow(shareLinks.linkedin)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Linkedin className="h-4 w-4 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleCopyLink}
          className="flex items-center gap-2 cursor-pointer"
        >
          {copied ? (
            <CheckCheck className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span>{copied ? "Copied!" : "Copy link"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
