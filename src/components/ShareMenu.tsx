import { useState } from "react";
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  videoId: string;
  title: string;
  variant?: "icon" | "button";
  className?: string;
}

export const buildShareLink = (videoId: string) => {
  // Branded share format: vidi.co/v/<id>
  // Resolves on this site at /v/:id (works on any deploy origin too).
  if (typeof window === "undefined") return `https://vidi.co/v/${videoId}`;
  return `${window.location.origin}/v/${videoId}`;
};

export const ShareMenu = ({ videoId, title, variant = "icon", className }: Props) => {
  const [copied, setCopied] = useState(false);
  const link = buildShareLink(videoId);
  const branded = `vidi.co/v/${videoId}`;
  const text = encodeURIComponent(`${title} — watch on Vidi.co`);
  const url = encodeURIComponent(link);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied", { description: branded });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Watch "${title}" on Vidi.co`, url: link });
      } catch {
        /* cancelled */
      }
    } else {
      copy();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className={`rounded-full ${className ?? ""}`}
            aria-label="Share video"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={`rounded-full ${className ?? ""}`}
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Share link
        </DropdownMenuLabel>
        <div className="mx-2 mb-2 flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
          <span className="truncate font-mono text-ink">{branded}</span>
          <button
            onClick={copy}
            className="shrink-0 text-coral hover:opacity-80"
            aria-label="Copy link"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <DropdownMenuItem onClick={copy}>
          <Copy className="mr-2 h-4 w-4" /> Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={nativeShare}>
          <Share2 className="mr-2 h-4 w-4" /> Share via…
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={`https://wa.me/?text=${text}%20${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="mr-2 h-4 w-4" /> Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="mr-2 h-4 w-4" /> X / Twitter
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
