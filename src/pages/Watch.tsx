import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { ShareMenu } from "@/components/ShareMenu";
import { Eye, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadVideoFromUrl } from "@/lib/downloadVideo";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  views: number;
  created_at: string;
}

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, description, video_url, views, created_at")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) setNotFound(true);
      else {
        setVideo(data);
        // fire-and-forget view count bump
        supabase.from("videos").update({ views: (data.views ?? 0) + 1 }).eq("id", id).then();
      }
      setLoading(false);
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {loading ? (
          <div className="mt-6 aspect-[9/16] max-w-sm animate-pulse rounded-3xl bg-muted" />
        ) : notFound || !video ? (
          <div className="mt-12 rounded-3xl bg-card p-10 text-center ring-1 ring-border">
            <h1 className="font-display text-2xl text-ink">Video not found</h1>
            <p className="mt-2 text-muted-foreground">This link may have expired or been removed.</p>
            <Link to="/" className="mt-6 inline-flex rounded-full bg-coral px-5 py-2 text-sm font-semibold text-accent-foreground">
              Discover videos
            </Link>
          </div>
        ) : (
          <article className="mt-6 grid gap-8 sm:grid-cols-[minmax(0,360px)_1fr]">
            <div className="overflow-hidden rounded-3xl bg-ink shadow-card ring-1 ring-black/5">
              <video
                src={video.video_url}
                controls
                autoPlay
                playsInline
                className="aspect-[9/16] w-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink">{video.title}</h1>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
              {video.description && (
                <p className="mt-4 whitespace-pre-wrap text-ink/80">{video.description}</p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <ShareMenu videoId={video.id} title={video.title} variant="button" />
                <Button
                  variant="outline"
                  onClick={() => downloadVideoFromUrl(video.video_url, video.title)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default Watch;
