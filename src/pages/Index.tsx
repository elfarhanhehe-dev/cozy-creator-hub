import { VideoCard } from "@/components/VideoCard";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-background">
            <span className="font-display text-lg font-bold">V</span>
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Vidi<span className="text-coral">.</span>co
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#discover" className="hover:text-ink">Discover</a>
          <a href="#upload" className="hover:text-ink">Upload</a>
          <a href="#about" className="hover:text-ink">About</a>
        </nav>
        <a
          href="#upload"
          className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-accent-foreground shadow-soft hover:bg-coral-deep"
        >
          Share a video
        </a>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-6 sm:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" />
              New · 2026
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-ink text-balance sm:text-6xl lg:text-7xl">
              A calmer place to <em className="not-italic text-coral">share</em> the videos you love.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground text-balance">
              Vidi.co gives every clip its own quiet stage — no noise, no clutter,
              just one link to share anywhere.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#upload"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background shadow-soft hover:bg-ink/90"
              >
                Upload a video
              </a>
              <a
                href="#discover"
                className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-ink hover:bg-muted"
              >
                Browse trending
              </a>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Creators</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">12k+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Videos</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">86k</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Countries</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">31</dd>
              </div>
            </dl>
          </div>

          {/* Video card */}
          <div className="order-1 lg:order-2">
            <VideoCard />
          </div>
        </div>
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
