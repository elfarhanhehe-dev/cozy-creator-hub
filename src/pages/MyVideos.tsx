import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Save, X, Eye, Download } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  storage_path: string | null;
  views: number;
  created_at: string;
}

const MyVideos = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setVideos(data ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  const startEdit = (v: Video) => {
    setEditingId(v.id);
    setEditTitle(v.title);
    setEditDescription(v.description ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("videos")
      .update({
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, title: editTitle.trim(), description: editDescription.trim() || null }
          : v,
      ),
    );
    toast.success("Video updated");
    cancelEdit();
  };

  const deleteVideo = async (v: Video) => {
    const { error } = await supabase.from("videos").delete().eq("id", v.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (v.storage_path) {
      await supabase.storage.from("videos").remove([v.storage_path]);
    }
    setVideos((prev) => prev.filter((x) => x.id !== v.id));
    toast.success("Video deleted");
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold text-ink">My videos</h1>
            <p className="mt-2 text-muted-foreground">Edit titles, descriptions, or remove your uploads.</p>
          </div>
          <Button asChild className="rounded-full bg-coral text-accent-foreground hover:bg-coral-deep">
            <Link to="/upload">Upload new</Link>
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : videos.length === 0 ? (
            <div className="rounded-3xl bg-card p-10 text-center ring-1 ring-border">
              <p className="text-muted-foreground">You haven't uploaded any videos yet.</p>
              <Button asChild className="mt-4 rounded-full bg-coral text-accent-foreground hover:bg-coral-deep">
                <Link to="/upload">Share your first video</Link>
              </Button>
            </div>
          ) : (
            videos.map((v) => (
              <article key={v.id} className="flex flex-col gap-4 rounded-3xl bg-card p-4 ring-1 ring-border sm:flex-row">
                <video
                  src={v.video_url}
                  className="h-48 w-full shrink-0 rounded-2xl bg-ink object-cover sm:h-32 sm:w-24"
                  preload="metadata"
                  muted
                  playsInline
                />
                <div className="flex flex-1 flex-col gap-3">
                  {editingId === v.id ? (
                    <>
                      <div>
                        <Label htmlFor={`title-${v.id}`}>Title</Label>
                        <Input
                          id={`title-${v.id}`}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          maxLength={120}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`desc-${v.id}`}>Description</Label>
                        <Textarea
                          id={`desc-${v.id}`}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          maxLength={500}
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveEdit(v.id)}
                          disabled={saving}
                          className="rounded-full bg-coral text-accent-foreground hover:bg-coral-deep"
                        >
                          <Save className="mr-1 h-4 w-4" />
                          {saving ? "Saving…" : "Save"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-ink">{v.title}</h3>
                        {v.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{v.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-full" onClick={() => startEdit(v)}>
                          <Pencil className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="rounded-full text-destructive hover:text-destructive">
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this video?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes "{v.title}" and its file. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteVideo(v)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MyVideos;
