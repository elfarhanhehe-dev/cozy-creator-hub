import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { VideoPlayerCard } from "@/components/VideoPlayerCard";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  views: number;
  created_at: string;
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("videos")
        .select("id, title, description, video_url, views, created_at")
        .order("created_at", { ascending: false })
        .limit(24);
      setVideos(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pb-24">
        {/* Hero */}
        <section className="grid items-center gap-12 py-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-coral" />
              New · 2026
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-ink text-balance sm:text-6xl lg:text-7xl">
              A calmer place to <em className="not-italic text-coral">share</em> the videos you love.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground text-balance">
              Vidi.co gives every clip its own quiet stage — upload once, share anywhere, no noise.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/upload" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background shadow-soft hover:bg-ink/90">
                Upload a video
              </Link>
              <a href="#feed" className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-ink hover:bg-muted">
                Browse trending
              </a>
            </div>
          </div>

          {/* Featured / first video */}
          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-coral/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-8 h-40 w-40 rounded-full bg-sage/40 blur-3xl" />
            {videos[0] ? (
              <VideoPlayerCard
                videoId={videos[0].id}
                videoUrl={videos[0].video_url}
                title={videos[0].title}
                description={videos[0].description}
                views={videos[0].views}
              />
            ) : (
              <div className="flex aspect-[9/16] items-center justify-center rounded-3xl bg-ink/95 p-6 text-center text-background/80 shadow-card">
                <div>
                  <p className="font-display text-2xl">No videos yet</p>
                  <p className="mt-2 text-sm text-background/60">Be the first to share.</p>
                  <Link to="/upload" className="mt-6 inline-flex rounded-full bg-coral px-5 py-2 text-sm font-semibold text-accent-foreground">
                    Upload now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feed */}
        <section id="feed" className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold text-ink">Latest videos</h2>
            <Link to="/upload" className="text-sm font-medium text-coral hover:underline">
              + Add yours
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[9/16] animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          ) : videos.length <= 1 ? (
            <p className="rounded-2xl border border-dashed border-border bg-background/60 p-10 text-center text-muted-foreground">
              The feed is just getting started. Share the first videos to fill it up.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {videos.slice(1).map((v) => (
                <VideoPlayerCard
                  key={v.id}
                  videoId={v.id}
                  videoUrl={v.video_url}
                  title={v.title}
                  description={v.description}
                  views={v.views}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Vidi.co — made with care in Europe.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Terms</a>
            <a href="#" className="hover:text-ink">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
