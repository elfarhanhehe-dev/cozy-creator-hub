-- Likes table (supports anonymous likes via client-generated anon_id)
CREATE TABLE public.video_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID,
  anon_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT video_likes_identity_check CHECK (user_id IS NOT NULL OR anon_id IS NOT NULL)
);

-- Unique like per identity per video
CREATE UNIQUE INDEX video_likes_user_unique
  ON public.video_likes(video_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX video_likes_anon_unique
  ON public.video_likes(video_id, anon_id) WHERE anon_id IS NOT NULL;
CREATE INDEX video_likes_video_idx ON public.video_likes(video_id);

ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes (needed for counts)
CREATE POLICY "Likes are viewable by everyone"
  ON public.video_likes FOR SELECT
  USING (true);

-- Anyone (including anonymous) can insert a like
CREATE POLICY "Anyone can like a video"
  ON public.video_likes FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid() AND anon_id IS NULL)
    OR (auth.uid() IS NULL AND user_id IS NULL AND anon_id IS NOT NULL)
  );

-- Users can remove their own like (logged in or via anon_id match)
CREATE POLICY "Anyone can unlike their own like"
  ON public.video_likes FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL AND anon_id IS NOT NULL)
  );

-- Fix views: allow anyone to increment the view counter via a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.increment_video_views(_video_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.videos SET views = COALESCE(views, 0) + 1 WHERE id = _video_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_video_views(UUID) TO anon, authenticated;