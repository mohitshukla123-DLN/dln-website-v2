import { signOut } from "../lib/auth";

export default function AdminDashboardPage() {
  async function handleLogout() {
    await signOut();
    window.location.href = "/admin/login";
  }

  return (
    <section className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            Dress Like Nawaabs Admin
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-3 text-white"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">
              Products
            </h2>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">
              Categories
            </h2>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">
              Ratings
            </h2>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">
              Stock Alerts
            </h2>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}