import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSession } from "../../lib/auth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    async function checkSession() {
      const session = await getSession();

      setAuthenticated(!!session);
      setLoading(false);
    }

    checkSession();
  }, []);

  if (loading) return null;

  if (!authenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <>{children}</>;
}