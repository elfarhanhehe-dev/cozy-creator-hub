import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAnonId } from "@/lib/anonId";
import { cn } from "@/lib/utils";

interface Props {
  videoId: string;
  variant?: "icon" | "button";
}

export const LikeButton = ({ videoId, variant = "icon" }: Props) => {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { count: c } = await supabase
        .from("video_likes")
        .select("id", { count: "exact", head: true })
        .eq("video_id", videoId);
      if (!active) return;
      setCount(c ?? 0);

      const { data: { user } } = await supabase.auth.getUser();
      const q = supabase.from("video_likes").select("id").eq("video_id", videoId).limit(1);
      const { data } = user
        ? await q.eq("user_id", user.id)
        : await q.eq("anon_id", getAnonId());
      if (!active) return;
      setLiked((data?.length ?? 0) > 0);
    };
    load();
    return () => { active = false; };
  }, [videoId]);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const anonId = getAnonId();

    if (liked) {
      const q = supabase.from("video_likes").delete().eq("video_id", videoId);
      const { error } = user
        ? await q.eq("user_id", user.id)
        : await q.eq("anon_id", anonId);
      if (!error) {
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
      }
    } else {
      const payload = user
        ? { video_id: videoId, user_id: user.id, anon_id: null }
        : { video_id: videoId, user_id: null, anon_id: anonId };
      const { error } = await supabase.from("video_likes").insert(payload);
      if (!error) {
        setLiked(true);
        setCount((c) => c + 1);
      }
    }
    setBusy(false);
  };

  if (variant === "button") {
    return (
      <button
        onClick={toggle}
        disabled={busy}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
          liked
            ? "bg-coral text-accent-foreground ring-coral"
            : "bg-background text-ink ring-border hover:bg-muted"
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
        <span>{count.toLocaleString()}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={liked ? "Unlike" : "Like"}
      className="flex items-center gap-1 rounded-full bg-background/90 px-3 py-2 text-xs font-semibold text-ink shadow-card hover:bg-background"
    >
      <Heart className={cn("h-4 w-4", liked && "fill-coral text-coral")} />
      <span>{count.toLocaleString()}</span>
    </button>
  );
};
