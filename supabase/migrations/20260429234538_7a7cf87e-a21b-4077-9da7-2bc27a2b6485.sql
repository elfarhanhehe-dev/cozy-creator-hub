DROP POLICY IF EXISTS "Public can read video files" ON storage.objects;

CREATE POLICY "Public can read video files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'videos'
    AND lower(storage.extension(name)) IN ('mp4', 'webm', 'mov', 'm4v', 'ogg')
  );