import { Link } from "react-router-dom";
import { signOut } from "../lib/auth";

export default function AdminDashboardPage() {
  async function handleLogout() {
    await signOut();
    window.location.href = "/admin/login";
  }

  const cards = [
    {
      title: "Homepage CMS",
      description: "Manage homepage sections",
      link: "/admin/homepage",
    },
    {
      title: "Products",
      description: "Manage products",
      link: "/admin/products",
    },
    {
      title: "Categories",
      description: "Coming Soon",
      link: "#",
    },
    {
      title: "Orders",
      description: "Coming Soon",
      link: "#",
    },
    {
      title: "Customers",
      description: "Coming Soon",
      link: "#",
    },
    {
      title: "Media Library",
      description: "Coming Soon",
      link: "#",
    },
    {
      title: "Navigation",
      description: "Coming Soon",
      link: "#",
    },
    {
      title: "Settings",
      description: "Coming Soon",
      link: "#",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Dress Like Nawaabs Admin
            </h1>

            <p className="mt-2 text-gray-500">
              Content Management System
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-3 text-white"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {cards.map((card) => (

            <Link
              key={card.title}
              to={card.link}
              className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">
                {card.title}
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                {card.description}
              </p>
            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}