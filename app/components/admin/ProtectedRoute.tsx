import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/auth";

interface Props {
  children: React.ReactNode;
}

const ADMIN_USER_ID = "46de4026-8db4-4200-be4f-aa7941abf861";

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const isAdmin =
        session?.user?.id === ADMIN_USER_ID;

      setAuthorized(isAdmin);
      setLoading(false);
    }

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        const isAdmin =
          session?.user?.id === ADMIN_USER_ID;

        setAuthorized(isAdmin);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <p className="text-sm text-[var(--muted)]">
          Loading admin...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <>{children}</>;
}