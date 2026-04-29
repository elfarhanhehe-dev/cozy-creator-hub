import { Play, Share2, Heart } from "lucide-react";
import { useRef, useState } from "react";

export const VideoCard = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      {/* Floating accent blobs */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-coral/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-12 -right-8 h-40 w-40 rounded-full bg-sage/40 blur-3xl" aria-hidden />

      <div className="relative overflow-hidden rounded-[2rem] bg-ink shadow-card ring-1 ring-black/5">
        {/* Top action chips */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4">
          <button
            onClick={() => setLiked((l) => !l)}
            aria-label="Like"
            className="flex items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-sm font-semibold text-ink shadow-soft backdrop-blur hover:bg-background"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-coral text-coral" : ""}`} />
            <span>{liked ? "Liked" : "Like"}</span>
          </button>
          <button
            aria-label="Share"
            className="flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-accent-foreground shadow-soft hover:bg-coral-deep"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Video */}
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster=""
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src="" type="video/mp4" />
          </video>

          {/* Gradient overlay for play button readability */}
          {!playing && (
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/40" />
          )}

          {/* Center play button */}
          {!playing && (
            <button
              onClick={togglePlay}
              aria-label="Play video"
              className="group absolute inset-0 z-10 flex items-center justify-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-background/95 shadow-card ring-1 ring-black/5 group-hover:scale-105">
                <Play className="ml-1 h-8 w-8 fill-ink text-ink" />
              </span>
            </button>
          )}

          {/* Tap-to-pause when playing */}
          {playing && (
            <button
              onClick={togglePlay}
              aria-label="Pause video"
              className="absolute inset-0 z-10"
            />
          )}
        </div>
      </div>

      {/* CTA below */}
      <button className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-6 py-4 text-base font-semibold text-background shadow-soft hover:bg-ink/90">
        <span>Watch trending videos</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-coral">
          <Play className="ml-0.5 h-3.5 w-3.5 fill-background text-background" />
        </span>
      </button>
    </div>
  );
};
