import { Play, Eye } from "lucide-react";
import { useRef, useState } from "react";
import { ShareMenu } from "./ShareMenu";

interface Props {
  videoId?: string;
  videoUrl: string;
  title: string;
  description?: string | null;
  views: number;
}

export const VideoPlayerCard = ({ videoId, videoUrl, title, description, views }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-ink shadow-card ring-1 ring-black/5">
      <div className="relative aspect-[9/16] w-full">
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        {!playing && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/30" />
            <button
              onClick={togglePlay}
              aria-label="Play"
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/95 shadow-card group-hover:scale-105">
                <Play className="ml-1 h-6 w-6 fill-ink text-ink" />
              </span>
            </button>
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-background">
              <h3 className="font-display text-lg font-semibold leading-tight">{title}</h3>
              {description && (
                <p className="mt-1 line-clamp-2 text-sm text-background/80">{description}</p>
              )}
              <div className="mt-2 flex items-center gap-1 text-xs text-background/70">
                <Eye className="h-3.5 w-3.5" />
                <span>{views.toLocaleString()} views</span>
              </div>
            </div>
          </>
        )}
        {playing && (
          <button onClick={togglePlay} aria-label="Pause" className="absolute inset-0 z-10" />
        )}
      </div>
    </div>
  );
};
