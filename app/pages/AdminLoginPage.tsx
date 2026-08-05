import { useState } from "react";
import { Navigate } from "react-router-dom";
import { signIn, getSession } from "../lib/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [loggedIn, setLoggedIn] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const { error } = await signIn(
      email,
      password
    );

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    const session = await getSession();

    if (session) {
      setLoggedIn(true);
    }
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
        <h1 className="mb-8 text-center text-3xl font-bold">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mb-4 w-full rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="mb-6 w-full rounded-lg border p-3"
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-black py-3 text-white"
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>
      </form>
    </section>
  );
}