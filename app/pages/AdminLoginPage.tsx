import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSession, signIn } from "../lib/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const session = await getSession();

    setLoggedIn(!!session);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSigningIn(true);

    const { error } = await signIn(email, password);

    if (error) {
      setSigningIn(false);
      alert(error.message);
      return;
    }

    setLoggedIn(true);
    setSigningIn(false);
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <p className="text-sm text-[var(--muted)]">
          Checking session...
        </p>
      </section>
    );
  }

  if (loggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-2 text-center text-3xl font-bold">
          Admin Login
        </h1>

        <p className="mb-8 text-center text-sm text-[var(--muted)]">
          Sign in to manage your website.
        </p>

        <input
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={signingIn}
          className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-50"
        >
          {signingIn ? "Signing In..." : "Login"}
        </button>
      </form>
    </section>
  );
}