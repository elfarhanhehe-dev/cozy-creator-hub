import { toast } from "sonner";

export async function downloadVideoFromUrl(url: string, title: string) {
  try {
    toast.loading("Preparing download...", { id: "dl" });
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch video");
    const blob = await res.blob();
    const ext = (blob.type.split("/")[1] || "mp4").split(";")[0];
    const safe = title.replace(/[^\w\-]+/g, "_").slice(0, 80) || "video";
    const a = document.createElement("a");
    const objUrl = URL.createObjectURL(blob);
    a.href = objUrl;
    a.download = `${safe}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objUrl);
    toast.success("Download started", { id: "dl" });
  } catch (e: any) {
    toast.error(e?.message ?? "Download failed", { id: "dl" });
  }
}
