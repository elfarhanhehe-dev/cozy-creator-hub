import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Upload } from "lucide-react";

export const SiteHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-background">
          <span className="font-display text-lg font-bold">V</span>
        </span>
        <span className="font-display text-xl font-semibold tracking-tight text-ink">
          Vidi<span className="text-coral">.</span>co
        </span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
        <Link to="/" className="hover:text-ink">Discover</Link>
        <Link to="/upload" className="hover:text-ink">Upload</Link>
      </nav>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Button asChild className="rounded-full bg-coral text-accent-foreground hover:bg-coral-deep">
              <Link to="/upload"><Upload className="mr-2 h-4 w-4" />Share</Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button asChild className="rounded-full bg-coral text-accent-foreground hover:bg-coral-deep">
            <Link to="/auth">Sign in</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
