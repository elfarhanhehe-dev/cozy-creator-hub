import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

const Upload = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;
    if (file.size > MAX_BYTES) {
      toast.error("File too large. Max 100 MB.");
      return;
    }
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file.");
      return;
    }

    setUploading(true);
    setProgress(10);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("videos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      setProgress(70);

      const { data: pub } = supabase.storage.from("videos").getPublicUrl(path);

      const { error: insErr } = await supabase.from("videos").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        video_url: pub.publicUrl,
        storage_path: path,
      });
      if (insErr) throw insErr;

      setProgress(100);
      toast.success("Video shared!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display text-4xl font-semibold text-ink">Share a video</h1>
        <p className="mt-2 text-muted-foreground">Upload an MP4, WebM or MOV — up to 100 MB.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" placeholder="Give your video a name" />
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={3} placeholder="Tell viewers what it's about" />
          </div>
          <div>
            <Label htmlFor="file">Video file</Label>
            <label
              htmlFor="file"
              className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background/50 px-6 py-10 text-center hover:border-coral hover:bg-background"
            >
              <UploadCloud className="h-8 w-8 text-coral" />
              <span className="text-sm font-medium text-ink">
                {file ? file.name : "Click to choose a video"}
              </span>
              {file && (
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              )}
              <input
                id="file"
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {uploading && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-coral transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-ink">Cancel</Link>
            <Button
              type="submit"
              disabled={!file || !title || uploading}
              className="rounded-full bg-coral px-6 text-accent-foreground hover:bg-coral-deep"
            >
              {uploading ? "Uploading…" : "Publish video"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Upload;
